import crypto from "node:crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import pug from "pug"
import { stripIndent } from "common-tags"
import type { Database } from "bun:sqlite"
import sendgrid from "@sendgrid/mail"
import type { User, AppRequest, AuthCallback, UserData, UserWithConfirmation, MailResponse } from "./types"

const _mailUsername = process.env.MAIL_USERNAME

const CONFIRMATION_CODE_MAX_AGE_MS = 24 * 60 * 60 * 1000

function randomBase62String(length: number) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace("+", "")
    .replace("/", "")
    .slice(0, length)
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

function sendMail(
  userData: {
    username: string
    email: string
    confirmationCode: string
  },
  request: AppRequest,
  done: (_error: Error | null, _response?: unknown) => void,
) {
  const isProduction = request.app.get("env") !== "development"

  const mailContent = {
    subject: "Verify your email-address for Educatopia",
    text: stripIndent`
      Welcome to Educatopia!
      Finish the sign up process by opening following link:
      http://${request.hostname}/confirm/${userData.confirmationCode}
    `,
    html: pug.renderFile("views/mails/signup.pug", {
      userData,
      hostname: request.hostname,
    }),
  }

  function mailCallback(error: Error | null, response?: unknown) {
    if (error || !response) {
      console.error(error)
      done(error)
      return
    }

    if (process.env.NODE_ENV !== 'test' && !process.env.BUN_TEST) {
      if (isProduction) {
        console.info("Message sent: %s", (response as MailResponse)?.messageId)
      } else {
        console.info(JSON.parse((response as MailResponse)?.message || '{}'))
      }
    }

    done(null, response)
  }

  const fromName = "Educatopia"
  const fromEmail = "info@educatopia.org"

  if (isProduction) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY!)
    sendgrid.send({
      from: {
        email: fromEmail,
        name: fromName,
      },
      to: {
        email: userData.email,
        name: userData.username,
      },
      ...mailContent,
    }).then(
      (response) => mailCallback(null, response),
      (error) => mailCallback(error, null)
    )
  }
  else {
    nodemailer
      .createTransport({
        jsonTransport: true,
      })
      .sendMail({
        from: {
          address: fromEmail,
          name: fromName,
        },
        to: {
          address: userData.email,
          name: userData.username,
        },
        ...mailContent,
      }, mailCallback)
  }
}

export function getUserByUsername(
  db: Database,
  username: string,
  done: (_error: Error | null, _user?: User) => void,
) {
  const result = db
    .query("SELECT * FROM users WHERE username = :username COLLATE NOCASE")
    .get({ username: username.trim() })
  done(null, result as User | undefined)
}

export function signup(
  db: Database,
  request: AppRequest,
  done: (_error: Error | null, _response?: unknown) => void,
) {
  const now = new Date()
  const blackList = [
    "about",
    "admin",
    "api",
    "confirm",
    "exercise",
    "exercises",
    "help",
    "imprint",
    "login",
    "logout",
    "request",
    "settings",
    "signup",
    "team",
    "user",
    "users",
  ]
  const rawUsername = request.body.username
  const rawEmail = request.body.email
  const password = request.body.password

  if (!rawUsername || !rawUsername.trim()) {
    done(new Error("Username must be specified"))
    return
  }

  const userData: UserData = {
    username: rawUsername.trim(),
    name: request.body.name,
    email: rawEmail ? rawEmail.trim() : rawEmail,
    confirmationCode: randomBase62String(33),
    createdAt: now,
    updatedAt: now,
  }

  if (userData.username.length < 3) {
    done(new Error("Username must be at least 3 characters long"))
    return
  }

  if (userData.username.length > 32) {
    done(new Error("Username must be at most 32 characters long"))
    return
  }

  if (!USERNAME_REGEX.test(userData.username)) {
    done(new Error("Username may only contain letters, digits, underscores and hyphens"))
    return
  }

  if (blackList.includes(userData.username.toLowerCase())) {
    done(new Error("This username is not allowed."))
    return
  }

  if (!userData.email) {
    done(new Error("Email address must be specified"))
    return
  }

  if (!isValidEmail(userData.email)) {
    done(new Error("Please enter a valid email address"))
    return
  }

  if (!password || password.length < 8) {
    done(new Error("Password must be at least 8 characters long"))
    return
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    done(new Error("Password must be at most 72 bytes long"))
    return
  }

  bcrypt.hash(password, 16, (error, hash) => {
    if (error) done(error)

    userData.password = hash

    const existing = db
      .query(`
        SELECT username, email FROM users
        WHERE username = :username COLLATE NOCASE
           OR email = :email COLLATE NOCASE
      `)
      .get({ username: userData.username, email: userData.email }) as
      | { username: string; email: string }
      | undefined

    if (existing) {
      if (existing.username.toLowerCase() === userData.username.toLowerCase()) {
        done(new Error("Username is already taken"))
      } else {
        done(new Error("Email-address is already taken"))
      }
      return
    }

    try {
      db.query(`
        INSERT INTO users (username, name, password, email, confirmationCode, confirmationCodeCreatedAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userData.username, userData.name || null, userData.password!, userData.email, userData.confirmationCode, userData.createdAt.toISOString(), userData.createdAt.toISOString())
    } catch (insertError) {
      if (process.env.NODE_ENV !== 'test' && !process.env.BUN_TEST) {
        console.error("Database insertion error:", insertError)
      }
      done(new Error(`User could not be inserted: ${insertError}`))
      return
    }

    sendMail(userData, request, (sendError) => {
      if (sendError) {
        console.error(error)
        done(new Error("Mail could not be sent"))
        return
      }
      done(null, "New user was created and mail was sent")
    })
  })
}

export function confirm(db: Database, confirmationCode: string, done: AuthCallback) {
  const result = db
    .query("SELECT * FROM users WHERE confirmationCode = ?")
    .get(confirmationCode)

  const user = result as
    | (UserWithConfirmation & { confirmationCodeCreatedAt?: string | null })
    | undefined

  if (!user) {
    done(new Error("Invalid confirmation code"))
    return
  }

  const issuedAt = user.confirmationCodeCreatedAt
    ? Date.parse(user.confirmationCodeCreatedAt)
    : NaN
  const isExpired =
    Number.isNaN(issuedAt) ||
    Date.now() - issuedAt > CONFIRMATION_CODE_MAX_AGE_MS

  if (isExpired) {
    try {
      db.query("DELETE FROM users WHERE confirmationCode = ?")
        .run(confirmationCode)
    } catch (deleteError) {
      done(new Error(`Following error occurred while deleting expired user: ${deleteError}`))
      return
    }
    done(new Error("Confirmation code has expired. Please sign up again."))
    return
  }

  try {
    db.query(
      "UPDATE users SET confirmationCode = NULL, confirmationCodeCreatedAt = NULL WHERE confirmationCode = ?",
    ).run(confirmationCode)

    // Remove confirmationCode from user object
    const updatedUser: User = { ...user }
    delete (updatedUser as UserWithConfirmation).confirmationCode

    done(null, updatedUser)
  } catch (updateError) {
    done(new Error(`Following error occurred while updating user: ${updateError}`))
  }
}

export function login(db: Database, username: string, loginPassword: string, done: AuthCallback) {
  const invalidCredentials = new Error("Wrong username or password")

  getUserByUsername(db, username, (error, user) => {
    if (error) {
      if (process.env.NODE_ENV !== 'test' && !process.env.BUN_TEST) {
        console.error("Error occured during lookup of user.")
      }
      done(error)
      return
    }

    if (!user) {
      done(invalidCredentials)
      return
    }

    if ((user as UserWithConfirmation).confirmationCode) {
      done(new Error("Email-address must first be verified!"))
      return
    }

    bcrypt.compare(loginPassword, user.password || '', (compareError, result) => {
      if (compareError) {
        throw compareError
      }

      if (result) {
        done(null, user)
      } else {
        done(invalidCredentials)
      }
    })
  })
}

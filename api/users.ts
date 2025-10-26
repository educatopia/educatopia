import crypto from "node:crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import pug from "pug"
import { stripIndent } from "common-tags"
import type { Database } from "bun:sqlite"
import sendgrid from "@sendgrid/mail"
import type { User, AppRequest, AuthCallback, UserData, UserWithConfirmation, MailResponse } from "./types"

const _mailUsername = process.env.MAIL_USERNAME

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

    if (isProduction) {
      console.info("Message sent: %s", (response as MailResponse)?.messageId)
    } else {
      console.info(JSON.parse((response as MailResponse)?.message || '{}'))
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
    .query("SELECT * FROM users WHERE username == :username")
    .get({ username })
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
  const userData: UserData = {
    username: request.body.username,
    name: request.body.name,
    email: request.body.email,
    confirmationCode: randomBase62String(33),
    createdAt: now,
    updatedAt: now,
  }

  if (!userData.username) {
    done(new Error("Username must be specified"))
    return
  }


  if (blackList.includes(userData.username)) {
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

  bcrypt.hash(request.body.password, 16, (error, hash) => {
    if (error) done(error)

    userData.password = hash

    getUserByUsername(db, userData.username, (findError, user) => {
      if (findError) {
        done(new Error("User could not be found."))
        return
      }

      if (user) {
        if (user.email === userData.email) {
          done(new Error("Email-address is already taken"))
        } else {
          done(new Error("Username is already taken"))
        }
        return
      }

      try {
        db.query(`
          INSERT INTO users (username, name, password, email, confirmationCode, createdAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(userData.username, userData.name || null, userData.password!, userData.email, userData.confirmationCode, userData.createdAt.toISOString())
      } catch (insertError) {
        // Only log in non-test environments
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
  })
}

export function confirm(db: Database, confirmationCode: string, done: AuthCallback) {
  const result = db
    .query("SELECT * FROM users WHERE confirmationCode = ?")
    .get(confirmationCode)

  const user = result as UserWithConfirmation | undefined

  if (!user) {
    done(new Error("Invalid confirmation code"))
    return
  }

  try {
    db.query("UPDATE users SET confirmationCode = NULL WHERE confirmationCode = ?")
      .run(confirmationCode)

    // Remove confirmationCode from user object
    const updatedUser: User = { ...user }
    delete (updatedUser as UserWithConfirmation).confirmationCode

    done(null, updatedUser)
  } catch (updateError) {
    done(new Error(`Following error occurred while updating user: ${updateError}`))
  }
}

export function login(db: Database, username: string, loginPassword: string, done: AuthCallback) {
  getUserByUsername(db, username, (error, user) => {
    if (error) {
      if (process.env.NODE_ENV !== 'test' && !process.env.BUN_TEST) {
        console.error("Error occured during lookup of user.")
      }
      done(error)
    } else if (!user) {
      if (process.env.NODE_ENV !== 'test' && !process.env.BUN_TEST) {
        console.info("User to login does not exist.")
      }
      done(new Error("User does not exist!"))
    } else if ((user as UserWithConfirmation).confirmationCode) {
      done(new Error("Email-address must first be verified!"))
    } else {
      bcrypt.compare(loginPassword, user.password || '', (compareError, result) => {
        if (compareError) {
          throw compareError
        }

        if (result) {
          done(null, user)
        } else {
          done(new Error("Wrong password or username!"))
        }
      })
    }
  })
}

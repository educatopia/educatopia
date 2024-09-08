import crypto from "node:crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import pug from "pug"
import { stripIndent } from "common-tags"
import type { Database } from "bun:sqlite"
import sendgrid from "@sendgrid/mail"

const mailUsername = process.env.MAIL_USERNAME

function randomBase62String(length: number) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace("+", "")
    .replace("/", "")
    .slice(0, length)
}

function sendMail(
  userData: {
    username: string
    email: string
    confirmationCode: string
  },
  request: Request,
  done: (error: Error, response?: unknown) => void,
) {
  const isProduction = request.app.get("env") !== "development"
  const mail = {
    from: "no-reply@educatopia.org",
    fromname: "Educatopia",
    to: userData.email,
    toname: userData.username,
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

  function mailCallback(error, response) {
    if (error || !response) {
      console.error(error)
      done(error)
      return
    }

    if (isProduction) {
      console.info("Message sent: %s", response.messageId)
    } else {
      console.info(JSON.parse(response.message))
    }

    done(null, response)
  }

  if (isProduction) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
    sendgrid.send(mail, mailCallback)
  } else {
    nodemailer
      .createTransport({
        jsonTransport: true,
      })
      .sendMail(mail, mailCallback)
  }
}

export function getUserByUsername(
  db: Database,
  username: string,
  done: (error: Error | null, user?: unknown) => void,
) {
  done(
    null,
    db
      .query("SELECT * FROM users WHERE username == :username")
      .get({ username }),
  )
}

export function signup(
  db: Database,
  request: Request,
  done: (error: Error, response?: unknown) => void,
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
  const userData = {
    username: request.body.username,
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

      userCollection.insert(userData, { safe: true }, (insertError) => {
        if (insertError) {
          done(new Error("User could not be inserted."))
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
  })
}

export function confirm(confirmationCode, done) {
  getUserByUsername(
    db,
    { confirmationCode: confirmationCode },
    (error, user) => {
      if (error || !user) {
        done(error)
        return
      }

      delete user.confirmationCode

      userCollection.update(
        { _id: user._id },
        user,
        { safe: true },
        (updateError, result) => {
          if (updateError || result === 0) {
            done(
              new Error(
                `Following error occurred
								while updating user ${mailUsername}: ${updateError}`,
              ),
            )
          } else {
            done(null, user)
          }
        },
      )
    },
  )
}

export function login(username, loginPassword, done) {
  getUserByUsername(db, { username: username }, (error, user) => {
    if (error) {
      console.error("Error occured during lookup of user.")
      done(error)
    } else if (!user) {
      console.info("User to login does not exist.")
      done({ message: "User does not exist!" })
    } else if (user.confirmationCode) {
      done({ message: "Email-address must first be verified!" })
    } else {
      bcrypt.compare(loginPassword, user.password, (compareError, result) => {
        if (compareError) {
          throw new Error(compareError)
        }

        if (result) {
          done(null, user)
        } else {
          done({ message: "Wrong password or username!" })
        }
      })
    }
  })
}

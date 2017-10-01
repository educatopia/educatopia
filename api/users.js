const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jade = require('jade')

const mailUsername = process.env.MAIL_USERNAME
const password = process.env.MAIL_PASSWORD
const sendgrid = require('sendgrid')(mailUsername, password)

const exportObject = {}
let userCollection


function randomBase62String (length) {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace('+', '')
    .replace('/', '')
    .slice(0, length)
}


function sendMail (userData, app, done) {
  const mail = {
    from: 'no-reply@educatopia.org',
    fromname: 'Educatopia',
    to: userData.email,
    toname: userData.mailUsername,
    subject: 'Verify your email-address for Educatopia',
    html: jade.renderFile(
      'views/mails/signup.jade',
      {
        userData: userData,
        settings: app.settings,
      }
    ),
  }
  const mailCallback = function (error, response) {
    if (error || !response) {
      console.error(error)

      done(error)
    }
    else {
      done(null, response)
    }
  }

  if (app.get('env') === 'production') {
    sendgrid.send(mail, mailCallback)
  }
  else {
    mail.transporter = nodemailer.createTransport()
    mail.transporter.sendMail(mail, mailCallback)
  }
}


exportObject.getByUsername = function (username, done) {
  userCollection.findOne(
    {username: username},
    (error, user) => {

      if (error) {
        done('User could not be found.')
      }
      else {
        done(null, user)
      }
    }
  )
}


exportObject.signup = function (request, done) {
  const now = new Date()
  const blackList = [
    'about',
    'api',
    'confirm',
    'exercise',
    'exercises',
    'help',
    'imprint',
    'login',
    'logout',
    'request',
    'settings',
    'signup',
    'team',
    'user',
    'users',
  ]
  const userData = {
    username: request.body.username,
    email: request.body.email,
    confirmationCode: randomBase62String(33),
    createdAt: now,
    updatedAt: now,
  }

  if (blackList.indexOf(userData.username) !== -1) {
    done(null, {message: 'This username is not allowed.'})
    return
  }

  bcrypt.hash(request.body.password, 16, (error, hash) => {
    if (error) {
      throw new Error(error)
    }

    userData.password = hash

    userCollection.findOne(
      {
        $or: [
          {email: userData.email},
          {username: userData.username},
        ],
      },
      (findError, user) => {
        if (findError) {
          done('User could not be found.')
        }
        else if (user) {
          if (user.email === userData.email) {
            done(null, {
              httpCode: 422,
              message: 'Email-address is already taken',
            })
          }
          else {
            done(null, {
              httpCode: 422,
              message: 'Username is already taken',
            })
          }
        }
        else {
          userCollection.insert(
            userData,
            {safe: true},
            (insertError) => {
              if (insertError) {
                done('User could not be inserted.')
              }
              else {
                sendMail(
                  userData,
                  request.app,
                  (sendError) => {
                    if (sendError) {

                      console.error(error)

                      done(error, {
                        message: 'Mail could ' +
                                 'not be sent',
                      })
                    }
                    else {
                      done(null, {
                        message: 'New user ' +
                                 'was created ' +
                                 'and mail was sent',
                      })
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  })
}


exportObject.confirm = function (confirmationCode, done) {
  userCollection.findOne(
    {confirmationCode: confirmationCode},
    (error, user) => {
      if (error || !user) {
        done('User for confirmation could not be found.')
      }
      else {
        delete user.confirmationCode

        userCollection.update(
          {_id: user._id},
          user,
          {safe: true},
          (updateError, result) => {
            if (updateError || result === 0) {
              done(
                'Following error occurred ' +
                'while updating user ' +
                mailUsername + ': ' + updateError
              )
            }
            else {
              done(null, user)
            }
          }
        )
      }
    }
  )
}


exportObject.login = function (username, loginPassword, done) {
  userCollection.findOne(
    {username: username},
    (error, user) => {
      if (error) {
        console.error('Error occured during lookup of user.')
        done(error)
      }
      else if (!user) {
        console.info('User to login does not exist.')
        done({message: 'User does not exist!'})
      }
      else if (user.confirmationCode) {
        done({message: 'Email-address must first be verified!'})
      }
      else {
        bcrypt.compare(
          loginPassword,
          user.password,
          (compareError, result) => {
            if (compareError) {
              throw new Error(compareError)
            }

            if (result) {
              done(null, user)
            }
            else {
              done({message: 'Wrong password or username!'})
            }
          }
        )
      }
    }
  )
}


module.exports = function (config) {

  userCollection = config.database.collection('users')

  return exportObject
}

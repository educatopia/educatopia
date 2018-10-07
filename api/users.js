const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jade = require('jade')

const mailUsername = process.env.MAIL_USERNAME
const sendgrid = require('@sendgrid/mail')

const gravatar = require('gravatar')

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
    toname: userData.username,
    subject: 'Verify your email-address for Educatopia',
    html: jade.renderFile(
      'views/mails/signup.jade',
      {
        userData: userData,
        settings: app.settings,
      }
    ),
  }

  function mailCallback (error, response) {
    if (error || !response) {
      console.error(error)
      done(error)
      return
    }

    console.info('Message sent: %s', response.messageId)
    done(null, response)
  }

  if (app.get('env') === 'production') {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
    sendgrid.send(mail, mailCallback)
  }
  else {
    nodemailer
      .createTransport()
      .sendMail(mail, mailCallback)
  }
}


exportObject.getByUsername = function (username, done) {
  userCollection.findOne(
    {username: username},
    (error, user) => {
      if (error) {
        done(new Error('User could not be found.'))
      }
      else {
        if (user && user.email) {
          user.gravatar = gravatar.url(user.email, { size: 210 })
        }
        else {
          user.gravatar = '/img/placeholderProfilePicture.png'
        }

        done(null, user)
      }
    }
  )
}


exportObject.signup = (request, done) => {
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

  if (!userData.username) {
    done(new Error('Username must be specified'))
    return
  }

  if (blackList.includes(userData.username)) {
    done(new Error('This username is not allowed.'))
    return
  }

  if (!userData.email) {
    done(new Error('Email address must be specified'))
    return
  }

  bcrypt.hash(request.body.password, 16, (error, hash) => {
    if (error) done(error)

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
          done(new Error('User could not be found.'))
          return
        }

        if (user) {
          if (user.email === userData.email) {
            done(new Error('Email-address is already taken'))
          }
          else {
            done(new Error('Username is already taken'))
          }
          return
        }

        userCollection.insert(
          userData,
          {safe: true},
          (insertError) => {
            if (insertError) {
              done(new Error('User could not be inserted.'))
              return
            }

            sendMail(
              userData,
              request.app,
              (sendError) => {
                if (sendError) {
                  console.error(error)
                  done(new Error('Mail could not be sent'))
                  return
                }
                done(null, 'New user was created and mail was sent')
              }
            )
          }
        )
      }
    )
  })
}


exportObject.confirm = (confirmationCode, done) => {
  userCollection.findOne(
    {confirmationCode: confirmationCode},
    (error, user) => {
      if (error || !user) {
        done(error)
        return
      }

      delete user.confirmationCode

      userCollection.update(
        {_id: user._id},
        user,
        {safe: true},
        (updateError, result) => {
          if (updateError || result === 0) {
            done(new Error(
              'Following error occurred ' +
              'while updating user ' +
              mailUsername + ': ' + updateError
            ))
          }
          else {
            done(null, user)
          }
        }
      )
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


module.exports = config => {
  userCollection = config.database.collection('users')
  return exportObject
}

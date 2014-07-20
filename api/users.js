var crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    jade = require('jade'),

    username = process.env.MAIL_USERNAME,
    password = process.env.MAIL_PASSWORD,
    sendgrid = require('sendgrid')(username, password),

    exportObject = {},
    userCollection


function randomBase62String (length) {

	return crypto
		.randomBytes(length)
		.toString('base64')
		.replace('+', '')
		.replace('/', '')
		.slice(0, length)
}

function sendMail (userData, environment, callback) {

	var mail = {
		    from: "no-reply@educatopia.org",
		    fromname: "Educatopia",
		    to: userData.email,
		    toname: userData.username,
		    subject: "Verify your email-address for Educatopia",
		    html: jade.renderFile(
			    'views/mails/signup.jade',
			    {
				    'userData': userData
			    }
		    )
	    },
	    mailCallback = function (error, response) {

		    if (error || !response) {

			    console.error(error)

			    callback(error)
		    }

		    else
			    callback(null, response)
	    }


	if (environment === 'production')
		sendgrid.send(mail, mailCallback)

	else {
		mail.transport = nodemailer.createTransport("sendmail")
		nodemailer.sendMail(mail, mailCallback)
	}

}


exportObject.getByUsername = function (username, callback) {

	userCollection.findOne(
		{username: username},
		function (error, user) {

			if (error)
				callback('User could not be found.')
			else
				callback(null, user)
		}
	)
}

exportObject.signup = function (request, callback) {

	var now = new Date(),
	    blackList = [
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
		    'users'
	    ],
	    userData = {
		    username: request.body.username,
		    email: request.body.email,
		    confirmationCode: randomBase62String(33),
		    createdAt: now,
		    updatedAt: now
	    }

	if (blackList.indexOf(userData.username) != -1) {
		callback(null, {message: 'This username is not allowed.'})
		return
	}

	bcrypt.hash(request.body.password, 16, function (error, hash) {

		if (error)
			throw new Error(error)

		userData.password = hash

		userCollection.findOne(
			{ $or: [
				{email: userData.email},
				{username: userData.username}
			]},
			function (error, user) {

				if (error)
					callback('User could not be found.')

				else if (user) {

					if (user.email === userData.email)
						callback(null, {
							httpCode: 422,
							message: 'Email-address is already taken'
						})

					else
						callback(null, {
							httpCode: 422,
							message: 'Username is already taken'
						})
				}
				else {
					userCollection.insert(
						userData,
						{safe: true},
						function (error) {

							if (error)
								callback('User could not be inserted.')

							else
								sendMail(
									userData,
									request.app.get('env'),
									function (error, message) {

										if (error) {

											console.error(error)

											callback(error, {
												message: 'Mail could not be sent'
											})
										}

										else
											callback(null, {
												message: 'New user was created and mail was sent'
											})
									}
								)
						}
					)
				}
			}
		)
	})
}

exportObject.confirm = function (confirmationCode, callback) {

	userCollection.findOne(
		{'confirmationCode': confirmationCode},
		function (error, user) {

			if (error || !user)
				callback('User for confirmation could not be found.')

			else {

				delete user.confirmationCode

				userCollection.update(
					{'_id': user._id},
					user,
					{safe: true},
					function (error, result) {

						if (error || result === 0)
							callback('Following error occurred while updating user ' +
							         username + ': ' + error)

						else
							callback(null, user)
					}
				)
			}
		}
	)
}

exportObject.login = function (username, password, callback) {

	userCollection.findOne(
		{username: username},
		function (error, user) {

			if (error) {
				console.error('Error occured during lookup of user.')
				callback(error)
			}
			else if (!user) {
				console.log('User to login does not exist.')
				callback({message: 'User does not exist!'})
			}
			else if (user.confirmationCode)
				callback({message: 'Email-address must first be verified!'})

			else
				bcrypt.compare(password, user.password, function (error, result) {

					if (error)
						throw new Error(error)

					if (result)
						callback(null, user)

					else
						callback({message: 'Wrong password or username!'})
				})
		}
	)
}


module.exports = function (config) {

	userCollection = config.database.collection('users')

	return exportObject
}

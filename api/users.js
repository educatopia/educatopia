var email = require('./email-dispatcher'),
    crypto = require('crypto'),
    MongoDB = require('mongodb').Db,
    Server = require('mongodb').Server,
    moment = require('moment'),
    nodemailer = require('nodemailer'),
    jade = require('jade'),

    dbPort = 27017,
    dbHost = 'localhost',
    dbName = 'educatopiadev',
    db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1}),
    userCollection


function randomBase64String (length) {
	return crypto
		.randomBytes(Math.ceil(length * 0.75))
		.toString('base64')
		.slice(0, length)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}

function autoLogin (user, pass, callback) {
	userCollection.findOne({user: user}, function (e, o) {
		if (o) {
			o.pass == pass ? callback(o) : callback(null)
		}
		else {
			callback(null)
		}
	})
}

function manualLogin (user, pass, callback) {
	userCollection.findOne({user: user}, function (e, o) {
		if (o == null) {
			callback('user-not-found')
		}
		else {
			validatePassword(pass, o.pass, function (err, res) {
				if (res) {
					callback(null, o)
				}
				else {
					callback('invalid-password')
				}
			})
		}
	})
}

function updateAccount (newData, callback) {
	userCollection.findOne({user: newData.user}, function (e, o) {
		o.name = newData.name
		o.email = newData.email
		o.country = newData.country

		if (newData.pass == '') {
			userCollection.save(o, {safe: true}, function (err) {
				if (err) callback(err)
				else callback(null, o)
			})
		}
		else {
			saltAndHash(newData.pass, function (hash) {
				o.pass = hash
				userCollection.save(o, {safe: true}, function (err) {
					if (err) callback(err)
					else callback(null, o)
				})
			})
		}
	})
}

function updatePassword (email, newPass, callback) {
	userCollection.findOne({email: email}, function (e, o) {
		if (e) {
			callback(e, null)
		}
		else {
			saltAndHash(newPass, function (hash) {
				o.pass = hash
				userCollection.save(o, {safe: true}, callback)
			})
		}
	})
}

function deleteAccount (id, callback) {
	userCollection.remove({_id: getObjectId(id)}, callback)
}

function getAccountByEmail (email, callback) {
	userCollection.findOne({email: email}, function (e, o) {
		callback(o)
	})
}

function validateResetLink (email, passHash, callback) {
	userCollection.find({ $and: [
		{email: email, pass: passHash}
	] }, function (e, o) {
		callback(o ? 'ok' : null)
	})
}

function getAllRecords (callback) {
	userCollection.find().toArray(
		function (e, res) {
			if (e) callback(e)
			else callback(null, res)
		})
}

function delAllRecords (callback) {
	// reset userCollection collection for testing
	userCollection.remove({}, callback)
}

function isAuthorized (req, res) {

	if (!req.cookie)
		return false

	else
		AM.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
			if (o != null) {
				req.session.user = o
				return true
			}
			else {
				return false
			}
		})
}

function generateSalt () {
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'
	var salt = ''

	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length)
		salt += set[p]
	}

	return salt
}

function md5 (str) {
	return crypto.createHash('md5').update(str).digest('hex')
}

function saltAndHash (pass, callback) {
	var salt = generateSalt()
	callback(salt + md5(pass + salt))
}

function validatePassword (plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10)
	var validHash = salt + md5(plainPass + salt)
	callback(null, hashedPass === validHash)
}

function getObjectId (id) {
	return userCollection.db.bson_serializer.ObjectID.createFromHexString(id)
}

function findById (id, callback) {
	userCollection.findOne({_id: getObjectId(id)},
		function (e, res) {
			if (e) callback(e)
			else callback(null, res)
		})
}

function findByMultipleFields (a, callback) {
	// this takes an array of name/val pairs to search against {fieldName : 'value'}
	userCollection.find({ $or: a }).toArray(
		function (e, results) {
			if (e) callback(e)
			else callback(null, results)
		})
}

function sendMail (userData) {

	var sendmailTransport = nodemailer.createTransport("sendmail")

	nodemailer.sendMail(
		{
			transport: sendmailTransport,
			from: "Educatopia <no-reply@educatopia.org>",
			to: userData.email,
			subject: "Verify your email-address for Educatopia",
			html: jade.renderFile(
				'views/mails/signup.jade',
				{
					'userData': userData
				}
			)
		},
		function (error, response) {

			if (error)
				throw error

			else
				console.log("Message sent: " + response)
		}
	)
}


exports.getByUsername = function (username, callback) {

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

exports.signup = function (request, callback) {

	var now = new Date(),
	    blackList = [
		    'about',
		    'api',
		    'confirm',
		    'exercises',
		    'login',
		    'request',
		    'settings',
		    'signup',
		    'team',
		    'help'
	    ],
	    userData = {
		    username: request.body.username,
		    email: request.body.email,
		    password: request.body.password,
		    confirmationCode: randomBase64String(33),
		    createdAt: now,
		    updatedAt: now
	    }


	if (blackList.indexOf(userData.username) != -1) {
		callback(null, {message: 'This username is not allowed.'})
		return
	}

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
					callback(null, {httpCode: 422, message: 'Email-address is already taken'})
				else
					callback(null, {httpCode: 422, message: 'Username is already taken'})
			}
			else {

				userCollection.insert(userData, {safe: true}, function (error) {

					if (error)
						callback('User could not be inserted.')

					sendMail(userData)

					callback(null, {
						message: 'New user was created and mail was sent'
					})
				})
			}
		}
	)
}

exports.confirm = function (confirmationCode, callback) {

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

exports.login = function (username, passwordHash, callback) {

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
			else if (user.confirmationCode) {
				callback({message: 'Email-address must first be verified!'})
			}
			else if (passwordHash && passwordHash === user.password){
				callback(null, user)
			}
			else
				callback({message: 'Wrong password or wrong username!'})
		}
	)
}



db.open(function (error) {

	if (error)
		throw error

	console.log('User-management module connected to database "' + dbName + '"')
})

userCollection = db.collection('users')

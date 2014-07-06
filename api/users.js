// More or less taken functionality from here braitsch' node-login:
// https://github.com/braitsch/node-login/blob/master/app/server/modules/account-manager.js

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
    db,
    userCollection


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


// Used Methods

function sendMail (userData) {

	var smtpTransport,
	    mailOptions,
	    pickupTransport,
	    sendmailTransport

	/*
	 smtpTransport = nodemailer.createTransport(
	 "SMTP",
	 {
	 service: "Gmail",
	 auth: {
	 user: "adrian.sieber1",
	 pass: "adwolesi@internetadress.org"
	 }
	 }
	 )

	 pickupTransport = nodemailer.createTransport("PICKUP", {
	 directory: "/Users/adrian/Sites/educatopia/educatopia/mails"
	 })
	 */


	sendmailTransport = nodemailer.createTransport("sendmail")

	nodemailer.sendMail(
		{
			transport: sendmailTransport,
			from: "Educatopia <no-reply@educatopia.org>",
			to: userData.email,
			subject: "Verify your email-address for Educatopia",
			html: jade.renderFile('views/mails/signup.jade', userData)
		},
		function (error, response) {

			if (error)
				throw error

			else
				console.log("Message sent: " + response.message)

			// if you don't want to use this transport object anymore, uncomment following line
			//smtpTransport.close(); // shut down the connection pool, no more messages
		}
	)
}


db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1})

db.open(function (error) {

	if (error)
		throw error

	console.log('User-management module connected to database "' + dbName + '"')
})

userCollection = db.collection('users')


exports.signup = function (request, callback) {

	// TODO: Refactoring

	var userData

	//if (isAuthorized(req, res))
	//	return

	userData = {
		username: request.body.username,
		email: request.body.email,
		password: request.body.password
	}

	userCollection.findOne({email: userData.email}, function (error, user) {

		if (error)
			callback('User could not be found.')

		if (user)
			callback(null, {httpCode: 422, message: 'Email-address is already taken'})

		else {

			userData.staged = true

			userCollection.insert(userData, {safe: true}, function (error) {

				if (error)
					callback('User could not be inserted.')

				sendMail(userData)

				callback(null, {
					message: 'New user was created and mail was sent'
				})
			})
		}
	})
}

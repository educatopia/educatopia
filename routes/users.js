var usersApi = require('../api/users'),
    users = {}


users.confirm = function (req, res) {

	usersApi.confirm(req.params.confirmationCode, function (error, user) {

		if (error)
			throw new Error(error)

		res.redirect('/' + user.username)
	})
}

users.profile = function (req, res) {

	usersApi.getByUsername(req.params.username, function (error, user) {

		if (error)
			throw new Error(error)

		res.render('users/profile', {
			page: 'profile',
			user: user
		})
	})
}


module.exports = users

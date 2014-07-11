var usersApi = require('../api/users'),
    users = {}


users.confirm = function (request, res) {

	usersApi.confirm(
		request.params.confirmationCode,
		function (error, user) {

			if (error)
				throw new Error(error)

			res.redirect('/' + user.username)
		}
	)
}

users.profile = function (request, res) {

	usersApi.getByUsername(
		request.params.username,
		function (error, user) {

			if (error)
				throw new Error(error)

			res.render('users/profile', {
				page: 'profile',
				user: user
			})
		}
	)
}


module.exports = users

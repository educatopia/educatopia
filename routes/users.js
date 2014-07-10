var usersApi = require('../api/users'),
    users = {}


users.confirm = function (req, res) {

	usersApi.confirm(req.params.confirmationCode, function (error, user) {

		if (error)
			throw new Error(error)

		res.redirect('/users/' + user.username)
	})
}


module.exports = users

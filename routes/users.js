var usersApi = require('../api/users'),
    exercisesApi = require('../api/exercises'),
    users = {}


users.confirm = function (request, response, next) {

	usersApi.confirm(
		request.params.confirmationCode,
		function (error, user) {

			if (error)
				console.error(error)

			if (user)
				response.redirect('/' + user.username)
			else
				next()
		}
	)
}

users.profile = function (request, response, next) {

	usersApi.getByUsername(
		request.params.username,
		function (error, user) {

			if (error)
				console.error(error)

			if (user)
				exercisesApi.getByUser(
					request.params.username,
					function (error, exercises) {

						if (error)
							console.error(error)

						response.render('users/profile', {
							page: 'profile',
							user: user,
							exercises: exercises
						})
					}
				)
			else
				next()
		}
	)
}


module.exports = users

var usersApi = require('../api/users'),
    exercisesApi = require('../api/exercises'),
    users = {}


users.confirm = function (request, response, next) {

	console.log(request, response, next)

	usersApi.confirm(
		request.params.confirmationCode,
		function (error, user) {

			console.log(error,user)

			if (error)
				console.error(error)

			else if (user)
				response.render('login', {
					page: 'login',
					message: 'You are email-address has been confirmed. ' +
					         'You can log in now!'
				})

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

			else if (user)
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

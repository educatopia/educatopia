var users = require('../api/users')

module.exports = function (request, response) {

	if (request.method === 'POST' && request.session.user)

		users.signup(request, function (error, data) {

			if (error)
				throw new Error(error)

			response.render('signup', {
				page: 'signup',
				data: data
			})
		})

	else {

		if (request.session.user) {
			delete response.locals.session
			request.session.destroy()
		}

		response.render('signup', {
			page: 'signup'
		})
	}
}

var usersApi

function signup (request, response) {

	if (request.session.user) {
		delete response.locals.session
		request.session.destroy()
	}

	if (request.method === 'POST')
		usersApi.signup(
			request,
			function (error, data) {

				if (error)
					console.error(error)

				else
					response.render('signup', {
						page: 'signup',
						data: data
					})
			}
		)

	else
		response.render('signup', {
			page: 'signup'
		})
}

module.exports = function (config) {

	usersApi = require('../api/users')(config)

	return signup
}

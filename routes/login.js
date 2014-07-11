var usersApi = require('../api/users')

module.exports = function (request, response) {

	console.log('asdf')

	if (request.method === 'POST')
		usersApi.login(
			request.body.username,
			request.body.password,
			function (error, user) {

				if (error || !user){
					console.error('Following error occurred during login: '
						+ error.message)

					response.render('login', {
						page: 'login',
						error: error
					})
				}
				else {
					request.session.user = user
					response.redirect('/' + user.username)
				}
			}
		)

	else {
		console.log('test')

		response.render('login', {
			page: 'login'
		})
	}
}

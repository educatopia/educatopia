var users = require('../api/users')

module.exports = function (request, response) {

	users.signup(request, function(error, data){

		if (error)
			throw new Error(error)

		response.render('signup', {
			page: 'signup',
			data: data
		})
	})

	response.render('signup', {
		page: 'signup'
	})
}

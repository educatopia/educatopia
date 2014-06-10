var accounting = require('../api/accounting')

module.exports = function (request, response) {

	//accounting.signup(request, response)

	response.render('signup', {
		page: 'signup'
	})
}

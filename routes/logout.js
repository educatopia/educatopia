'use strict'

module.exports = function (request, response) {

	request.session.destroy()
	response.redirect('/')
}

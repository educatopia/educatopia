module.exports = function (request, response) {

	response.render('index', {
		page: 'home',
		session: request.session
	})
}

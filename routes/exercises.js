var exercises = require('../api/exercises')

module.exports = function (req, res) {

	exercises.getAll(function(exercises){

		res.render('exercises', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

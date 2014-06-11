var exercisesApi = require('../api/exercises')

module.exports.all = function (req, res) {

	exercisesApi.getAll(function(exercises){

		res.render('exercises', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

module.exports.one = function (req, res) {

	exercisesApi.getById(req.params.id, function(exercise){

		res.render('exercise', {
			page: 'exercise',
			exercise: exercise
		})
	})
}

var exercisesApi = require('../api/exercises'),
    exercises = {}

exercises.all = function (req, res) {

	exercisesApi.getAll(function (exercises) {

		res.render('exercises', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

exercises.one = function (req, res) {

	exercisesApi.getById(req.params.id, function (exercise) {

		res.render('exerciseView', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}

exercises.edit = function (req, res) {

	exercisesApi.getById(req.params.id, function (exercise) {

		res.render('exerciseEdit', {
			page: 'exerciseEdit',
			exercise: exercise
		})
	})
}

exercises.history = function (req, res) {

	exercisesApi.getHistoryById(req.params.id, function (history) {

		res.render('exerciseHistory', {
			page: 'exerciseHistory',
			history: history,
			exercise: {
				id: req.params.id
			}
		})
	})
}


module.exports = exercises

var exercisesApi = require('../api/exercises'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),

    exercises = {},

    schemaPath = path.resolve(__dirname, '../public/shared/exerciseSchema.yaml'),
    schema = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8')),

    fieldsetsPath = path.resolve(__dirname, '../public/shared/exerciseFieldsets.yaml'),
    fieldsets = yaml.safeLoad(fs.readFileSync(fieldsetsPath, 'utf8'))


function arrayify (object, schema) {

	var key

	for (key in schema) {
		if (schema.hasOwnProperty(key)) {

			if (schema[key].type === 'list' && schema[key].subtype === 'text') {

				object[key] = object[key].split(/\s*,\s*/)
			}
		}
	}

	return object
}


exercises.all = function (req, res) {

	exercisesApi.getAll(function (error, exercises) {

		if(error)
			throw new Error(error)

		res.render('exercises', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

exercises.one = function (req, res) {

	exercisesApi.getRenderedById(req.params.id, function (error, exercise) {

		if(error)
			throw new Error(error)

		res.render('exerciseView', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}

exercises.edit = function (req, res) {

	var key,
	    renderObject = {
		    page: 'exerciseEdit',
		    schema: schema,
		    fieldsets: fieldsets
	    }


	if (req.method === 'POST') {

		// Add one more field for in query specified form-list
		for (key in req.query)
			if (req.query.hasOwnProperty(key)) {

				req.body[key] = req.body[key] || []

				req.body[key].push("")
			}

		renderObject.exercise = arrayify(req.body, schema)

		res.render('exerciseEdit', renderObject)
	}
	else
		exercisesApi.getById(req.params.id, function (error, exercise) {

			if(error)
				throw new Error(error)

			renderObject.exercise = exercise

			res.render('exerciseEdit', renderObject)
		})
}

exercises.history = function (req, res) {

	exercisesApi.getHistoryById(req.params.id, function (error, history) {

		if(error)
			throw new Error(error)

		res.render('exerciseHistory', {
			page: 'exerciseHistory',
			history: history,
			exercise: {
				id: req.params.id
			}
		})
	})
}

exercises.update = function (req, res) {

	exercisesApi.update(arrayify(req.body, schema), function (error, exercise) {

		if(error)
			throw new Error(error)

		res.render('exerciseView', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}


module.exports = exercises

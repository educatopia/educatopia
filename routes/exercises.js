var exercisesApi = require('../api/exercises'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),

    exercises = {},

    schemaPath = path.resolve(__dirname, '../public/shared/exerciseSchema.yaml'),
    schema = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8')),

    fieldsetsPath = path.resolve(__dirname, '../public/shared/exerciseFieldsets.yaml'),
    fieldsets = yaml.safeLoad(fs.readFileSync(fieldsetsPath, 'utf8'))


function stringsToArrays (object) {

	var key

	for (key in schema)
		if (schema.hasOwnProperty(key))
			if (schema[key].type === 'list' && schema[key].subtype === 'text')
				object[key] = object[key].split(/\s*,\s*/)

	return object
}

function stringToDate (object){

	var key

	for (key in schema)
		if (schema.hasOwnProperty(key))
			if (schema[key].type === 'date')
				object[key] = new Date(object[key])

	return object
}

function addFields (req) {
	for (key in req.query)
		if (req.query.hasOwnProperty(key)) {
			req.body[key] = req.body[key] || []
			req.body[key].push("")
		}
}


exercises.one = function (req, res) {

	exercisesApi.getByIdRendered(req.params.id, function (error, exercise) {

		if (error)
			throw new Error(error)

		res.render('exercises/view', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}

exercises.create = function (req, res) {

	var renderObject

	if (res.locals.authenticated) {

		renderObject = {
			page: 'exerciseCreate',
			schema: schema,
			fieldsets: fieldsets
		}


		if (req.method === 'POST') {

			addFields(req)

			renderObject.exercise = stringsToArrays(req.body)

			res.render('exercises/create', renderObject)
		}
		else {
			renderObject.exercise = {}

			res.render('exercises/create', renderObject)
		}
	}
	else {
		res.redirect('/')
	}
}


exercises.submit = function (req, res) {

	exercisesApi.add(req.body, function (error, exercise) {

		if (error)
			throw new Error(error)

		res.redirect('/exercises/' + exercise['_id'])

		/*res.render('exercises/view', {
		 page: 'exerciseView',
		 exercise: exercise
		 })*/
	})
}

exercises.all = function (req, res) {

	exercisesApi.getAll(function (error, exercises) {

		if (error)
			throw new Error(error)

		res.render('exercises/all', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

exercises.edit = function (req, res) {

	var renderObject = {
		page: 'exerciseEdit',
		schema: schema,
		fieldsets: fieldsets
	}


	if (req.method === 'POST') {

		addFields(req)

		renderObject.exercise = stringsToArrays(req.body)

		res.render('exercises/edit', renderObject)
	}
	else
		exercisesApi.getById(req.params.id, function (error, exercise) {

			if (error)
				throw new Error(error)

			renderObject.exercise = exercise

			res.render('exercises/edit', renderObject)
		})

}

exercises.history = function (req, res) {

	exercisesApi.getHistoryById(req.params.id, function (error, history) {

		if (error)
			throw new Error(error)

		res.render('exercises/history', {
			page: 'exerciseHistory',
			history: history,
			exercise: {
				id: req.params.id
			}
		})
	})
}

exercises.update = function (req, res) {

	var updatedExercise = stringToDate(stringsToArrays(req.body, schema))

	exercisesApi.update(
		updatedExercise,
		function (error, exercise) {

			if (error)
				throw new Error(error)

			res.render('exercises/view', {
				page: 'exerciseView',
				exercise: exercise
			})
		}
	)
}


module.exports = exercises

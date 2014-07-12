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

function stringToDate (object) {

	var key

	for (key in schema)
		if (schema.hasOwnProperty(key))
			if (schema[key].type === 'date')
				object[key] = new Date(object[key])

	return object
}

function addFields (request) {
	for (key in request.query)
		if (request.query.hasOwnProperty(key)) {
			request.body[key] = request.body[key] || []
			request.body[key].push("")
		}
}


exercises.one = function (request, response, next) {

	exercisesApi.getByIdRendered(
		request.params.id,
		function (error, exercise) {

			if (error)
				console.log(error)

			if (exercise)
				response.render('exercises/view', {
					page: 'exerciseView',
					exercise: exercise
				})
			else
				next()
		}
	)
}

exercises.create = function (request, response) {

	var renderObject = {
		page: 'exerciseCreate',
		schema: schema,
		fieldsets: fieldsets
	}


	if (request.method === 'POST' && response.session.user) {

		addFields(requestuest)

		renderObject.exercise = stringsToArrays(request.body)

		response.render('exercises/create', renderObject)
	}
	else {
		renderObject.exercise = {}
		delete renderObject.fieldsets[2]

		response.render('exercises/create', renderObject)
	}
}


exercises.submit = function (request, response) {

	if (request.session.user) {
		exercisesApi.add(request.body, function (error, exercise) {

			if (error)
				throw new Error(error)

			response.redirect('/exercises/' + exercise['_id'])
		})
	}
	else
		response.redirect('/exercises/' + exercise['_id'])
}

exercises.all = function (request, response) {

	exercisesApi.getAll(function (error, exercises) {

		if (error)
			throw new Error(error)

		response.render('exercises/all', {
			page: 'exercises',
			exercises: exercises
		})
	})
}

exercises.edit = function (request, response, next) {

	var renderObject = {
		page: 'exerciseEdit',
		schema: schema,
		fieldsets: fieldsets
	}

	if (request.method === 'POST' && request.session.user) {

		addFields(request)

		renderObject.exercise = stringsToArrays(request.body)

		response.render('exercises/edit', renderObject)
	}
	else {
		exercisesApi.getById(
			request.params.id,
			function (error, exercise) {

				if (error)
					console.log(error)

				if (exercise) {
					renderObject.exercise = exercise
					response.render('exercises/edit', renderObject)
				}
				else
					next()
			}
		)
	}
}

exercises.history = function (request, response, next) {

	exercisesApi.getHistoryById(
		request.params.id,
		function (error, history) {

			if (error)
				console.log(error)

			if (history)
				response.render('exercises/history', {
					page: 'exerciseHistory',
					history: history,
					exercise: {
						id: request.params.id
					}
				})
			else
				next()
		}
	)
}

exercises.update = function (request, response) {

	var updatedExercise = stringToDate(stringsToArrays(request.body, schema))

	exercisesApi.update(
		updatedExercise,
		function (error, exercise) {

			if (error)
				throw new Error(error)

			response.render('exercises/view', {
				page: 'exerciseView',
				exercise: exercise
			})
		}
	)
}


module.exports = exercises

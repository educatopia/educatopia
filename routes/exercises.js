var exercisesApi = require('../api/exercises'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),

    exercises = {},

    schemaPath = path.resolve(__dirname, '../public/shared/exerciseSchema.yaml'),
    schema = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8')),

    fieldsetsPath = path.resolve(__dirname, '../public/shared/exerciseFieldsets.yaml'),
    fieldsets = yaml.safeLoad(fs.readFileSync(fieldsetsPath, 'utf8'))


function arrayify (object) {

	var key

	for (key in schema)
		if (schema.hasOwnProperty(key))
			if (schema[key].type === 'list' && schema[key].subtype === 'text')
				object[key] = object[key].split(/\s*,\s*/)

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

	exercisesApi.getRenderedById(req.params.id, function (error, exercise) {

		if (error)
			throw new Error(error)

		res.render('exercises/view', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}

exercises.create = function (req, res) {

	var renderObject = {
		page: 'exerciseCreate',
		schema: schema,
		fieldsets: fieldsets
	}


	if (req.method === 'POST') {

		addFields(req)

		renderObject.exercise = arrayify(req.body)

		res.render('exercises/create', renderObject)
	}
	else {
		renderObject.exercise = {}

		res.render('exercises/create', renderObject)
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

	var key,
	    renderObject = {
		    page: 'exerciseEdit',
		    schema: schema,
		    fieldsets: fieldsets
	    }


	if (req.method === 'POST') {

		addFields(req)

		renderObject.exercise = arrayify(req.body)

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

	exercisesApi.update(arrayify(req.body, schema), function (error, exercise) {

		if (error)
			throw new Error(error)

		res.render('exercises/view', {
			page: 'exerciseView',
			exercise: exercise
		})
	})
}


module.exports = exercises

var mongo = require('mongodb'),
    marked = require('marked'),
    clone = require('clone'),

    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    database = 'educatopiadev',
    db = new Db(database, new Server("127.0.0.1", 27017,
	    {auto_reconnect: true}), {w: 1}),
    exercisesCollection


function deleteEmptyFields (obj) {

	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			if (obj[key] === "" ||
			    obj[key] === 0 ||
			    obj[key] === null ||
			    obj[key].length === 0 ||
			    obj[key] === undefined) {

				delete obj[key]
			}
	}

	return obj
}

function exerciseToPrintFormat (exercise) {

	var temp = clone(exercise.current)

	temp.id = exercise._id
	temp.updatedAt = exercise.updatedAt

	temp.createdAt = exercise.history ?
	                 exercise.history[0].createdAt :
	                 exercise.current.createdAt

	temp.createdBy = exercise.history ?
	                 exercise.history[0].createdBy :
	                 exercise.current.createdBy

	return temp
}


exports.getById = function (id, callback) {

	try {
		id = BSON.ObjectID(id)
	}
	catch (error) {
		callback({message: 'Invalid Id'})
		return
	}


	exercisesCollection.findOne(
		{'_id': id},
		function (error, exercise) {

			if (error || !exercise)
				callback(error)

			else
				callback(null, exerciseToPrintFormat(exercise))
		}
	)
}

exports.getByIdRendered = function (id, callback) {

	try {
		id = BSON.ObjectID(id)
	}
	catch (error) {
		callback({message: 'Invalid Id'})
		return
	}

	exercisesCollection.findOne(
		{'_id': id},
		function (error, exercise) {

			if (error || !exercise)
				callback(error)

			else {

				// TODO: Distinguish between different exercise data formats
				if (exercise.history)
					exercise.current.createdBy = exercise.history[0].createdBy

				marked(exercise.current.task, function (error, content) {

					if (error)
						callback(error)

					else
						exercise.current.task = content
				})

				callback(null, exerciseToPrintFormat(exercise))
			}
		}
	)
}

exports.getHistoryById = function (id, callback) {

	try {
		id = BSON.ObjectID(id)
	}
	catch (error) {
		callback({message: 'Invalid Id'})
		return
	}

	exercisesCollection.findOne({'_id': id}, function (error, exercise) {

		if (error)
			callback(error)

		else {
			exercise.history = exercise.history || []

			callback(null, exercise.history.concat(exercise.current))
		}
	})
}

exports.getAll = function (callback) {

	function execArray (error, items) {

		if (error)
			callback(error)

		var tempArray = []

		items.forEach(function (item) {

			var temp = {},
			    key

			temp.id = item._id // TODO: Introduce extra url id
			temp.url = '/exercises/' + item._id

			for (key in item.current)
				if (item.current.hasOwnProperty(key))
					temp[key] = item.current[key]

			tempArray.push(temp)
		})

		callback(null, tempArray)
	}

	exercisesCollection
		.find()
		.sort({_id: 1})
		.toArray(execArray)
}

exports.getByUser = function (username, callback) {
	exercisesCollection
		.find({
			$or: [
				{$and: [
					{'current.createdBy': username},
					{'history': {$exists: false}}
				]},
				{'history.0.createdBy': username}
			]
		})
		.sort({_id: 1})
		.toArray(function (error, exercises) {

			if (error)
				callback(error)
			else
				callback(null, exercises)
		})
}

exports.add = function (exercise, user, callback) {

	var temp = {},
	    now = new Date()

	temp.updatedAt = now

	temp.current = deleteEmptyFields(exercise)
	temp.current.createdAt = now
	temp.current.createdBy = user.username

	exercisesCollection.insert(
		temp,
		{safe: true},
		function (error, result) {

			if (error)
				callback(error)

			else {
				console.log('Successfully added following exercise:')
				console.dir(result)

				callback(null, result[0])
			}
		}
	)
}

exports.update = function (exerciseFromForm, user, callback) {

	var temp = {},
	    now = new Date()

	temp['_id'] = new BSON.ObjectID(exerciseFromForm.id)

	temp.current = clone(deleteEmptyFields(exerciseFromForm))


	delete temp.current.id
	delete temp.current.updatedAt

	temp.current.createdAt = now
	temp.updatedAt = now

	temp.current.createdBy = user.username


	exercisesCollection.findOne({'_id': temp._id}, function (error, item) {

		if (error)
			callback('An error occurred while loading the exercise: ' + error)

		else {

			temp.history = item.history || []
			temp.history.push(item.current)

			exercisesCollection.update(
				{'_id': temp._id},
				temp,
				{safe: true},
				function (error, result) {

					if (error || result === 0)
						callback('An error occurred while updating the exercise: ' + error)

					else
						callback(null, exerciseToPrintFormat(temp))
				}
			)
		}
	})
}

exports.delete = function (id, callback) {

	console.log('Deleting exercise: ' + id)

	exercisesCollection.remove(
		{'_id': new BSON.ObjectID(id)},
		{safe: true},
		function (error, result) {
			if (error)
				callback(error)
			else {
				console.log('' + result + ' document(s) deleted')
				callback(req.body)
			}
		}
	)
}


db.open(function (error, database) {

	if (error)
		throw error

	console.log('Exercises module connected to database "' + database + '"')
})

exercisesCollection = db.collection('exercises')

var mongo = require('mongodb'),
    marked = require('marked'),
    clone = require('clone'),

    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    database = 'educatopiadev',
    db


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

function exerciseToPrintFormat (exercise){

	var temp = clone(exercise.current)

	temp.id = exercise._id
	temp.updatedAt = exercise.updatedAt

	temp.createdAt = exercise.history ?
	                 exercise.history[0].createdAt :
	                 exercise.current.createdAt

	return temp
}


exports.getById = function (id, callback) {

	id = new BSON.ObjectID(id)

	db.collection('exercises', function (error, collection) {

		if (error)
			callback(error)

		else {
			collection.findOne({'_id': id}, function (error, item) {

				if (error)
					callback(error)

				else {
					item.current.id = id
					item.current.updatedAt = item.updatedAt

					callback(null, item.current)
				}
			})
		}
	})
}

exports.getByIdRendered = function (id, callback) {

	id = new BSON.ObjectID(id)

	db.collection('exercises', function (error, collection) {

		if (error)
			callback(error)

		else {
			collection.findOne({'_id': id}, function (error, item) {

				if (error)
					callback(error)

				else {

					marked(item.current.task, function (error, content) {

						if (error)
							callback(error)

						else
							item.current.task = content
					})

					callback(null, exerciseToPrintFormat(item))
				}
			})
		}
	})
}

exports.getHistoryById = function (id, callback) {

	// TODO: Also include current revision of exercise

	id = new BSON.ObjectID(id)

	db.collection('exercises', function (error, collection) {

		if (error)
			callback(error)

		else {
			collection.findOne({'_id': id}, function (error, item) {

				if (error)
					callback(error)
				else
					callback(null, item.history)
			})
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

	db.collection(
		'exercises',
		function (error, collection) {

			if (error)
				callback(error)

			else
				collection
					.find()
					.sort({_id: 1})
					.toArray(execArray)
		}
	)
}

exports.add = function (exercise, callback) {

	var temp = {},
	    now = new Date()

	temp.createdAt = now
	temp.updatedAt = now

	temp.current = deleteEmptyFields(exercise)
	temp.current.createdAt = now


	db.collection('exercises', function (error, collection) {

		collection.insert(
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
	})
}

exports.update = function (exerciseFromForm, callback) {

	var temp = {},
	    now = new Date()

	temp['_id'] = new BSON.ObjectID(exerciseFromForm.id)

	temp.current = clone(deleteEmptyFields(exerciseFromForm))

	delete temp.current.id
	delete temp.current.updatedAt

	temp.current.createdAt = now
	temp.updatedAt = now

	db.collection('exercises', function (error, collection) {

		if (error)
			callback('An error occurred while loading the exercises collection: ' + error)


		collection.findOne({'_id': temp._id}, function (error, item) {


			if (error)
				callback('An error occurred while loading the exercise: ' + error)

			else {

				temp.history = item.history || []
				temp.history.push(item.current)


				collection.update(
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
	})
}

exports.delete = function (id, callback) {

	//var id = req.params.id

	console.log('Deleting exercise: ' + id)

	db.collection('exercises', function (error, collection) {
		collection.remove(
			{'_id': new BSON.ObjectID(id)},
			{safe: true},
			function (error, result) {
				if (error)
					callback(error)
				else {
					console.log('' + result + ' document(s) deleted')
					callback(req.body)
				}
			})
	})
}


db = new Db(database, new Server("127.0.0.1", 27017, {auto_reconnect: true}), {w: 1})

db.open(function (error, db) {

	if (error)
		throw error

	console.log('Exercises module connected to database "' + database + '"')
})

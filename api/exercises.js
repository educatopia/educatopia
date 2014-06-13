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

				//print(key + ": " + exercise[key])
				delete obj[key]
			}
	}

	return obj
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

					callback(null, item.current)
				}
			})
		}
	})
}

exports.getRenderedById = function (id, callback) {

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

					marked(item.current.task, function (error, content) {

						if (error)
							callback(error)

						else
							item.current.task = content
					})

					callback(null, item.current)
				}
			})
		}
	})
}

exports.getHistoryById = function (id, callback) {

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

		callback(tempArray)
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

exports.add = function (req, res) {

	var exercise = {}

	exercise.current = deleteEmptyFields(req.body)

	console.log('Adding exercise:')

	db.collection('exercises', function (error, collection) {

		collection.insert(exercise, {safe: true}, function (error, result) {

			if (error)
				callback(error)

			else {
				console.log('Successfully added following exercise:')
				console.dir(result)

				callback(null, result[0])
			}
		})
	})
}

exports.update = function (exercise, callback) {

	var id = new BSON.ObjectID(exercise.id),
	    temp = {}


	temp['_id'] = id
	temp.current = clone(exercise)

	delete temp.current.id

	console.log(temp)

	db.collection('exercises', function (error, collection) {

		if (error)
			callback('An error occurred while loading the exercises collection: ' + error)


		collection.findOne({'_id': id}, function (error, item) {

			if (error)
				callback('An error occurred while loading the exercise: ' + error)

			else {

				temp.history = item.history || []

				temp.history.push(item.current)

				collection.update(
					{'_id': id},
					temp,
					{safe: true},
					function (error, result) {

						if (error)
							callback('An error occurred while updating the exercise: ' + error)

						else {
							// TODO: remove for production
							//setTimeout(function () {
								callback(null, exercise)
							//}, 2000)
						}
					}
				)
			}
		})
	})
}


/*
 exports.update = function (req, res) {

 var id = req.body.id,
 exercise = req.body

 console.log('Updating exercise: ' + id)
 console.log(JSON.stringify(exercise))

 console.log(new BSON.ObjectID(id))

 db.collection('exercises', function (error, collection) {
 collection.update(
 {'_id': new BSON.ObjectID(id)},
 exercise,
 {safe: true}, function (error, result) {
 if (error) {
 console.log('Error updating exercise: ' + error)
 res.send({'error': 'An error has occurred'})
 } else {
 console.log('' + result + ' document(s) updated')
 res.send(exercise)
 }
 })
 })
 }
 */

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

var mongo = require('mongodb'),
    marked = require('marked'),

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

	//c.log('Retrieving exercise: ' + id)

	db.collection('exercises', function (err, collection) {

		if (err)
			console.error(err)

		else {
			collection.findOne({'_id': id}, function (err, item) {

				if (err)
					console.error(err)

				else {
					item.current.id = id

					marked(item.current.task, function (err, content) {

						if (err)
							console.error(err)

						else {

							console.log(content)

							item.current.task = content
						}
					})

					callback(item.current)
				}
			})
		}
	})
}

exports.getHistoryById = function (req, res) {

	var id = new BSON.ObjectID(req.params.id)

	console.log('Retrieving history of exercise: ' + id)

	db.collection('exercises', function (err, collection) {

		if (!err) {
			collection.findOne({'_id': id}, function (err, item) {

				if (!err)
					res.send(item.history)

				else
					console.error(err)
			})
		}
		else
			console.error(err)
	})
}

exports.getAll = function (callback) {

	function execArray (err, items) {

		if (err)
			throw new Error(err)

		var tempArray = []

		items.forEach(function (item) {

			var temp = {},
			    key

			temp.id = item._id // TODO: Introduce extra url id
			temp.url = '/exercises/' + item._id

			for (key in item.current)
				if (item.current.hasOwnProperty(key))
					temp[key] = item.current[key]


			/*
			 marked(item.current.task, function (err, content) {

			 if (err)
			 throw err
			 else
			 temp.task = content

			 tempArray.push(temp)
			 })
			 */

			tempArray.push(temp)
		})

		callback(tempArray)
	}

	db.collection(
		'exercises',
		function (err, collection) {

			if (err)
				console.error(err)

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

	db.collection('exercises', function (err, collection) {

		collection.insert(exercise, {safe: true}, function (err, result) {

			if (!err) {
				console.log('Successfully added following exercise:')
				console.dir(result)

				res.send(result[0])
			}
			else
				console.log(err)
			res.send(err)
		})
	})
}

exports.update = function (req, res) {

	var exercise = deleteEmptyFields(req.body),
	    id = new BSON.ObjectID(exercise.id),
	    temp = {}


	temp['_id'] = id

	temp.current = exercise

	delete temp.current.id


	console.log('Updating exercise: ' + id)

	db.collection('exercises', function (err, collection) {

			// FIXME: Very ugly!

			collection.findOne(
				{'_id': id},
				function (err, item) {

					if (!err) {

						if (item.history)
							temp.history = item.history

						else
							temp.history = []


						temp.history.push(item.current)
						//console.log(temp)

						collection.update(
							{'_id': id},
							temp,
							{safe: true},
							function (err, result) {

								if (!err) {
									console.log(result + ' document(s) updated')

									// TODO: remove for production

									setTimeout(function () {
										res.send({})
									}, 2000)
								}
								else {
									console.error('Error updating exercise: ' + err)
									res.send({'error': 'An error has occurred'})
								}
							}
						)
					}
					else
						console.error(err)
				})


		}
	)

	//exercise.history.push(exercise.current)
}


/*exports.update = function (req, res) {

 var id = req.body.id,
 exercise = req.body

 console.log('Updating exercise: ' + id)
 console.log(JSON.stringify(exercise))

 console.log(new BSON.ObjectID(id))

 db.collection('exercises', function (err, collection) {
 collection.update(
 {'_id': new BSON.ObjectID(id)},
 exercise,
 {safe: true}, function (err, result) {
 if (err) {
 console.log('Error updating exercise: ' + err)
 res.send({'error': 'An error has occurred'})
 } else {
 console.log('' + result + ' document(s) updated')
 res.send(exercise)
 }
 })
 })
 }*/

exports.delete = function (req, res) {

	var id = req.params.id

	console.log('Deleting exercise: ' + id)

	db.collection('exercises', function (err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred - ' + err})
			}
			else {
				console.log('' + result + ' document(s) deleted')
				res.send(req.body)
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

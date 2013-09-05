var mongo = require('mongodb'),
	marked = require('marked')

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure,
	c = console,
	database = 'educatopiadev'


var db = new Db(database, new Server("127.0.0.1", 27017, {auto_reconnect: true}), {w: 1})

db.open(function (err, db) {
	if (!err) {

		c.log('Connected to database "' + database + '"')

		db.collection('exercises', {safe: true}, function (err, collection) {
			if (err)
				c.error("The exercises don't exist.")
		})
	}
	else
		c.error(err)
})

function deleteEmptyFields(obj){

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


//Exports

exports.getById = function (req, res) {

	var id = new BSON.ObjectID(req.params.id)

	c.log('Retrieving exercise: ' + id)

	db.collection('exercises', function (err, collection) {

		if (!err) {

			collection.findOne({'_id': id}, function (err, item) {

				if (!err) {

					item.current.id = id

					console.log('test')

					marked(item.current.task, function (err, content) {

						if (!err) {

							console.log(content)

							item.current.task = content

						}

						else
							throw err
					})

					res.send(item.current)
				}
				else
					c.error(err)
			})
		}
		else
			c.error(err)
	})
}

exports.getHistoryById = function (req, res) {

	var id = new BSON.ObjectID(req.params.id)

	c.log('Retrieving history of exercise: ' + id)

	db.collection('exercises', function (err, collection) {

		if (!err) {
			collection.findOne({'_id': id}, function (err, item) {

				if (!err)
					res.send(item.history)

				else
					c.error(err)
			})
		}
		else
			c.error(err)
	})
}

exports.getAll = function (req, res) {

	db.collection(
		'exercises',
		function (err, collection) {

			if (!err) {

				collection
					.find()
					.sort({_id: 1})
					.toArray(function (err, items) {

						var tempArray = []

						items.forEach(function (item) {

							var temp = {}

							temp.id = item._id

							for (var key in item.current) {

								if (item.current.hasOwnProperty(key)) {
									temp[key] = item.current[key]
								}
							}

							/*marked(item.current.task, function (err, content) {

							 if (!err){
							 console.log(content)

							 temp.task = content
							 }

							 else
							 throw err
							 })*/

							tempArray.push(temp)
						})

						res.send(tempArray)
					})
			}
			else
				console.error(err)
		})
}

exports.add = function (req, res) {

	var exercise = {}

	exercise.current = deleteEmptyFields(req.body)

	c.log('Adding exercise:')

	db.collection('exercises', function (err, collection) {

		collection.insert(exercise, {safe: true}, function (err, result) {

			if (!err) {
				c.log('Successfully added following exercise:')
				c.dir(result)

				res.send(result[0])
			}
			else
				c.log(err)
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


	c.log('Updating exercise: ' + id)

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
						//c.log(temp)

						collection.update(
							{'_id': id},
							temp,
							{safe: true},
							function (err, result) {

								if (!err) {
									c.log(result + ' document(s) updated')

									// TODO: remove for production

									setTimeout(function () {
										res.send({})
									}, 2000)
								}
								else {
									c.error('Error updating exercise: ' + err)
									res.send({'error': 'An error has occurred'})
								}
							}
						)
					}
					else
						c.error(err)
				})


		}
	)

//exercise.history.push(exercise.current)
}


/*exports.update = function (req, res) {

 var id = req.body.id,
 exercise = req.body

 c.log('Updating exercise: ' + id)
 c.log(JSON.stringify(exercise))

 c.log(new BSON.ObjectID(id))

 db.collection('exercises', function (err, collection) {
 collection.update(
 {'_id': new BSON.ObjectID(id)},
 exercise,
 {safe: true}, function (err, result) {
 if (err) {
 c.log('Error updating exercise: ' + err)
 res.send({'error': 'An error has occurred'})
 } else {
 c.log('' + result + ' document(s) updated')
 res.send(exercise)
 }
 })
 })
 }*/

exports.delete = function (req, res) {

	var id = req.params.id

	c.log('Deleting exercise: ' + id)

	db.collection('exercises', function (err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
			if (err) {
				res.send({'error': 'An error has occurred - ' + err})
			} else {
				c.log('' + result + ' document(s) deleted')
				res.send(req.body)
			}
		})
	})
}
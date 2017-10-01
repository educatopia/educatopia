'use strict'

var mongo = require('mongodb'),
  marked = require('marked'),
  clone = require('clone'),
  capitalizer = require('capitalizer'),

  BSON = mongo.BSONPure,
  exportObject = {},
  exercisesCollection


marked.setOptions({
  breaks: true,
  sanitize: true
})


function normalize (obj) {

  // Delete empty fields, normalize line-breaks and fix data-types

  function normalizeLineBreaks (string) {
    return string.replace(/\r\n/g, '\n')
  }

  var key

  for (key in obj) {
    if (obj.hasOwnProperty(key) &&
        (
            obj[key] === '' ||
            obj[key] === 0 ||
            obj[key] === null ||
            obj[key] === undefined ||
            (Array.isArray(obj[key]) &&
                (obj[key].length === 0 || obj[key][0] === ''))
        )
    ) {
      delete obj[key]
    }

    else if (typeof obj[key] === 'string')
      obj[key] = normalizeLineBreaks(obj[key])

    else if (Array.isArray(obj[key])) {
      // jshint loopfunc: true
      obj[key] = obj[key].map(function (element) {
        return (typeof element === 'string') ?
               normalizeLineBreaks(element) :
               element
      })
    }
  }


  // Convert fields to arrays
  if (typeof obj.solutions === 'string')
    obj.solutions = [obj.solutions]

  if (typeof obj.hints === 'string')
    obj.hints = [obj.hints]

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

function renderMarkdown (exerciseData) {

  if (exerciseData.task)
    exerciseData.task = marked(exerciseData.task)

  if (exerciseData.approach)
    exerciseData.approach = marked(exerciseData.approach)

  if (exerciseData.solutions)
    exerciseData.solutions.forEach(function (solution, index) {
      exerciseData.solutions[index] = marked(solution)
    })
}


exportObject.getById = function (id, callback) {

  try {
    id = BSON.ObjectID(id)
  }
  catch (error) {
    callback({message: 'Invalid Id'})
    return
  }


  exercisesCollection.findOne(
    {_id: id},
    function (error, exercise) {

      if (error || !exercise)
        callback(error)

      else
        callback(null, exerciseToPrintFormat(exercise))
    }
  )
}

exportObject.getByIdRendered = function (id, callback) {

  try {
    id = BSON.ObjectID(id)
  }
  catch (error) {
    callback({message: 'Invalid Id'})
    return
  }

  exercisesCollection.findOne(
    {_id: id},
    function (error, exercise) {

      if (error || !exercise)
        callback(error)

      else {

        // TODO: Distinguish between different exercise data formats
        if (exercise.history)
          exercise.current.createdBy = exercise.history[0].createdBy

        renderMarkdown(exercise.current)

        callback(null, exerciseToPrintFormat(exercise))
      }
    }
  )
}

exportObject.getHistoryById = function (id, callback) {

  try {
    id = BSON.ObjectID(id)
  }
  catch (error) {
    callback({message: 'Invalid Id'})
    return
  }

  exercisesCollection.findOne({_id: id}, function (error, exercise) {

    if (error)
      callback(error)

    else {
      exercise.history = exercise.history || []

      callback(null, exercise.history.concat(exercise.current))
    }
  })
}

exportObject.getAll = function (callback) {

  exercisesCollection
    .find()
    .sort({_id: 1})
    .toArray(function (error, items) {

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

        if (temp.subjects != null) {
          temp.subjects = capitalizer(temp.subjects)

          if (Array.isArray(temp.subjects))
            temp.subjects = temp.subjects.join(', ')
        }
        else
          temp.subjects = ''

        tempArray.push(temp)
      })

      callback(null, tempArray)
    })
}

exportObject.getByUser = function (username, callback) {

  exercisesCollection
    .find({
      $or: [
        {
          $and: [
            {'current.createdBy': username},
            {history: {$exists: false}}
          ]
        },
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

exportObject.add = function (exercise, user, callback) {

  var temp = {},
    now = new Date()

  temp.updatedAt = now

  temp.current = normalize(exercise)
  temp.current.createdAt = now
  temp.current.createdBy = user.username

  exercisesCollection.insert(
    temp,
    {safe: true},
    function (error, result) {

      if (error)
        callback(error)

      else {
        console.log('Successfully added an exercise')

        callback(null, result[0])
      }
    }
  )
}

exportObject.update = function (exerciseFromForm, user, callback) {

  var temp = {},
    now = new Date()

  temp._id = new BSON.ObjectID(exerciseFromForm.id)

  temp.current = clone(normalize(exerciseFromForm))


  delete temp.current.id
  delete temp.current.updatedAt

  temp.current.createdAt = now
  temp.updatedAt = now

  temp.current.createdBy = user.username


  exercisesCollection.findOne({_id: temp._id}, function (error, item) {

    if (error)
      callback('An error occurred while loading the exercise: ' + error)

    else {

      temp.history = item.history || []
      temp.history.push(item.current)

      exercisesCollection.update(
        {_id: temp._id},
        temp,
        {safe: true},
        function (error, result) {

          if (error || result === 0)
            callback('An error occurred while updating the exercise: ' + error)

          else {

            renderMarkdown(temp.current)

            callback(null, exerciseToPrintFormat(temp))
          }
        }
      )
    }
  })
}

exportObject.delete = function (id, callback) {

  console.log('Deleting exercise: ' + id)

  exercisesCollection.remove(
    {_id: new BSON.ObjectID(id)},
    {safe: true},
    function (error, result) {
      if (error)
        callback(error)
      else {
        console.log('' + result + ' document(s) deleted')
        callback()
      }
    }
  )
}


module.exports = function (config) {

  exercisesCollection = config.database.collection('exercises')

  return exportObject
}

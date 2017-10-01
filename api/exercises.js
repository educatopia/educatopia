const mongo = require('mongodb')
const marked = require('marked')
const clone = require('clone')
const capitalizer = require('capitalizer')

const BSON = mongo.BSONPure
const exportObject = {}
let exercisesCollection


marked.setOptions({
  breaks: true,
  sanitize: true,
})

function normalizeLineBreaks (string) {
  return string.replace(/\r\n/g, '\n')
}

// Delete empty fields, normalize line-breaks and fix data-types
function normalize (obj) {
  let key

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

    else if (typeof obj[key] === 'string') {
      obj[key] = normalizeLineBreaks(obj[key])
    }

    else if (Array.isArray(obj[key])) {
      // jshint loopfunc: true
      obj[key] = obj[key].map((element) => {
        return typeof element === 'string'
          ? normalizeLineBreaks(element)
          : element
      })
    }
  }


  // Convert fields to arrays
  if (typeof obj.solutions === 'string') {
    obj.solutions = [obj.solutions]
  }

  if (typeof obj.hints === 'string') {
    obj.hints = [obj.hints]
  }

  return obj
}

function exerciseToPrintFormat (exercise) {

  const temp = clone(exercise.current)

  temp.id = exercise._id
  temp.updatedAt = exercise.updatedAt

  temp.createdAt = exercise.history
    ? exercise.history[0].createdAt
    : exercise.current.createdAt

  temp.createdBy = exercise.history
    ? exercise.history[0].createdBy
    : exercise.current.createdBy

  return temp
}

function renderMarkdown (exerciseData) {

  if (exerciseData.task) {
    exerciseData.task = marked(exerciseData.task)
  }

  if (exerciseData.approach) {
    exerciseData.approach = marked(exerciseData.approach)
  }

  if (exerciseData.solutions) {
    exerciseData.solutions.forEach((solution, index) => {
      exerciseData.solutions[index] = marked(solution)
    })
  }
}


exportObject.getById = function (id, done) {

  try {
    id = BSON.ObjectID(id) // eslint-disable-line new-cap
  }
  catch (error) {
    done({message: 'Invalid Id'})
    return
  }


  exercisesCollection.findOne(
    {_id: id},
    (error, exercise) => {

      if (error || !exercise) {
        done(error)
      }

      else {
        done(null, exerciseToPrintFormat(exercise))
      }
    }
  )
}

exportObject.getByIdRendered = function (id, done) {

  try {
    id = BSON.ObjectID(id) // eslint-disable-line new-cap
  }
  catch (error) {
    done({message: 'Invalid Id'})
    return
  }

  exercisesCollection.findOne(
    {_id: id},
    (error, exercise) => {

      if (error || !exercise) {
        done(error)
      }

      else {

        // TODO: Distinguish between different exercise data formats
        if (exercise.history) {
          exercise.current.createdBy = exercise.history[0].createdBy
        }

        renderMarkdown(exercise.current)

        done(null, exerciseToPrintFormat(exercise))
      }
    }
  )
}

exportObject.getHistoryById = function (id, done) {

  try {
    id = BSON.ObjectID(id) // eslint-disable-line new-cap
  }
  catch (error) {
    done({message: 'Invalid Id'})
    return
  }

  exercisesCollection.findOne({_id: id}, (error, exercise) => {

    if (error) {
      done(error)
    }

    else {
      exercise.history = exercise.history || []

      done(null, exercise.history.concat(exercise.current))
    }
  })
}

exportObject.getAll = function (done) {

  exercisesCollection
    .find()
    .sort({_id: 1})
    .toArray((error, items) => {

      if (error) {
        done(error)
      }

      const tempArray = []

      items.forEach((item) => {

        const temp = {}

        temp.id = item._id // TODO: Introduce extra url id
        temp.url = '/exercises/' + item._id

        for (const key in item.current) {
          if (item.current.hasOwnProperty(key)) {
            temp[key] = item.current[key]
          }
        }

        if (temp.subjects != null) {
          temp.subjects = capitalizer(temp.subjects)

          if (Array.isArray(temp.subjects)) {
            temp.subjects = temp.subjects.join(', ')
          }
        }
        else {
          temp.subjects = ''
        }

        tempArray.push(temp)
      })

      done(null, tempArray)
    })
}

exportObject.getByUser = function (username, done) {

  exercisesCollection
    .find({
      $or: [
        {
          $and: [
            {'current.createdBy': username},
            {history: {$exists: false}},
          ],
        },
        {'history.0.createdBy': username},
      ],
    })
    .sort({_id: 1})
    .toArray((error, exercises) => {

      if (error) {
        done(error)
      }
      else {
        done(null, exercises)
      }
    })
}

exportObject.add = function (exercise, user, done) {

  const temp = {}
  const now = new Date()

  temp.updatedAt = now

  temp.current = normalize(exercise)
  temp.current.createdAt = now
  temp.current.createdBy = user.username

  exercisesCollection.insert(
    temp,
    {safe: true},
    (error, result) => {

      if (error) {
        done(error)
      }

      else {
        console.info('Successfully added an exercise')

        done(null, result[0])
      }
    }
  )
}

exportObject.update = function (exerciseFromForm, user, done) {

  const temp = {}
  const now = new Date()

  temp._id = new BSON.ObjectID(exerciseFromForm.id)

  temp.current = clone(normalize(exerciseFromForm))


  delete temp.current.id
  delete temp.current.updatedAt

  temp.current.createdAt = now
  temp.updatedAt = now

  temp.current.createdBy = user.username


  exercisesCollection.findOne({_id: temp._id}, (error, item) => {

    if (error) {
      done('An error occurred while loading the exercise: ' + error)
    }

    else {

      temp.history = item.history || []
      temp.history.push(item.current)

      exercisesCollection.update(
        {_id: temp._id},
        temp,
        {safe: true},
        (updateError, result) => {
          if (updateError || result === 0) {
            done(
              `An error occurred while updating the exercise: ${updateError}`
            )
          }
          else {
            renderMarkdown(temp.current)

            done(null, exerciseToPrintFormat(temp))
          }
        }
      )
    }
  })
}

exportObject.delete = function (id, done) {

  console.info('Deleting exercise: ' + id)

  exercisesCollection.remove(
    {_id: new BSON.ObjectID(id)},
    {safe: true},
    (error, result) => {
      if (error) {
        done(error)
      }
      else {
        console.info(String(result) + ' document(s) deleted')
        done()
      }
    }
  )
}


module.exports = function (config) {

  exercisesCollection = config.database.collection('exercises')

  return exportObject
}

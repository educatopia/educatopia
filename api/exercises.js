const mongo = require('mongodb')
const marked = require('marked')
const clone = require('clone')
const capitalizer = require('capitalizer')

const exportObject = {}
let exercisesCollection


marked.setOptions({
  breaks: true,
})


function normalizeLineBreaks (string) {
  return string.replace(/\r\n/g, '\n')
}


// Delete empty fields, normalize line-breaks and fix data-types
function normalize (obj) {
  const temp = {}

  for (const [key, value] of Object.entries(obj)) {
    const isEmptyArray = Array.isArray(value) &&
      (value.length === 0 || value[0] === '')

    if (!value || isEmptyArray) {
      continue
    }
    else if (typeof value === 'string') {
      temp[key] = normalizeLineBreaks(value)
    }
    else if (Array.isArray(value)) {
      temp[key] = value.map(element =>
        typeof element === 'string'
          ? normalizeLineBreaks(element)
          : element
      )
    }
  }

  // Convert fields to arrays
  if (typeof temp.solutions === 'string') {
    temp.solutions = [obj.solutions]
  }
  if (typeof temp.hints === 'string') {
    temp.hints = [temp.hints]
  }

  return temp
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
    id = mongo.ObjectID(id) // eslint-disable-line new-cap
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
    id = mongo.ObjectID(id) // eslint-disable-line new-cap
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
        return
      }

      // TODO: Distinguish between different exercise data formats
      if (exercise.history) {
        exercise.current.createdBy = exercise.history[0].createdBy
      }

      renderMarkdown(exercise.current)

      done(null, exerciseToPrintFormat(exercise))
    }
  )
}


exportObject.getHistoryById = function (id, done) {
  try {
    id = mongo.ObjectID(id) // eslint-disable-line new-cap
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


exportObject.add = (exercise, user, done) => {
  const now = new Date()
  const current = normalize(exercise)
  current.createdAt = now
  current.createdBy = user.username

  const temp = {
    updatedAt: now,
    current,
  }

  exercisesCollection.insert(
    temp,
    {safe: true},
    error => {
      if (error) done(error)
      else done(null, temp._id.toHexString())
    }
  )
}


exportObject.update = function (exerciseFromForm, user, done) {
  const temp = {}
  const now = new Date()

  temp._id = new mongo.ObjectID(exerciseFromForm.id)

  temp.current = clone(normalize(exerciseFromForm))


  delete temp.current.id
  delete temp.current.updatedAt

  temp.current.createdAt = now
  temp.updatedAt = now

  temp.current.createdBy = user.username


  exercisesCollection.findOne({_id: temp._id}, (error, item) => {
    if (error) {
      done('An error occurred while loading the exercise: ' + error)
      return
    }

    temp.history = item.history || []
    temp.history.push(item.current)

    exercisesCollection.update(
      {_id: temp._id},
      temp,
      {safe: true},
      (updateError, result) => {
        if (updateError || result === 0) {
          done(`An error occurred while updating the exercise: ${updateError}`)
        }
        else {
          renderMarkdown(temp.current)

          done(null, exerciseToPrintFormat(temp))
        }
      }
    )
  })
}


exportObject.delete = function (id, done) {
  console.info('Deleting exercise: ' + id)

  exercisesCollection.remove(
    {_id: new mongo.ObjectID(id)},
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

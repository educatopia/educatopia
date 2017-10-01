let exercisesApi
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const langs = require('langs')

const exercisesModule = {}

const schemaPath = path
  .resolve(__dirname, '../public/shared/exerciseSchema.yaml')
const schema = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8'))

const fieldsetsPath = path
  .resolve(__dirname, '../public/shared/exerciseFieldsets.yaml')
const fieldsets = yaml.safeLoad(fs.readFileSync(fieldsetsPath, 'utf8'))


schema.language.options = langs
  .names(true)
  .sort((langA, langB) =>
    langA > langB ? 1 : -1
  )


function reformatFormContent (object) {

  let key

  for (key in schema) {
    if (schema.hasOwnProperty(key)) {
      if (schema[key].type === 'list' && schema[key].subtype === 'text') {
        object[key] = object[key].split(/\s*,\s*/)
      }

      else if (schema[key].type === 'date') {
        object[key] = new Date(object[key])
      }
    }
  }

  return object
}

function addEmptyFields (request) {
  // Adds empty fields to render new empty input-fields in form

  Object.keys(request.query)
    .forEach((key) => {

      if (!Array.isArray(request.body[key])) {
        request.body[key] = [request.body[key]]
      }

      request.body[key].push('')
    })
}

function validateExercise (exercise) {

  let fieldName
  let booleanSum = 0

  for (fieldName in schema) {
    if (schema.hasOwnProperty(fieldName) && schema[fieldName].validators) {
      booleanSum += schema[fieldName].validators
        .every(constraint => { // eslint-disable-line no-loop-func
          // TODO: Add more types of validators

          if (constraint === 'required') {
            return Boolean(exercise[fieldName])
          }
          else {
            return true
          }
        })
    }
    else {
      booleanSum++
    }
  }

  return booleanSum === Object.keys(schema).length
}

function submit (request, response, renderObject) {

  let isValid

  if (request.session.user) {

    isValid = validateExercise(request.body)

    if (isValid) {
      exercisesApi.add(
        reformatFormContent(request.body),
        request.session.user,
        (error, exercise) => {

          if (error) {
            console.error(error)
          }

          else {
            response.redirect('/exercises/' + exercise._id)
          }
        }
      )
    }

    else {
      renderObject.message = 'Exercise is not valid! ' +
                             'Please correct mistakes and try to submit again.'

      renderObject.exercise = reformatFormContent(request.body)

      response.render('exercises/create', renderObject)
    }
  }
  else {
    response.redirect('/exercises')
  }
}


exercisesModule.one = function (request, response, next) {

  exercisesApi.getByIdRendered(
    request.params.id,
    (error, exercise) => {

      if (error) {
        console.error(error)
      }

      else if (exercise) {
        response.render('exercises/view', {
          title: 'Exercise',
          page: 'exerciseView',
          exercise: exercise,
        })
      }

      else {
        next()
      }
    }
  )
}

exercisesModule.shortcut = function (request, response) {

  response.redirect('/exercises/' + request.params.id)
}

exercisesModule.create = function (request, response) {

  const renderObject = {
    page: 'exerciseCreate',
    schema: schema,
    fieldsets: fieldsets,
    exercise: {},
  }


  if (request.method === 'POST' && request.session.user) {

    if (Object.keys(request.query).length) {

      addEmptyFields(request)

      renderObject.exercise = reformatFormContent(request.body)

      response.render('exercises/create', renderObject)
    }
    else {
      submit(request, response, renderObject)
    }
  }
  else {
    delete renderObject.fieldsets[2]

    response.render('exercises/create', renderObject)
  }
}

exercisesModule.all = function (request, response) {

  exercisesApi.getAll((error, exercises) => {
    if (error) {
      throw new Error(error)
    }

    response.render('exercises/all', {
      title: 'Exercises',
      page: 'exercises',
      exercises: exercises,
    })
  })
}

exercisesModule.edit = function (request, response, next) {

  const renderObject = {
    title: 'Edit',
    page: 'exerciseEdit',
    schema: schema,
    fieldsets: fieldsets,
  }

  if (request.method === 'POST' && request.session.user) {

    addEmptyFields(request)

    renderObject.exercise = reformatFormContent(request.body)

    response.render('exercises/edit', renderObject)
  }

  else {
    exercisesApi.getById(
      request.params.id,
      (error, exercise) => {

        if (error) {
          console.error(error)
        }

        else if (exercise) {
          renderObject.exercise = exercise
          response.render('exercises/edit', renderObject)
        }
        else {
          next()
        }
      }
    )
  }
}

exercisesModule.history = function (request, response, next) {

  exercisesApi.getHistoryById(
    request.params.id,
    (error, history) => {

      if (error) {
        console.error(error)
      }

      if (history) {
        response.render('exercises/history', {
          title: 'History',
          page: 'exerciseHistory',
          history: history,
          exercise: {
            id: request.params.id,
          },
        })
      }
      else {
        next()
      }
    }
  )
}

exercisesModule.update = function (request, response) {

  const updatedExercise = reformatFormContent(request.body)

  exercisesApi.update(
    updatedExercise,
    request.session.user,
    (error, exercise) => {

      if (error) {
        throw new Error(error)
      }

      else {
        response.render('exercises/view', {
          title: 'Update',
          page: 'exerciseView',
          exercise: exercise,
        })
      }
    }
  )
}


module.exports = config => {
  exercisesApi = require('../api/exercises')(config)
  return exercisesModule
}

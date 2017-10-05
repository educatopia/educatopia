const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')
const langs = require('langs')

const exercisesApi = require('../api/exercises')
const sharedPath = path.resolve(__dirname, '../public/shared')
const schemaPath = path.join(sharedPath, 'exerciseSchema.yaml')
const schema = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8'))

const fieldsetsPath = path.join(sharedPath, 'exerciseFieldsets.yaml')
const fieldsets = yaml.safeLoad(fs.readFileSync(fieldsetsPath, 'utf8'))

const config = {}
const exercisesModule = {}
let api


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


// Adds empty fields to render new empty input-fields in form
function addEmptyFields (request) {
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
  if (!request.session.user) {
    response.redirect('/exercises')
    return
  }

  const isValid = validateExercise(request.body)

  if (isValid) {
    api.add(
      reformatFormContent(request.body),
      request.session.user,
      (error, exerciseId) => {
        if (error) {
          console.error(error)
          return
        }
        response.redirect(`/exercises/${exerciseId}`)
      }
    )
  }
  else {
    renderObject.message =
      'Exercise is not valid! ' +
      'Please correct mistakes and try to submit again.'

    renderObject.exercise = reformatFormContent(request.body)

    response.render('exercises/create', renderObject)
  }
}


exercisesModule.one = (request, response, next) => {
  api.getByIdRendered(
    request.params.id,
    (error, exercise) => {
      if (error) {
        console.error(error)
        return
      }

      if (!exercise) {
        next()
        return
      }

      response.render('exercises/view', {
        title: 'Exercise',
        page: 'exerciseView',
        exercise: exercise,
        featureMap: config.featureMap,
      })
    }
  )
}


exercisesModule.shortcut = (request, response) => {
  response.redirect('/exercises/' + request.params.id)
}


exercisesModule.create = (request, response) => {
  const renderObject = {
    page: 'exerciseCreate',
    schema: schema,
    fieldsets: fieldsets,
    exercise: {},
    featureMap: config.featureMap,
  }

  if (request.method === 'POST' && request.session.user) {
    if (Object.keys(request.query).length) {
      addEmptyFields(request)

      renderObject.exercise = reformatFormContent(request.body)
      renderObject.featureMap = config.featureMap

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


exercisesModule.all = (request, response) => {
  api.getAll((error, exercises) => {
    if (error) {
      throw new Error(error)
    }

    response.render('exercises/all', {
      title: 'Exercises',
      page: 'exercises',
      exercises: exercises,
      featureMap: config.featureMap,
    })
  })
}


exercisesModule.edit = (request, response, next) => {
  const renderObject = {
    title: 'Edit',
    page: 'exerciseEdit',
    schema: schema,
    fieldsets: fieldsets,
    featureMap: config.featureMap,
  }

  if (request.method === 'POST' && request.session.user) {
    addEmptyFields(request)

    renderObject.exercise = reformatFormContent(request.body)
    renderObject.featureMap = config.featureMap

    response.render('exercises/edit', renderObject)
  }
  else {
    api.getById(
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


exercisesModule.history = (request, response, next) => {
  api.getHistoryById(
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
          featureMap: config.featureMap,
        })
      }
      else {
        next()
      }
    }
  )
}


exercisesModule.update = (request, response) => {
  const updatedExercise = reformatFormContent(request.body)

  api.update(
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
          featureMap: config.featureMap,
        })
      }
    }
  )
}


module.exports = theConfig => {
  Object.assign(config, theConfig)
  api = exercisesApi(config)
  return exercisesModule
}

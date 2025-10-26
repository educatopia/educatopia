import fs from "node:fs"
import path from "node:path"

import type { NextFunction } from "express"
import yaml from "js-yaml"
import langs from "langs"
import type { Exercise, RouteRequest, RouteResponse, Config, ApiModules, Fieldsets } from "../api/types"
import * as exercisesApi from "../api/exercises"

type SchemaField = {
  type?: string
  subtype?: string
  validators?: string[]
  options?: unknown[]
}

type Schema = Record<string, SchemaField>

type RenderObject = {
  page?: string
  schema?: Schema
  fieldsets?: unknown
  exercise?: Exercise | Record<string, unknown>
  featureMap?: Record<string, boolean>
  message?: string
  title?: string
  exercises?: Exercise[]
  history?: Exercise[]
}

const sharedPath = path.resolve(__dirname, "../public/shared")
const schemaPath = path.join(sharedPath, "exerciseSchema.yaml")
const schema = yaml.load(fs.readFileSync(schemaPath, "utf8")) as Schema

const fieldsetsPath = path.join(sharedPath, "exerciseFieldsets.yaml")
const fieldsets = yaml.load(fs.readFileSync(fieldsetsPath, "utf8")) as Record<string, unknown>

// These will be initialized by the default export function
let config: Config
let api: ApiModules['exercises']

schema.language.options = langs
  .names(true)
  .sort((langA, langB) => (langA > langB ? 1 : -1))

function reformatFormContent(object: Record<string, unknown>): Record<string, unknown> {
  let key

  for (key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      if (schema[key].type === "list" && schema[key].subtype === "text") {
        object[key] = (object[key] as string).split(/\s*,\s*/)
      } else if (schema[key].type === "date") {
        object[key] = new Date(object[key] as string | number | Date)
      }
    }
  }

  return object
}

// Adds empty fields to render new empty input-fields in form
function addEmptyFields(request: RouteRequest) {
  Object.keys(request.query).forEach((key) => {
    if (!Array.isArray(request.body[key])) {
      request.body[key] = [request.body[key]]
    }

    request.body[key].push("")
  })
}

function validateExercise(exercise: Exercise) {
  let fieldName: string
  let booleanSum = 0

  for (fieldName in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, fieldName) && schema[fieldName].validators) {
      const isValid = schema[fieldName].validators!.every((constraint: string) => {
        // TODO: Add more types of validators

        if (constraint === "required") {
          return Boolean((exercise as Record<string, unknown>)[fieldName])
        } else {
          return true
        }
      })
      booleanSum += isValid ? 1 : 0
    } else {
      booleanSum++
    }
  }

  return booleanSum === Object.keys(schema).length
}

function submit(request: RouteRequest, response: RouteResponse, renderObject: RenderObject) {
  if (!(request as RouteRequest & { session: { user?: unknown } }).session.user) {
    response.redirect("/exercises")
    return
  }

  const isValid = validateExercise(request.body)

  if (isValid) {
    try {
      api.add(
        reformatFormContent(request.body) as Exercise,
        request.session?.user || { username: '', email: '', password: '' }
      )
      // For now, redirect to exercises list since we don't have the exact exercise ID
      response.redirect("/exercises")
    } catch (error) {
      console.error(error)
      renderObject.message = "Error creating exercise. Please try again."
      renderObject.exercise = reformatFormContent(request.body)
      response.render("exercises/create", renderObject)
    }
  } else {
    renderObject.message =
      "Exercise is not valid! " +
      "Please correct mistakes and try to submit again."

    renderObject.exercise = reformatFormContent(request.body)

    response.render("exercises/create", renderObject)
  }
}

export async function one(request: RouteRequest, response: RouteResponse, next: NextFunction) {
  try {
    const exercise = await api.getBySlugRendered(request.params.id)

    if (!exercise) {
      next()
      return
    }

    // Get the original creation date from the oldest history entry
    const history = api.getHistoryById(exercise.id)
    let originalCreatedAt = exercise.createdAt

    if (history && history.length > 0) {
      // Find the oldest entry (last in the array since it's ordered DESC)
      const oldestEntry = history[history.length - 1]
      originalCreatedAt = oldestEntry.createdAt
    }

    const hostname = request.app.get("hostname") || request.hostname || "localhost:3470"

    response.render("exercises/view", {
      title: "Exercise",
      page: "exerciseView",
      exercise: { ...exercise, originalCreatedAt },
      featureMap: config.featureMap,
      settings: { hostname },
    })
  } catch (error) {
    console.error(error)
    next()
  }
}

export function shortcut(request: RouteRequest, response: RouteResponse) {
  response.redirect(`/exercises/${request.params.id}`)
}

export function create(request: RouteRequest, response: RouteResponse) {
  const renderObject: RenderObject = {
    page: "exerciseCreate",
    schema: schema,
    fieldsets: fieldsets,
    exercise: {},
    featureMap: config.featureMap,
  }

  if (request.method === "POST" && (request as RouteRequest & { session: { user?: unknown } }).session.user) {
    if (Object.keys(request.query).length) {
      addEmptyFields(request)

      renderObject.exercise = reformatFormContent(request.body)
      renderObject.featureMap = config.featureMap

      response.render("exercises/create", renderObject)
    } else {
      submit(request, response, renderObject)
    }
  } else {
    delete (renderObject.fieldsets as Fieldsets)[2]

    response.render("exercises/create", renderObject)
  }
}

export function all(request: RouteRequest, response: RouteResponse) {
  try {
    const exercises = api.getAll()
    if (!exercises) {
      throw new Error("Failed to get exercises")
    }

    response.render("exercises/all", {
      title: "Exercises",
      page: "exercises",
      exercises: exercises,
      featureMap: config.featureMap,
    })
  } catch (error) {
    throw new Error(String(error))
  }
}

export function edit(request: RouteRequest, response: RouteResponse, next: NextFunction) {
  const renderObject: RenderObject = {
    title: "Edit",
    page: "exerciseEdit",
    schema: schema,
    fieldsets: fieldsets,
    featureMap: config.featureMap,
  }

  if (request.method === "POST" && (request as RouteRequest & { session: { user?: unknown } }).session.user) {
    addEmptyFields(request)

    renderObject.exercise = reformatFormContent(request.body)
    renderObject.featureMap = config.featureMap

    response.render("exercises/edit", renderObject)
  } else {
    try {
      const exercise = api.getBySlug(request.params.id) as Exercise | null

      if (exercise) {
        // Process array fields that are stored as JSON strings
        const processedExercise = { ...exercise }
        if (processedExercise.subjects && typeof processedExercise.subjects === 'string') {
          processedExercise.subjects = JSON.parse(processedExercise.subjects || '[]')
        }
        if (processedExercise.hints && typeof processedExercise.hints === 'string') {
          processedExercise.hints = JSON.parse(processedExercise.hints || '[]')
        }
        if (processedExercise.tags && typeof processedExercise.tags === 'string') {
          processedExercise.tags = JSON.parse(processedExercise.tags || '[]')
        }
        if (processedExercise.solutions && typeof processedExercise.solutions === 'string') {
          processedExercise.solutions = JSON.parse(processedExercise.solutions || '[]')
        }
        renderObject.exercise = processedExercise
        response.render("exercises/edit", renderObject)
      } else {
        next()
      }
    } catch (error) {
      console.error(error)
      next()
    }
  }
}

export function history(request: RouteRequest, response: RouteResponse, next: NextFunction) {
  try {
    // Get exercise by slug to retrieve its numeric ID
    const exercise = api.getBySlug(request.params.id) as Exercise | null
    if (!exercise) {
      next()
      return
    }

    const history = api.getHistoryById(exercise.id)

    if (history && Array.isArray(history) && history.length > 0) {
      response.render("exercises/history", {
        title: "History",
        page: "exerciseHistory",
        history: history as Exercise[],
        exercise: exercise,
        featureMap: config.featureMap,
      })
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
    next()
  }
}

export function update(request: RouteRequest, response: RouteResponse) {
  const updatedExercise = reformatFormContent(request.body)

  try {
    api.update(
      updatedExercise as Exercise,
      request.session?.user || { username: '', email: '', password: '' }
    )

    response.render("exercises/view", {
      title: "Update",
      page: "exerciseView",
      exercise: updatedExercise,
      featureMap: config.featureMap,
    })
  } catch (error) {
    throw new Error(String(error))
  }
}

// Default export function that initializes config and API, then returns route handlers
export default function(cfg: Config) {
  config = cfg

  // Initialize the exercises API functions directly
  api = {
    getById: exercisesApi.getById,
    getBySlug: exercisesApi.getBySlug,
    getByIdRendered: exercisesApi.getByIdRendered,
    getBySlugRendered: exercisesApi.getBySlugRendered,
    getHistoryById: exercisesApi.getHistoryById,
    getAll: exercisesApi.getAll,
    add: exercisesApi.add,
    update: exercisesApi.update,
    deleteExercise: exercisesApi.deleteExercise,
  }

  return {
    all,
    create,
    one,
    edit,
    update,
    shortcut,
    history
  }
}

import { marked } from "marked"
import clone from "clone"
import capitalizer from "capitalizer"
import { Database } from "bun:sqlite"
import type { Config, Exercise, User } from "./types"

const db = new Database("educatopia.sqlite", { strict: true })

// TODO
// marked.setOptions({
//   breaks: true,
// })

function normalizeLineBreaks(str: string) {
  return str.replace(/\r\n/g, "\n")
}

function normalize(obj: Record<string, unknown>) {
  const temp: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const isEmptyArray =
      Array.isArray(value) && (value.length === 0 || value[0] === "")

    if (!value || isEmptyArray) {
      // continue
    } else if (typeof value === "string") {
      temp[key] = normalizeLineBreaks(value)
    } else if (Array.isArray(value)) {
      temp[key] = value.map((element) =>
        typeof element === "string" ? normalizeLineBreaks(element) : element,
      )
    }
  }

  if (typeof temp.solutions === "string") {
    temp.solutions = [temp.solutions]
  }
  if (typeof temp.hints === "string") {
    temp.hints = [temp.hints]
  }

  return temp
}

function exerciseToPrintFormat(exercise: Exercise) {
  const temp = clone(exercise)
  temp.subjects = JSON.parse(temp.subjects || "[]")
  temp.hints = JSON.parse(temp.hints || "[]")
  temp.solutions =
    temp.solutions === "string"
      ? JSON.parse(temp.solutions || "[]")
      : temp.solutions
  temp.tags = JSON.parse(temp.tags || "[]")
  return temp
}

async function renderMarkdown(exercise: Exercise) {
  if (exercise.task) {
    exercise.task = marked.parse(exercise.task) as string
  }

  if (exercise.approach) {
    exercise.approach = marked.parse(exercise.approach) as string
  }

  if (exercise.solutions) {
    exercise.solutions = Array.isArray(exercise.solutions)
      ? exercise.solutions.map((solution) => marked.parse(solution) as string)
      : exercise.solutions
  }
  return exercise
}

export function getById(id: string) {
  return db.query("SELECT * FROM exercises WHERE id == :id").get({ id })
}

export function getByIdRendered(id: string) {
  const exercise = db
    .query("SELECT * FROM exercises WHERE id == :id")
    .get({ id }) as Exercise

  return renderMarkdown(exerciseToPrintFormat(exercise))
}

export function getHistoryById(id: string) {
  const exercise = db
    .query("SELECT * FROM exercises WHERE id == :id")
    .get({ id })

  return exercise
}

export function getAll() {
  const exercises = db
    .query("SELECT * FROM exercises ORDER BY id ASC")
    .all() as Exercise[]

  return exercises.map((exercise) => {
    const temp = exerciseToPrintFormat(exercise as Exercise)
    temp.url = `/exercises/${temp.id}`
    if (temp.subjects != null) {
      temp.subjects = capitalizer(temp.subjects)
      if (Array.isArray(temp.subjects)) {
        temp.subjects = temp.subjects.join(", ")
      }
    } else {
      temp.subjects = ""
    }
    return temp
  })
}

export function getByUser(username: string) {
  const exercises = db
    .query(`
      SELECT * FROM exercises
      WHERE createdBy == :createdBy
      ORDER BY id ASC
    `)
    .all({ createdBy: username }) as Exercise[]

  return exercises.map(exerciseToPrintFormat)
}

export function add(exercise: Exercise, user: User) {
  const now = new Date().toISOString()
  const current = normalize(exercise)
  current.createdAt = now
  current.updatedAt = now
  current.createdBy = user.username

  return db
    .query(`
			INSERT INTO exercises
			(
				createdAt,
				updatedAt,
				createdBy,
				task,
				subjects,
				hints,
				approach,
				solutions,
				type,
				credits,
				difficulty,
				duration,
				tags,
				note
			)
			VALUES (
				:createdAt,
				:updatedAt,
				:createdBy,
				:task,
				:subjects,
				:hints,
				:approach,
				:solutions,
				:type,
				:credits,
				:difficulty,
				:duration,
				:tags,
				:note
			)
		`)
    .get({
      createdAt: current.createdAt,
      updatedAt: current.updatedAt,
      createdBy: current.createdBy,
      task: current.task,
      subjects: JSON.stringify(current.subjects || []),
      hints: JSON.stringify(current.hints || []),
      approach: current.approach,
      solutions: JSON.stringify(current.solutions || []),
      type: current.type,
      credits: current.credits,
      difficulty: current.difficulty,
      duration: current.duration,
      tags: JSON.stringify(current.tags || []),
      note: current.note,
    })
}

export function update(exerciseFromForm: Exercise, user: User) {
  const now = new Date().toISOString()
  const current = normalize(exerciseFromForm)
  current.updatedAt = now
  current.createdBy = user.username

  return db
    .query(`
			UPDATE exercises
			SET
				updatedAt = :updatedAt,
				createdBy = :createdBy,
				task = :task,
				subjects = :subjects,
				hints = :hints,
				approach = :approach,
				solutions = :solutions,
				type = :type,
				credits = :credits,
				difficulty = :difficulty,
				duration = :duration,
				tags = :tags,
				note = :note
			WHERE id == :id
		`)
    .get({
      updatedAt: current.updatedAt,
      createdBy: current.createdBy,
      task: current.task,
      subjects: JSON.stringify(current.subjects || []),
      hints: JSON.stringify(current.hints || []),
      approach: current.approach,
      solutions: JSON.stringify(current.solutions || []),
      type: current.type,
      credits: current.credits,
      difficulty: current.difficulty,
      duration: current.duration,
      tags: JSON.stringify(current.tags || []),
      note: current.note,
      id: exerciseFromForm.id,
    })
}

export function deleteExercise(id: string) {
  db.query("DELETE FROM exercises WHERE id == :id").run({ id })
}

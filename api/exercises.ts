import { marked } from "marked"
import clone from "clone"
import capitalizer from "capitalizer"
import { Database } from "bun:sqlite"
import type { Exercise, User, ExerciseDbParams } from "./types"

const db = new Database("educatopia.sqlite", { strict: true })

// Generate a unique slug with 24 hex characters
function generateSlug(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return timestamp + random
}

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
  temp.subjects = typeof temp.subjects === 'string' ? JSON.parse(temp.subjects || "[]") : temp.subjects
  temp.hints = typeof temp.hints === 'string' ? JSON.parse(temp.hints || "[]") : temp.hints
  temp.solutions =
    typeof temp.solutions === "string"
      ? JSON.parse(temp.solutions || "[]")
      : temp.solutions
  temp.tags = typeof temp.tags === 'string' ? JSON.parse(temp.tags || "[]") : temp.tags
  temp.flags = typeof temp.flags === 'string' ? JSON.parse(temp.flags || "[]") : temp.flags

  // Convert date strings to Date objects for template compatibility
  if (temp.createdAt && typeof temp.createdAt === 'string') {
    temp.createdAt = new Date(temp.createdAt)
  }
  if (temp.updatedAt && typeof temp.updatedAt === 'string') {
    temp.updatedAt = new Date(temp.updatedAt)
  }

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

export function getBySlug(slug: string) {
  return db.query("SELECT * FROM exercises WHERE slug == :slug").get({ slug })
}

export async function getByIdRendered(id: string) {
  const exercise = db
    .query("SELECT * FROM exercises WHERE id == :id")
    .get({ id }) as Exercise

  if (!exercise) return null

  return await renderMarkdown(exerciseToPrintFormat(exercise))
}

export async function getBySlugRendered(slug: string) {
  const exercise = db
    .query("SELECT * FROM exercises WHERE slug == :slug")
    .get({ slug }) as Exercise

  if (!exercise) return null

  return await renderMarkdown(exerciseToPrintFormat(exercise))
}

export function getHistoryById(id: string) {
  // Get the current version from exercises table
  const currentVersion = db
    .query(`SELECT * FROM exercises WHERE id == :id`)
    .get({ id }) as Exercise | null

  // Get all historical versions
  const history = db
    .query(`
      SELECT * FROM exercise_history
      WHERE exerciseId == :id
      ORDER BY updatedAt DESC
    `)
    .all({ id }) as Exercise[]

  // Combine current version with history (current version first)
  const allVersions: Exercise[] = []

  if (currentVersion) {
    allVersions.push(currentVersion)
  }

  allVersions.push(...history)

  if (allVersions.length === 0) return []

  return allVersions.map(exerciseToPrintFormat)
}

export function getAll() {
  const exercises = db
    .query("SELECT * FROM exercises ORDER BY id ASC")
    .all() as Exercise[]

  return exercises.map((exercise) => {
    const temp = exerciseToPrintFormat(exercise as Exercise)
    temp.url = `/exercises/${temp.slug}`
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

  // Generate a unique slug for the new exercise
  const slug = generateSlug()

  return db
    .query(`
			INSERT INTO exercises
			(
				slug,
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
				$slug,
				$createdAt,
				$updatedAt,
				$createdBy,
				$task,
				$subjects,
				$hints,
				$approach,
				$solutions,
				$type,
				$credits,
				$difficulty,
				$duration,
				$tags,
				$note
			)
		`)
    .run({
      slug,
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
    } as ExerciseDbParams)
}

export function update(exerciseFromForm: Exercise, _user: User) {
  const now = new Date().toISOString()
  const current = normalize(exerciseFromForm)
  current.updatedAt = now

  // Get the current version before updating
  const oldVersion = db
    .query("SELECT * FROM exercises WHERE id == :id")
    .get({ id: exerciseFromForm.id }) as Exercise

  if (oldVersion) {
    // Save current version to history (stored as-is from DB, which has JSON strings)
    db.query(`
      INSERT INTO exercise_history
      (
        exerciseId,
        task,
        approach,
        solutions,
        subjects,
        type,
        credits,
        difficulty,
        duration,
        tags,
        note,
        hints,
        createdAt,
        updatedAt,
        createdBy
      )
      VALUES (
        $exerciseId,
        $task,
        $approach,
        $solutions,
        $subjects,
        $type,
        $credits,
        $difficulty,
        $duration,
        $tags,
        $note,
        $hints,
        $createdAt,
        $updatedAt,
        $createdBy
      )
    `).run({
      exerciseId: oldVersion.id as string,
      task: (oldVersion.task || '') as string,
      approach: (oldVersion.approach || null) as string | null,
      solutions: (oldVersion.solutions || null) as string | null,
      subjects: (oldVersion.subjects || null) as string | null,
      type: (oldVersion.type || '') as string,
      credits: Number(oldVersion.credits || 0),
      difficulty: Number(oldVersion.difficulty || 0),
      duration: Number(oldVersion.duration || 0),
      tags: (oldVersion.tags || null) as string | null,
      note: (oldVersion.note || null) as string | null,
      hints: (oldVersion.hints || null) as string | null,
      createdAt: (oldVersion.createdAt || new Date().toISOString()) as string,
      updatedAt: (oldVersion.updatedAt || new Date().toISOString()) as string,
      createdBy: (oldVersion.createdBy || '') as string,
    })
  }

  // Preserve original createdAt and createdBy from the old version
  return db
    .query(`
			UPDATE exercises
			SET
				updatedAt = $updatedAt,
				task = $task,
				subjects = $subjects,
				hints = $hints,
				approach = $approach,
				solutions = $solutions,
				type = $type,
				credits = $credits,
				difficulty = $difficulty,
				duration = $duration,
				tags = $tags,
				note = $note
			WHERE id == $id
		`)
    .run({
      updatedAt: current.updatedAt,
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
    } as ExerciseDbParams)
}

export function deleteExercise(id: string) {
  db.query("DELETE FROM exercises WHERE id == :id").run({ id })
}

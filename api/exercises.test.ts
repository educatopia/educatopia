import { test, expect, beforeAll, afterAll, describe } from "bun:test"
import { Database } from "bun:sqlite"
import type { Exercise, User } from "./types"

// Use a test-specific database file
const testDb = new Database("test-exercises.sqlite", { strict: true })

// Mock module for testing - we'll create local versions of the functions
// that use our test database instead of the production one
const exercisesModule = {
  add(exercise: Exercise, user: User) {
    const now = new Date().toISOString()
    const normalized: Record<string, unknown> = {
      createdAt: now,
      updatedAt: now,
      createdBy: user.username,
      task: exercise.task || '',
      subjects: exercise.subjects,
      hints: exercise.hints || [],
      approach: exercise.approach || '',
      solutions: exercise.solutions || [],
      type: exercise.type || 'problem',
      credits: exercise.credits || 0,
      difficulty: exercise.difficulty || 0,
      duration: exercise.duration || 0,
      tags: exercise.tags || [],
      note: exercise.note || '',
    }

    return testDb
      .query(`
        INSERT INTO exercises
        (createdAt, updatedAt, createdBy, task, subjects, hints, approach, solutions, type, credits, difficulty, duration, tags, note)
        VALUES ($createdAt, $updatedAt, $createdBy, $task, $subjects, $hints, $approach, $solutions, $type, $credits, $difficulty, $duration, $tags, $note)
      `)
      .run({
        createdAt: normalized.createdAt as string,
        updatedAt: normalized.updatedAt as string,
        createdBy: normalized.createdBy as string,
        task: normalized.task as string,
        subjects: JSON.stringify(normalized.subjects || []),
        hints: JSON.stringify(normalized.hints || []),
        approach: normalized.approach as string,
        solutions: JSON.stringify(normalized.solutions || []),
        type: normalized.type as string,
        credits: normalized.credits as number,
        difficulty: normalized.difficulty as number,
        duration: normalized.duration as number,
        tags: JSON.stringify(normalized.tags || []),
        note: normalized.note as string,
      })
  },

  getById(id: string) {
    return testDb.query("SELECT * FROM exercises WHERE id == :id").get({ id })
  },

  getAll() {
    return testDb.query("SELECT * FROM exercises ORDER BY id ASC").all()
  },

  getByUser(username: string) {
    return testDb
      .query("SELECT * FROM exercises WHERE createdBy == :createdBy ORDER BY id ASC")
      .all({ createdBy: username })
  },

  getHistoryById(id: string) {
    return testDb
      .query("SELECT * FROM exercise_history WHERE exerciseId == :id ORDER BY updatedAt DESC")
      .all({ id })
  },

  deleteExercise(id: string) {
    testDb.query("DELETE FROM exercises WHERE id == :id").run({ id })
  },

  update(exerciseFromForm: Exercise, user: User) {
    const now = new Date().toISOString()
    const oldVersion = testDb
      .query("SELECT * FROM exercises WHERE id == :id")
      .get({ id: exerciseFromForm.id }) as Exercise

    if (oldVersion) {
      testDb.query(`
        INSERT INTO exercise_history
        (exerciseId, task, approach, solutions, subjects, type, credits, difficulty, duration, tags, note, hints, createdAt, updatedAt, createdBy)
        VALUES ($exerciseId, $task, $approach, $solutions, $subjects, $type, $credits, $difficulty, $duration, $tags, $note, $hints, $createdAt, $updatedAt, $createdBy)
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

    return testDb
      .query(`
        UPDATE exercises
        SET updatedAt = $updatedAt, createdBy = $createdBy, task = $task, subjects = $subjects, hints = $hints, approach = $approach, solutions = $solutions, type = $type, credits = $credits, difficulty = $difficulty, duration = $duration, tags = $tags, note = $note
        WHERE id == $id
      `)
      .run({
        updatedAt: now,
        createdBy: user.username,
        task: exerciseFromForm.task || '',
        subjects: JSON.stringify(exerciseFromForm.subjects || []),
        hints: JSON.stringify(exerciseFromForm.hints || []),
        approach: exerciseFromForm.approach || '',
        solutions: JSON.stringify(exerciseFromForm.solutions || []),
        type: exerciseFromForm.type || 'problem',
        credits: exerciseFromForm.credits || 0,
        difficulty: exerciseFromForm.difficulty || 0,
        duration: exerciseFromForm.duration || 0,
        tags: JSON.stringify(exerciseFromForm.tags || []),
        note: exerciseFromForm.note || '',
        id: exerciseFromForm.id,
      })
  },
}

// Setup and teardown
beforeAll(() => {
  // Drop tables if they exist to ensure clean state
  testDb.exec(`DROP TABLE IF EXISTS exercise_history`)
  testDb.exec(`DROP TABLE IF EXISTS exercises`)

  testDb.exec(`
    CREATE TABLE exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      approach TEXT,
      solutions TEXT,
      subjects TEXT NOT NULL,
      type TEXT NOT NULL,
      credits INTEGER NOT NULL DEFAULT 0,
      difficulty REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      tags TEXT,
      note TEXT,
      hints TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      createdBy TEXT
    )
  `)

  testDb.exec(`
    CREATE TABLE exercise_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exerciseId INTEGER NOT NULL,
      task TEXT NOT NULL,
      approach TEXT,
      solutions TEXT,
      subjects TEXT NOT NULL,
      type TEXT NOT NULL,
      credits INTEGER NOT NULL DEFAULT 0,
      difficulty REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      tags TEXT,
      note TEXT,
      hints TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      FOREIGN KEY (exerciseId) REFERENCES exercises(id) ON DELETE CASCADE
    )
  `)
})

afterAll(() => {
  testDb.close()
  // Clean up test database file
  import("fs").then((fs) => {
    try {
      fs.unlinkSync("test-exercises.sqlite")
    } catch {
      // Ignore cleanup errors
    }
  }).catch(() => {
    // Ignore import errors
  })
})

describe("Exercise API", () => {
  const testUser: User = {
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword123",
  }

  test("add - creates a new exercise", () => {
    const exercise: Exercise = {
      id: "",
      slug: "", // Will be auto-generated
      task: "Solve this problem",
      approach: "Use this method",
      solutions: ["Solution 1", "Solution 2"],
      subjects: ["Math", "Science"],
      type: "problem",
      hints: ["Hint 1"],
      tags: ["easy"],
      credits: "10",
      difficulty: "0.5",
      duration: "30",
      note: "Test note",
    }

    const result = exercisesModule.add(exercise, testUser)
    expect(result.changes).toBe(1)
    expect(result.lastInsertRowid).toBeGreaterThan(0)
  })

  test("getById - retrieves an exercise by id", () => {
    const exercise: Exercise = {
      id: "",
      slug: "", // Will be auto-generated
      task: "Test task",
      subjects: ["Math"],
      type: "quiz",
      solutions: [],
      hints: [],
      tags: [],
      approach: "",
    }

    const addResult = exercisesModule.add(exercise, testUser)
    const exerciseId = String(addResult.lastInsertRowid)

    const retrieved = exercisesModule.getById(exerciseId)
    expect(retrieved).toBeDefined()
    expect((retrieved as Exercise).task).toBe("Test task")
    expect((retrieved as Exercise).createdBy).toBe(testUser.username)
  })

  test("getAll - returns all exercises", () => {
    exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "Task 1",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "Task 2",
        subjects: ["Science"],
        type: "quiz",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    const allExercises = exercisesModule.getAll() as Exercise[]
    expect(allExercises.length).toBeGreaterThanOrEqual(2)
  })

  test("getByUser - returns exercises by specific user", () => {
    const user2: User = {
      username: "otheruser",
      email: "other@example.com",
      password: "password",
    }

    exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "User 1 task",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "User 2 task",
        subjects: ["Science"],
        type: "quiz",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      user2
    )

    const userExercises = exercisesModule.getByUser(testUser.username) as Exercise[]
    expect(userExercises.length).toBeGreaterThanOrEqual(1)
    const found = userExercises.find(e => e.task === "User 1 task")
    expect(found).toBeDefined()
  })

  test("deleteExercise - removes an exercise", () => {
    const addResult = exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "To be deleted",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    const exerciseId = String(addResult.lastInsertRowid)
    exercisesModule.deleteExercise(exerciseId)

    const retrieved = exercisesModule.getById(exerciseId)
    expect(retrieved).toBeNull()
  })

  test("update - saves old version to history", () => {
    // Create initial exercise
    const addResult = exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "Original task",
        approach: "Original approach",
        subjects: ["Math"],
        type: "problem",
        solutions: ["Original solution"],
        hints: ["Original hint"],
        tags: ["original"],
        credits: "5",
        difficulty: "0.3",
        duration: "15",
      },
      testUser
    )

    const exerciseId = String(addResult.lastInsertRowid)

    // Update the exercise
    const originalExercise = exercisesModule.getById(exerciseId) as Exercise
    exercisesModule.update(
      {
        id: exerciseId,
        slug: originalExercise.slug,
        task: "Updated task",
        approach: "Updated approach",
        subjects: ["Science"],
        type: "quiz",
        solutions: ["Updated solution"],
        hints: ["Updated hint"],
        tags: ["updated"],
        credits: "10",
        difficulty: "0.7",
        duration: "30",
      },
      testUser
    )

    // Check that current version is updated
    const current = exercisesModule.getById(exerciseId) as Exercise
    expect(current.task).toBe("Updated task")
    expect(current.approach).toBe("Updated approach")

    // Check that history was saved
    const history = exercisesModule.getHistoryById(exerciseId) as Exercise[]
    expect(history.length).toBe(1)
    expect(history[0].task).toBe("Original task")
    expect(history[0].approach).toBe("Original approach")
  })

  test("update - creates multiple history entries", async () => {
    const addResult = exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "Version 1",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    const exerciseId = String(addResult.lastInsertRowid)
    const exercise = exercisesModule.getById(exerciseId) as Exercise

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10))

    // First update
    exercisesModule.update(
      {
        id: exerciseId,
        slug: exercise.slug,
        task: "Version 2",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    await new Promise(resolve => setTimeout(resolve, 10))

    // Second update
    exercisesModule.update(
      {
        id: exerciseId,
        slug: exercise.slug,
        task: "Version 3",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    // Check history has 2 entries (version 1 and version 2)
    const history = exercisesModule.getHistoryById(exerciseId) as Exercise[]
    expect(history.length).toBe(2)
    expect(history[0].task).toBe("Version 2") // Most recent in history (DESC order)
    expect(history[1].task).toBe("Version 1") // Oldest in history
  })

  test("getHistoryById - returns empty array for exercise with no history", () => {
    const addResult = exercisesModule.add(
      {
        id: "",
        slug: "", // Will be auto-generated
        task: "New exercise",
        subjects: ["Math"],
        type: "problem",
        solutions: [],
        hints: [],
        tags: [],
        approach: "",
      },
      testUser
    )

    const exerciseId = String(addResult.lastInsertRowid)
    const history = exercisesModule.getHistoryById(exerciseId)
    expect(history).toEqual([])
  })

  test("getHistoryById - returns empty array for non-existent exercise", () => {
    const history = exercisesModule.getHistoryById("99999")
    expect(history).toEqual([])
  })
})
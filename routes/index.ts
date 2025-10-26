import type { Request, Response } from "express"
import type { Config, Exercise } from "../api/types"

export default function (config: Config) {
  return (request: Request, response: Response) => {
    const ids = config.featuredExercises

    const placeholders = ids.map(() => "?").join(",")
    const query = `SELECT * FROM exercises WHERE id IN (${placeholders})`
    const exercises = config.database.query(query).all() as Exercise[]

    // Order the exercises by the order of the ids
    const exercisesSorted = ids.map((id: string) =>
      exercises.find((exercise: Exercise) => exercise.id === id),
    )

    response.render("index", {
      page: "home",
      featureMap: config.featureMap,
      featuredExercises: exercisesSorted.map((e) => e ? ({
        id: e.id,
        task: e.task,
        subjects: typeof e.subjects === 'string' ? JSON.parse(e.subjects) : e.subjects,
        type: e.type,
        difficulty: e.difficulty,
        duration: e.duration,
      }) : null).filter(Boolean),
    })
  }
}

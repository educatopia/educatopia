import type { Database } from "bun:sqlite"

export type Config = {
  devMode: boolean
  port: number
  database: Database
  knowledgeBasePath: string
  featureMap: Record<string, boolean>
  featuredExercises: string[]
}

export type Lesson = {
  id: string
  title: string
  thumbnailUrl: string
  content: string
}

export type CourseYaml = {
  lessons: string[]
}

export type Course = {
  lessons: Lesson[]
}

export type Exercise = {
  id: string
  subjects: string
  hints: string
  solutions: string | string[]
  tags: string
  task: string
  approach: string
  url?: string
}

export type User = {
  username: string
  name: string
  email: string
  password: string
}

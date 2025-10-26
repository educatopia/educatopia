import type { Database } from "bun:sqlite"
import type { Request as ExpressRequest, Response as ExpressResponse } from "express"

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
  slug: string
  subjects: string | string[]
  hints: string | string[]
  solutions: string | string[]
  tags: string | string[]
  task: string
  approach: string
  type?: string
  difficulty?: string
  duration?: string
  credits?: string
  note?: string
  createdAt?: string | Date
  updatedAt?: string | Date
  createdBy?: string
  url?: string
  flags?: string | string[]
  language?: string
}

export type User = {
  username: string
  name?: string
  email: string
  password: string
  confirmationCode?: string
}

export type ExerciseDbParams = {
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  task: string
  subjects: string
  hints: string
  approach: string
  solutions: string
  type?: string
  credits?: string
  difficulty?: string
  duration?: string
  tags: string
  note?: string
  id?: string
  slug: string
}

export type AppRequest = ExpressRequest & {
  app: {
    get: (_key: string) => string
  }
  hostname: string
}

export type RouteRequest = ExpressRequest & {
  body: Record<string, unknown>
  params: Record<string, string>
  query: Record<string, unknown>
  session?: {
    user?: User
  }
}

export type Fieldsets = Record<string, unknown>[]

export type RouteResponse = ExpressResponse

export type LessonDescription = {
  id?: string
  title?: string
  [_key: string]: unknown
}

export type MailCallback = (_error: Error | null, _response?: unknown) => void

export type AuthCallback = (_error: Error | null, _user?: User) => void

export type UserData = {
  username: string
  name?: string
  email: string
  confirmationCode: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export type UserWithConfirmation = User & {
  confirmationCode?: string
}

export type MailResponse = {
  messageId?: string
  message?: string
}

export type ApiModules = {
  exercises: {
    getById: (_id: string) => unknown
    getBySlug: (_slug: string) => unknown
    getByIdRendered: (_id: string) => Promise<Exercise | null>
    getBySlugRendered: (_slug: string) => Promise<Exercise | null>
    getHistoryById: (_id: string) => Exercise[]
    getAll: () => Exercise[]
    add: (_exercise: Exercise, _user: User) => unknown
    update: (_exercise: Exercise, _user: User) => unknown
    deleteExercise: (_id: string) => void
  }
  users: {
    signup: (_db: Database, _request: AppRequest, _done: MailCallback) => void
    confirm: (_db: Database, _confirmationCode: string, _done: AuthCallback) => void
    login: (_db: Database, _username: string, _password: string, _done: AuthCallback) => void
  }
}

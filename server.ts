import path from "node:path"
import assert from "node:assert"

import express from "express"
import compress from "compression"
import morgan from "morgan"
import errorHandler from "errorhandler"
import session from "express-session"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import { Database } from "bun:sqlite"

import index from "./routes/index"
import login from "./routes/login"
import logout from "./routes/logout"
import signup from "./routes/signup"
import * as exercises from "./routes/exercises"
import lessons from "./routes/lessons"
import courses from "./routes/courses"
import users from "./routes/users"

const app = express()
const database = new Database("educatopia.sqlite", { strict: true })

const devMode = app.get("env") === "development"
const conf = {
  devMode,
  port: 3000,
  database,
  knowledgeBasePath: path.resolve("node_modules/knowledge_base"),
  featureMap: {
    courses: false,
    lessons: false,
    exercises: true,
  },
  featuredExercises: (process.env.EDUCATOPIA_FEATURED_EXERCISES || "")
    .split(",")
    .filter(Boolean),
}
const { port, knowledgeBasePath } = conf

if (!devMode) {
  assert(process.env.SESSION_SECRET, "Missing session secret")
  app.set("hostname", "educatopia.org")
}

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(
  favicon(`${__dirname}/public/img/favicon.png`, {
    maxAge: devMode ? 1000 : "1d",
  }),
)

app.use(compress())
app.use(express.static(path.join(__dirname, "public")))
app.use("/modules", express.static(path.join(__dirname, "node_modules")))

app.use(devMode ? morgan("dev") : morgan())

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    saveUninitialized: true,
    resave: true,
  }),
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((request, response, next) => {
  response.locals.session = request.session
  next()
})

app.get("/", index(conf))

app.route("/login").get(login(conf)).post(login(conf))

app.get("/logout", logout)

app.route("/signup").get(signup(conf)).post(signup(conf))

app.get("/tracks", courses(conf).all)

if (conf.featureMap.courses) {
  app.get("/courses", courses.all)
  app.get("/courses/:slug", courses.getById)
  app.use("/courses", express.static(path.join(knowledgeBasePath, "courses")))
}

if (conf.featureMap.lessons) {
  app.get("/lessons", lessons(conf).all)
  app.get("/lessons/:slug", lessons.getById)
  app.use("/lessons", express.static(path.join(knowledgeBasePath, "lessons")))
}

app.get("/exercises", exercises.all)

app.route("/exercises/create").get(exercises.create).post(exercises.create)

app.route("/exercises/:id").get(exercises.one).post(exercises.update)

app.get("/e/:id", exercises.shortcut)

app.route("/exercises/:id/edit").get(exercises.edit).post(exercises.edit)

app.get("/exercises/:id/history", exercises.history)

app.get("/confirm/:confirmationCode", users(conf).confirm)

app.get("/:username", users(conf).profile)

// Render 404 page if nothing else matched
app.use((request, response) => {
  response.status(404)
  response.render("error", {
    status: 404,
    featureMap: conf.featureMap,
  })
})

// Log errors
app.use((localError, request, response, next) => {
  console.error(localError)
  next(localError)
})

// Catch all errors
if (devMode) {
  app.use(errorHandler())
} else {
  // eslint-disable-next-line no-unused-vars
  app.use((localError, request, response, next) => {
    response.render("error", {
      status: 500,
      featureMap: conf.featureMap,
    })
  })
}

app.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`)
})

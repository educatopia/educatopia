import path from "node:path"
import assert from "node:assert"

import express from "express"
import compress from "compression"
import morgan from "morgan"
import errorHandler from "errorhandler"
import session from "express-session"
import helmet from "helmet"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import { Database } from "bun:sqlite"

import { migrate } from "./migrate"
import {
  buildSessionOptions,
  csrfProtection,
  createRateLimiter,
} from "./api/security"
import { createSqliteSessionStore } from "./api/session-store"
import index from "./routes/index"
import login from "./routes/login"
import logout from "./routes/logout"
import signup from "./routes/signup"
import exercises from "./routes/exercises"
import lessons from "./routes/lessons"
import courses from "./routes/courses"
import users from "./routes/users"

const app = express()
const database = new Database("educatopia.sqlite", { strict: true })

// Bring the schema up to date before serving any requests.
migrate(database)

const devMode = app.get("env") === "development"
const conf = {
  devMode,
  port: 3470,
  database,
  sessionSecret: process.env.SESSION_SECRET || "dev",
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

// Secure response headers. The Content-Security-Policy is disabled because the
// views rely on inline scripts and assets served from /modules; XSS is instead
// mitigated by sanitizing all rendered user content (see api/markdown.ts).
app.use(helmet({ contentSecurityPolicy: false }))

app.use(compress())
app.use(express.static(path.join(__dirname, "public")))
app.use("/modules", express.static(path.join(__dirname, "node_modules")))

app.use(devMode ? morgan("dev") : morgan())

// Secure cookies require the proxy-forwarded protocol to be trusted.
app.set("trust proxy", 1)

app.use(
  session(
    buildSessionOptions({
      secret: conf.sessionSecret,
      devMode,
      store: createSqliteSessionStore(session, database),
    }),
  ),
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CSRF protection (synchronizer token) for all state-changing requests. Must
// run after the session and body parsers so the token and form body are
// available.
app.use(csrfProtection)

app.use((request, response, next) => {
  response.locals.session = request.session
  next()
})

// Throttle authentication endpoints to slow brute-force and limit the cost of
// the (deliberately slow) bcrypt hashing they trigger.
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: devMode ? 1000 : 20,
})

app.get("/", index(conf))

app.route("/login").get(login(conf)).post(authRateLimiter.middleware, login(conf))

app.post("/logout", logout())

app.route("/signup").get(signup(conf)).post(authRateLimiter.middleware, signup(conf))

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

const exercisesRoutes = exercises(conf)

app.get("/exercises", exercisesRoutes.all)

app.route("/exercises/create").get(exercisesRoutes.create).post(exercisesRoutes.create)

app.route("/exercises/:id").get(exercisesRoutes.one).post(exercisesRoutes.update)

app.get("/e/:id", exercisesRoutes.shortcut)

app.route("/exercises/:id/edit").get(exercisesRoutes.edit).post(exercisesRoutes.edit)

app.get("/exercises/:id/history", exercisesRoutes.history)

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
  app.use((localError, request, response) => {
    response.render("error", {
      status: 500,
      featureMap: conf.featureMap,
    })
  })
}

app.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`)
})

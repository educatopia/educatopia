const path = require('path')
const assert = require('assert')

const express = require('express')
const compress = require('compression')
const morgan = require('morgan')
const errorHandler = require('errorhandler')
const session = require('express-session')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')

const app = express()

const devMode = app.get('env') === 'development'
const config = {
  devMode,
  port: 3000,
  db: {
    host: process.env.MONGODB_HOST || 'localhost',
    port: 27017,
    name: devMode
      ? 'educatopia-dev'
      : 'educatopia',
  },
  knowledgeBasePath: path.resolve('node_modules/knowledge_base'),
  featureMap: {
    courses: false,
    lessons: false,
    exercises: true,
  },
  featuredExercises: (process.env.EDUCATOPIA_FEATURED_EXERCISES || '')
    .split(',')
    .filter(Boolean),
}
const {port, db, knowledgeBasePath} = config
const connectionString = `mongodb://${db.host}:${db.port}/${db.name}`


function connectToDatabase () {
  MongoClient.connect(connectionString, addRoutes)
}


function addRoutes (error, client) {
  if (error) {
    console.error(error)
    // MongoDB server might not be running yet, therefore try again
    setTimeout(connectToDatabase, 1000)
    return
  }

  const database = client.db(config.db.name)

  if (!database) {
    console.error(`Could not connect to database "${db.name}"`)
    return
  }

  console.info(`Connected to database "${database.databaseName}"`)

  config.database = database

  const index = require('./routes/index')(config)
  const login = require('./routes/login')(config)
  const logout = require('./routes/logout')(config)
  const signup = require('./routes/signup')(config)
  const exercises = require('./routes/exercises')(config)
  const lessons = require('./routes/lessons')(config)
  const courses = require('./routes/courses')(config)
  const users = require('./routes/users')(config)


  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use(favicon(__dirname + '/public/img/favicon.png', {
    maxAge: devMode ? 1000 : '1d',
  }))

  app.use(compress())
  app.use(express.static(path.join(__dirname, 'public')))
  app.use('/modules', express.static(path.join(__dirname, 'node_modules')))

  app.use(devMode ? morgan('dev') : morgan())

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev',
    saveUninitialized: true,
    resave: true,
  }))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))

  app.use((request, response, next) => {
    response.locals.session = request.session
    next()
  })


  app.get('/', index)

  app
    .route('/login')
    .get(login)
    .post(login)

  app.get('/logout', logout)

  app
    .route('/signup')
    .get(signup)
    .post(signup)


  app.get('/tracks', courses.all)


  if (config.featureMap.courses) {
    app.get('/courses', courses.all)
    app.get('/courses/:slug', courses.getById)
    app.use(
      '/courses',
      express.static(path.join(knowledgeBasePath, 'courses'))
    )
  }


  if (config.featureMap.lessons) {
    app.get('/lessons', lessons.all)
    app.get('/lessons/:slug', lessons.getById)
    app.use(
      '/lessons',
      express.static(path.join(knowledgeBasePath, 'lessons'))
    )
  }

  app.get('/exercises', exercises.all)

  app
    .route('/exercises/create')
    .get(exercises.create)
    .post(exercises.create)

  app
    .route('/exercises/:id')
    .get(exercises.one)
    .post(exercises.update)

  app.get('/e/:id', exercises.shortcut)

  app
    .route('/exercises/:id/edit')
    .get(exercises.edit)
    .post(exercises.edit)

  app.get('/exercises/:id/history', exercises.history)


  app.get('/confirm/:confirmationCode', users.confirm)

  app.get('/:username', users.profile)

  // Render 404 page if nothing else matched
  app.use((request, response) => {
    response.status(404)
    response.render('error', {
      status: 404,
      featureMap: config.featureMap,
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
  }
  else {
    // eslint-disable-next-line no-unused-vars
    app.use((localError, request, response, next) => {
      response.render('error', {
        status: 500,
        featureMap: config.featureMap,
      })
    })
  }

  app.listen(port, () => {
    console.info(`Listening on http://localhost:${port}`)
  })
}


app.set('hostname', 'localhost:' + port)

if (!devMode) {
  assert(process.env.SESSION_SECRET, 'Missing session secret')
  app.set('hostname', 'educatopia.org')
}

connectToDatabase()

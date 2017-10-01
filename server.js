const path = require('path')
const assert = require('assert')

const express = require('express')
const compress = require('compression')
const morgan = require('morgan')
const errorHandler = require('errorhandler')
const session = require('express-session')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const app = express()

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000
const ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
const db = {
  username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
  ip: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
  port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
  name: app.get('env') === 'development' ? 'educatopiadev' : 'educatopia',
}
let connectionString = `${db.ip}:${db.port}/${db.name}`
const devMode = app.get('env') === 'development'
const knowledgeBasePath = path.resolve('node_modules/knowledge_base')


function addRoutes (error, database) {
  if (error || !database) {
    console.error('Could not connect to database "' + db.name + '"')
    return
  }

  console.info('Connected to database "' + database.databaseName + '"')

  const config = {
    database: database,
  }
  const index = require('./routes/index')
  const login = require('./routes/login')(config)
  const logout = require('./routes/logout')
  const signup = require('./routes/signup')(config)
  const exercises = require('./routes/exercises')(config)
  const lessons = require('./routes/lessons')
  const courses = require('./routes/courses') // (config)
  const users = require('./routes/users')(config)


  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')

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


  app.get('/courses', courses.all)
  app.get('/courses/:slug', courses.getById)
  app.use(
    '/courses',
    express.static(path.join(knowledgeBasePath, 'courses'))
  )


  app.get('/lessons', lessons.all)
  app.get('/lessons/:slug', lessons.getById)
  app.use(
    '/lessons',
    express.static(path.join(knowledgeBasePath, 'lessons'))
  )

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


  if (app.get('env') === 'development') {
    app.use(errorHandler())
  }

  app.use((request, response) => {
    response.render('404')
  })

  app.listen(port, ip)
  console.info('Listening on ' + ip + ':' + port)
}


app.set('hostname', 'localhost:' + port)

if (app.get('env') === 'production') {
  assert(process.env.SESSION_SECRET, 'Missing session secret')
  app.set('hostname', process.env.OPENSHIFT_APP_DNS || 'educatopia.org')
}

if (db.password) {
  connectionString =
    `${db.username}:${db.password}@${db.ip}:${db.port}/${db.name}`
}

MongoClient.connect('mongodb://' + connectionString, addRoutes)

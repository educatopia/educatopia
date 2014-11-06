var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,

    app = express(),

    port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
    ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    db = {
	    username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
	    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
	    ip: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
	    port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
	    name: app.get('env') === 'development' ? 'educatopiadev' : 'educatopia'
    },
    connectionString = db.ip + ':' + db.port + '/' + db.name,
    devMode = (app.get('env') === 'development')


function addRoutes (error, database) {

	if (error || !database) {
		console.error('Could not connect to database "' + db.name + '"')
		return
	}

	console.log('Connected to database "' + database.databaseName + '"')

	var config = {
		    database: database
	    },
	    api = require('./routes/api'),
	    index = require('./routes/index'),
	    login = require('./routes/login')(config),
	    logout = require('./routes/logout'),
	    signup = require('./routes/signup')(config),
	    exercises = require('./routes/exercises')(config),
	    users = require('./routes/users')(config),
	    reference = require('./routes/reference')


	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'jade')

	app.use(favicon(__dirname + '/public/img/favicon.png'), {
		maxAge: devMode ? 1000 : '1d'
	})

	app.use(compress())
	app.use(express.static(path.join(__dirname, 'public')))

	app.use(devMode ? morgan('dev') : morgan())

	app.use(bodyParser())
	app.use(session({
		secret: process.env.SESSION_SECRET || 'dev',
		saveUninitialized: true,
		resave: true
	}))

	app.use(function (request, response, next) {
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


	if (app.get('env') === 'development')
		app.use(errorHandler())

	app.use(function (req, res) {
		res.render('404')
	})

	app.listen(port, ip)
	console.log('Listening on ' + ip + ':' + port)
}


app.set('hostname', 'localhost:' + port)

if (app.get('env') === 'production') {
	console.assert(process.env.SESSION_SECRET, 'Missing session secret')
	app.set('hostname', process.env.OPENSHIFT_APP_DNS || 'educatopia.org')
}

if (db.password)
	connectionString = db.username + ':' + db.password + '@' +
	                   db.ip + ':' + db.port + '/' + db.name

MongoClient.connect('mongodb://' + connectionString, addRoutes)

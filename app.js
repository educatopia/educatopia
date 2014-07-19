var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    mongo = require('mongodb'),

    app = express(),

    dbName = (app.get('env') === 'development') ? 'educatopiadev' : 'educatopia',
    dbServer = new mongo.Server('127.0.0.1', 27017, {auto_reconnect: true})

new mongo
	.Db(dbName, dbServer, {w: 1})
	.open(addRoutes)


function addRoutes (error, database) {

	if (error)
		console.error('Could not connect to database "' +
		            database.databaseName + '"')

	console.log('Connected to database "' +
	            database.databaseName + '"')

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
	    reference = require('./routes/reference'),

	    port = process.env.PORT || 3000


	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'jade')


	app.use(favicon(__dirname + '/public/img/favicon.png'))

	app.use(compress())
	app.use(express.static(path.join(__dirname, 'public')))

	app.use(app.get('env') === 'development' ? morgan('dev') : morgan())

	app.use(bodyParser())
	app.use(cookieParser('mustached wookie'))
	app.use(session({
		secret: 'potential octo batman',
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

	app.listen(port)
	console.log('Listening on port ' + port)
}

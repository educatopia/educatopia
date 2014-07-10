var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),

    app = express(),

    api = require('./routes/api'),
    index = require('./routes/index'),
    login = require('./routes/login'),
    signup = require('./routes/signup'),
    exercises = require('./routes/exercises'),
    users = require('./routes/users'),
    reference = require('./routes/reference'),

    port = process.env.PORT || 3000,
    env = 'development' //process.env.NODE_ENV || 'development'


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.set('loggedIn', false)

if (env === 'development')
	app.use(errorHandler())

app.use(compress())
app.use(express.static(path.join(__dirname, 'public')))

app.use(env === 'development' ? morgan('dev') : morgan())

app.use(bodyParser())
app.use(session({secret: 'potential octo batman'}))

app.use(function (req, res, next) {

	if (req.cookies) {
		res.locals.user = req.cookies.user
		res.locals.authenticated = (req.cookies.user && req.cookies.pass)
	}
	else
		res.locals.authenticated = false

	next()
})

/* API

app
	.route('/api/exercises')
	.get(api.exercises.getAll)
	.post(api.exercises.add)

app.get('/api/exercises/:id', api.exercises.getById)
app.put('/api/exercises/', api.exercises.update)
app.delete('/api/exercises/:id', api.exercises.delete)
app.get('/api/exercises/:id/history', api.exercises.getHistoryById)
*/


app.get('/', index)

app.get('/login', login)

app.route('/signup')
	.get(signup)
	.post(signup)


app.get('/confirm/:confirmationCode', users.confirm)

app.get('/exercises', exercises.all)

app.route('/exercises/:id')
	.get(exercises.one)
	.post(exercises.update)

app.route('/exercises/create')
	.get(exercises.create)
	.post(exercises.create)

app.post('/exercises/submit', exercises.submit)


app.route('/exercises/:id/edit')
	.get(exercises.edit)
	.post(exercises.edit)

app.get('/exercises/:id/history', exercises.history)

app.get('/reference', reference)


app.listen(port)
console.log('Listening on port ' + port)

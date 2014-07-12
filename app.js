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
    logout = require('./routes/logout'),
    signup = require('./routes/signup'),
    exercises = require('./routes/exercises'),
    users = require('./routes/users'),
    reference = require('./routes/reference'),

    port = process.env.PORT || 3000,
    env = 'development' //process.env.NODE_ENV || 'development'


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(compress())
app.use(express.static(path.join(__dirname, 'public')))

app.use(env === 'development' ? morgan('dev') : morgan())

app.use(bodyParser())
app.use(cookieParser('mustached wookie'))
app.use(session({secret: 'potential octo batman'}))

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

app.post('/exercises/submit', exercises.submit)

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


if (env === 'development')
	app.use(errorHandler())

app.use(function(req, res){
	res.render('404')
})

app.listen(port)
console.log('Listening on port ' + port)

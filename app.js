var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    logger = require('morgan'),
    app = express(),

    api = require('./routes/api'),
    index = require('./routes/index'),
    login = require('./routes/login'),
    signup = require('./routes/signup'),
    exercises = require('./routes/exercises'),
    reference = require('./routes/reference'),

    port = process.env.PORT || 3000,
    env = 'development' //process.env.NODE_ENV || 'development'


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger())

if (env === 'development') {
	logger('dev')
}

app.use(compress())
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))


app.get('/api/exercises', api.exercises.getAll)
app.post('/api/exercises', api.exercises.add)

app.get('/api/exercises/:id', api.exercises.getById)
app.put('/api/exercises/', api.exercises.update)
app.delete('/api/exercises/:id', api.exercises.delete)

app.get('/api/exercises/history/:id', api.exercises.getHistoryById)

app.get('/', index)
app.get('/login', login)

app.get('/signup', signup)
app.post('/signup', api.accounting.signup)

app.get('/exercises', exercises.all)
app.get('/exercises/:id', exercises.one)

app.get('/reference', reference)


app.listen(port)
console.log('Listening on port ' + port)

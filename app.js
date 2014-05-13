var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    logger = require('morgan'),
    app = express(),

    api = require('./routes/api'),
    index = require('./routes/index'),

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

//app.post('/api/register', api.accounting.register)

app.get('/api/exercises', api.exercises.getAll)
app.post('/api/exercises', api.exercises.add)

app.get('/api/exercises/:id', api.exercises.getById)
app.put('/api/exercises/', api.exercises.update)
app.delete('/api/exercises/:id', api.exercises.delete)

app.get('/api/exercises/history/:id', api.exercises.getHistoryById)

app.get('/', index)


app.listen(port)
console.log('Listening on port ' + port)

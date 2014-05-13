var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    app = express(),

    api = require('./modules/api'),

    port = process.env.PORT || 3000,
    env = 'development' //process.env.NODE_ENV || 'development'


app.use(morgan())

if (env === 'development') {
	morgan('dev')
}

app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))

//app.post('/api/register', api.accounting.register)

app.get('/api/exercises', api.exercises.getAll)
app.post('/api/exercises', api.exercises.add)

app.get('/api/exercises/:id', api.exercises.getById)
app.put('/api/exercises/', api.exercises.update)
app.delete('/api/exercises/:id', api.exercises.delete)

app.get('/api/exercises/history/:id', api.exercises.getHistoryById)

app.listen(port)
console.log('Listening on port ' + port)

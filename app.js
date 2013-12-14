// External libraries
var express = require('express'),
	path = require('path'),
	app = express(),

// Internal modules
	exercises = require('./modules/exercises'),
	accounting = require('./modules/accounting')


app.configure(function () {
	app.use(express.logger('dev'))  //'default', 'short', 'tiny', 'dev'
	app.use(express.bodyParser())
	app.use(express.static(path.join(__dirname, 'public')))
})

app.post('/api/register', accounting.register)

app.get('/api/exercises', exercises.getAll)
app.post('/api/exercises', exercises.add)

app.get('/api/exercises/:id', exercises.getById)
app.put('/api/exercises/', exercises.update)
app.delete('/api/exercises/:id', exercises.delete)

app.get('/api/exercises/history/:id', exercises.getHistoryById)

app.listen(3000)
console.log('Listening on port 3000...')

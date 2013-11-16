var express    = require('express');
var path       = require('path');
var exercises  = require('./modules/exercises');
var accounting = require('./modules/accounting');

var app = express()

app.configure(function() {
	app.use(express.logger('dev'))  //'default', 'short', 'tiny', 'dev'
	app.use(express.bodyParser())
	app.use(express.static(path.join(__dirname, 'public')))
})

app.get('/api/exercises', exercises.getAll)
app.get('/api/exercises/:id', exercises.getById)
app.get('/api/exercises/history/:id', exercises.getHistoryById)
app.post('/api/exercises', exercises.add)
app.put('/api/exercises', exercises.update)
app.delete('/api/exercises/:id', exercises.delete)

app.listen(3000)
console.log('Listening on port 3000...')

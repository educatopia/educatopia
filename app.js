var express = require('express'),
	path = require('path'),
	exercises = require('./routes/exercises')

var app = express()

app.configure(function() {
	app.use(express.logger('dev'))  //'default', 'short', 'tiny', 'dev'
	app.use(express.bodyParser())
	app.use(express.static(path.join(__dirname, 'public')))
})

app.get('/api/exercises', exercises.findAll)
app.get('/api/exercises/:id', exercises.findById)
app.post('/api/exercises', exercises.add)
app.put('/api/exercises', exercises.update)
app.delete('/api/exercises/:id', exercises.delete)

app.listen(3000)
console.log('Listening on port 3000...')
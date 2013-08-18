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

app.get('/api/exercises', exercises.findAll)
app.get('/api/exercises/:id', exercises.findById)

// These three requests require authentication
app.post('/api/exercises', function(req, res) {
    if (accounting.isAuthorized(req,res)) {
        exercises.add(req,res);
    } else {
        // somehow deny access - should be coordinated with UI development
    }
});

app.put('/api/exercises/:id', function(req,res) {
    if (accounting.isAuthorized(req,res)) {
        exercises.update(req,res);
    } else {
        // somehow deny access - should be coordinated with UI development
    }
});

app.delete('/api/exercises/:id', function(req,res) {
    if (accounting.isAuthorized(req,res)) {
        exercises.delete(req,res);
    } else {
        // somehow deny access - should be coordinated with UI development
    }
});

app.listen(3000)
console.log('Listening on port 3000...')

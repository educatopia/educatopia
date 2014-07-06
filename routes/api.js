var exercises = require('../api/exercises'),
    users = require('../api/users'),
    api = {}

api.exercises = {
	getById: exercises.getById,
	getHistoryById: exercises.getHistoryById,
	getAll: exercises.getAll,
	add: exercises.add,
	update: exercises.update,
	delete: exercises.delete
}

api.users = {
	signup: users.signup
}

module.exports = api

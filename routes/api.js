var exercises = require('../api/exercises'),
    accounting = require('../api/accounting'),
    api = {}

api.exercises = {
	getById: exercises.getById,
	getHistoryById: exercises.getHistoryById,
	getAll: exercises.getAll,
	add: exercises.add,
	update: exercises.update,
	delete: exercises.delete
}

api.accounting = {
	register: accounting.register
}

module.exports = api

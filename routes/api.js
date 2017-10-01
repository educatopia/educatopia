'use strict'

var api = {},
    exercises = {},
    users = {}


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


module.exports = function (config) {

  exercises = require('../api/exercises')(config)
  users = require('../api/users')(config)

  return api
}

'use strict'

var fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  langs = require('langs'),

  coursesApi = require('../api/courses.js'),
  courses = {}


courses.all = function (request, response, next) {

  coursesApi
    .getAll()
    .then(function (courses) {
      response.render(
        'courses',
        {
          title: 'Courses',
          page: 'courses',
          courses: courses || []
        }
      )
    })
    .catch(function (error) {
      next(error)
    })
}

courses.getById = function (request, response) {

  var slug = request.params.slug

  coursesApi
    .getById(slug)
    .then(function (descriptionObject) {

      descriptionObject.page = 'course'
      descriptionObject.thumbnailUrl = '/courses/' +
        slug + '/images/thumbnail.png'

      response.render(
        'course',
        descriptionObject
      )
    })
    .catch(function (error) {
      throw error
    })
}

module.exports = courses

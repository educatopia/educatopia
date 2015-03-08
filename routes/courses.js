'use strict'

var fs = require('fs'),
	path = require('path'),
	yaml = require('js-yaml'),
	langs = require('langs'),

	coursesAPi = require('../api/courses.js'),
	courses = {}


courses.all = function (request, response, next) {

	coursesAPi
		.getAll()
		.then(function (courses) {
			response.render('courses', {
				title: 'Courses',
				page: 'courses',
				courses: courses || []
			})
		})
		.catch(function (error) {
			next(error)
		})
}

module.exports = courses

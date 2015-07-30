'use strict'

var fs = require('fs'),
	path = require('path'),
	yaml = require('js-yaml'),
	langs = require('langs'),

	lessonsApi = require('../api/lessons.js'),
	lessons = {}


lessons.all = function (request, response, next) {

	lessonsApi
		.getAll()
		.then(function (lessons) {
			lessons = lessons.filter(function (element) {
				return element
			})

			response.render(
				'lessons',
				{
					title: 'lessons',
					page: 'lessons',
					lessons: lessons || []
				}
			)
		})
		.catch(function (error) {
			next(error)
		})
}

lessons.getById = function (request, response) {

	var slug = request.params.slug

	lessonsApi
		.getById(slug)
		.then(function (descriptionObject) {

			descriptionObject.page = 'lesson'
			descriptionObject
				.thumbnailUrl = '/lessons/' + slug + '/images/thumbnail.png'

			response.render(
				'lesson',
				descriptionObject
			)
		})
}

module.exports = lessons

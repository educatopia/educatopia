'use strict'

require('es6-promise').polyfill()

var path = require('path'),
	marked = require('marked'),
	fsp = require('fs-promise'),
	yaml = require('js-yaml'),

	exportObject = {},
	knowledgeBasePath = path.resolve(
		__dirname, '../node_modules/knowledge_base'
	)


marked.setOptions({
	breaks: false,
	sanitize: true
})


exportObject.getAll = function () {

	var coursesPath = path.join(knowledgeBasePath, 'courses')

	return fsp
		.readdir(path.resolve(coursesPath))
		.then(function (courses) {

			var coursesPromises = courses.map(function (course) {
				return fsp
					.readFile(path.resolve(
						coursesPath, course, 'description.yaml'
					))
					.then(function (fileContent) {
						return yaml.safeLoad(fileContent)
					})
			})

			return Promise.all(coursesPromises)
		})
		.catch(function (error) {
			if (error.code !== 'ENOENT')
				throw error
		})
}

module.exports = exportObject

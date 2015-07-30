'use strict'

require('es6-promise').polyfill()

var path = require('path'),
	marked = require('marked'),
	fsp = require('fs-promise'),
	yaml = require('js-yaml'),

	exportObject = {},
	knowledgeBasePath = path.resolve(
		__dirname, '../node_modules/knowledge_base'
	),
	lessonsPath = path.join(knowledgeBasePath, 'lessons')


marked.setOptions({
	breaks: false,
	sanitize: true
})


exportObject.getAll = function () {

	return fsp
		.readdir(lessonsPath)
		.then(function (lessons) {

			var lessonsPromises = lessons
				.map(function (lesson) {
					return fsp
						.readFile(path.resolve(
							lessonsPath, lesson, 'index.md'
						))
						.then(function (fileContent) {
							return {
								id: lesson,
								title: lesson,
								summary: ''
								//fileContent.toString().substr(0, 100)
							}
						})
						.catch(function (error) {
							if (error.code !== 'ENOTDIR')
								throw error
						})
			})

			return Promise
				.all(lessonsPromises)
		})
		.catch(function (error) {
			if (error.code !== 'ENOENT')
				throw error
		})
}

exportObject.getById = function (id) {

	return fsp
		.readFile(path.resolve(
			lessonsPath, id, 'index.md'
		))
		.then(function (fileContent) {
			return {
				id: id,
				title: id,
				content: marked(fileContent.toString())
			}
		})
		.catch(function (error) {
			if (error.code !== 'ENOENT')
				throw error
		})
}

module.exports = exportObject

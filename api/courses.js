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
  coursesPath = path.join(knowledgeBasePath, 'courses'),
  lessonsPath = path.join(knowledgeBasePath, 'lessons')


marked.setOptions({
  breaks: false,
  sanitize: true
})


exportObject.getAll = function () {

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
          .catch(function (error) {
            if (error.code !== 'ENOENT')
              throw error
          })
      })

      return Promise.all(coursesPromises)
    })
    .catch(function (error) {
      if (error.code !== 'ENOENT')
        throw error
    })
}

exportObject.getById = function (id) {

  var courseObject = {}

  return fsp
    .readFile(path.resolve(
      coursesPath, id, 'description.yaml'
    ))
    .then(function (fileContent) {

      function createLessonPromise (lesson) {

        return fsp
          .readFile(path.resolve(
            lessonsPath, lesson, 'index.yaml'
          ))
          .catch(function (error) {
            if (error.code !== 'ENOENT')
              throw error
          })
          .then(function (fileContent) {
            var lessonObject = {}

            if (fileContent != null)
              lessonObject = yaml.safeLoad(fileContent)

              lessonObject.id = lesson
              lessonObject.title = lessonObject.title || lesson
              lessonObject.thumbnailUrl = '/lessons/' +
                lesson + '/' + 'images/thumbnail.png'

            return lessonObject
          })
      }

      courseObject = yaml.safeLoad(fileContent)

      var lessonsPromises = courseObject.lessons.map(createLessonPromise)

      return Promise.all(lessonsPromises)
    })
    .then(function (lessons) {
      courseObject.lessons = lessons

      return courseObject
    })
    .catch(function (error) {
      if (error.code !== 'ENOENT')
        throw error
    })
}

module.exports = exportObject

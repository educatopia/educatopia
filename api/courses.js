const path = require('path')
const marked = require('marked')
const fsp = require('fs-promise')
const yaml = require('js-yaml')

const exportObject = {}
const knowledgeBasePath = path.resolve(
  __dirname,
  '../node_modules/knowledge_base'
)
const coursesPath = path.join(knowledgeBasePath, 'courses')
const lessonsPath = path.join(knowledgeBasePath, 'lessons')


marked.setOptions({
  breaks: false,
  sanitize: true,
})


exportObject.getAll = function () {
  return fsp
    .readdir(path.resolve(coursesPath))
    .then((courses) => {

      const coursesPromises = courses.map((course) => {
        return fsp
          .readFile(path.resolve(
            coursesPath, course, 'description.yaml'
          ))
          .then((fileContent) => {
            return yaml.safeLoad(fileContent)
          })
          .catch((error) => {
            if (error.code !== 'ENOENT') {
              throw error
            }
          })
      })

      return Promise.all(coursesPromises)
    })
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error
      }
    })
}


exportObject.getById = function (id) {
  let courseObject = {}

  return fsp
    .readFile(path.resolve(
      coursesPath, id, 'description.yaml'
    ))
    .then((fileContent) => {

      function createLessonPromise (lesson) {
        return fsp
          .readFile(path.resolve(
            lessonsPath, lesson, 'index.yaml'
          ))
          .catch((error) => {
            if (error.code !== 'ENOENT') {
              throw error
            }
          })
          .then((yamlContent) => {
            let lessonObject = {}

            if (yamlContent != null) {
              lessonObject = yaml.safeLoad(yamlContent)
            }

            lessonObject.id = lesson
            lessonObject.title = lessonObject.title || lesson
            lessonObject.thumbnailUrl = '/lessons/' +
                lesson + '/' + 'images/thumbnail.png'

            return lessonObject
          })
      }

      courseObject = yaml.safeLoad(fileContent)

      const lessonsPromises = courseObject.lessons.map(createLessonPromise)

      return Promise.all(lessonsPromises)
    })
    .then((lessons) => {
      courseObject.lessons = lessons

      return courseObject
    })
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error
      }
    })
}


module.exports = exportObject

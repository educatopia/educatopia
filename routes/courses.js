const coursesApi = require('../api/courses.js')

const coursesModule = {}


coursesModule.all = function (request, response, next) {
  coursesApi
    .getAll()
    .then(courses => {
      response.render(
        'courses',
        {
          title: 'Courses',
          page: 'courses',
          courses: courses || [],
        }
      )
    })
    .catch(error => {
      next(error)
    })
}


coursesModule.getById = function (request, response) {
  const slug = request.params.slug

  coursesApi
    .getById(slug)
    .then(descriptionObject => {

      descriptionObject.page = 'course'
      descriptionObject.thumbnailUrl = '/courses/' +
        slug + '/images/thumbnail.png'

      response.render(
        'course',
        descriptionObject
      )
    })
    .catch((error) => {
      throw error
    })
}


module.exports = coursesModule

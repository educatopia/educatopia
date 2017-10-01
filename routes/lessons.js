const lessonsApi = require('../api/lessons.js')
const lessonsModule = {}


lessonsModule.all = function (request, response, next) {
  lessonsApi
    .getAll()
    .then(allLessons => {
      allLessons = allLessons.filter((element) => {
        return element
      })

      response.render(
        'lessons',
        {
          title: 'lessons',
          page: 'lessons',
          lessons: allLessons || [],
        }
      )
    })
    .catch((error) => {
      next(error)
    })
}


lessonsModule.getById = function (request, response) {
  const slug = request.params.slug

  lessonsApi
    .getById(slug)
    .then((descriptionObject) => {

      descriptionObject.page = 'lesson'
      descriptionObject.thumbnailUrl = '/lessons/' +
        slug + '/images/thumbnail.png'

      response.render(
        'lesson',
        descriptionObject
      )
    })
}


module.exports = lessonsModule

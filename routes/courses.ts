import * as coursesApi from "../api/courses.js"
import type { Config } from "../api/types.js"

export default function (config: Config) {
  return {
    async all(request, response) {
      const courses = await coursesApi.getAll()
      const renderObject = {
        title: "Courses",
        page: "courses",
        courses: courses || [],
        featureMap: config.featureMap,
      }

      response.render("courses", renderObject)
    },

    async getById(request, response) {
      const slug = request.params.slug
      const descriptionObject = await coursesApi.getById(slug)
      descriptionObject.page = "course"
      descriptionObject.thumbnailUrl = `/courses/${slug}/images/thumbnail.png`
      descriptionObject.featureMap = config.featureMap

      response.render("course", descriptionObject)
    },
  }
}

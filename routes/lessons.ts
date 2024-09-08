import * as lessonsApi from "../api/lessons.js"
import type { Config } from "../api/types.js"

export default function (config: Config) {
  return {
    async all(request, response) {
      const allLessons = (await lessonsApi.getAll()).filter(Boolean)
      const renderConfig = {
        title: "lessons",
        page: "lessons",
        lessons: allLessons || [],
        featureMap: config.featureMap,
      }

      response.render("lessons", renderConfig)
    },

    async getById(request, response) {
      const slug = request.params.slug

      const descriptionObject = await lessonsApi.getById(slug)
      descriptionObject.page = "lesson"
      descriptionObject.thumbnailUrl = `/lessons/${slug}/images/thumbnail.png`
      descriptionObject.featureMap = config.featureMap

      response.render("lesson", descriptionObject)
    },
  }
}

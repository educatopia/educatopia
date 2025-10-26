import * as lessonsApi from "../api/lessons.js"
import type { Config, RouteRequest, RouteResponse, LessonDescription } from "../api/types.js"

export default function (config: Config) {
  return {
    async all(request: RouteRequest, response: RouteResponse) {
      const allLessons = (await lessonsApi.getAll() || []).filter(Boolean)
      const renderConfig = {
        title: "lessons",
        page: "lessons",
        lessons: allLessons || [],
        featureMap: config.featureMap,
      }

      response.render("lessons", renderConfig)
    },

    async getById(request: RouteRequest, response: RouteResponse) {
      const slug = request.params.slug

      const descriptionObject: LessonDescription | undefined = await lessonsApi.getById(slug)

      if (!descriptionObject) {
        response.status(404).send("Lesson not found")
        return
      }

      const renderObject = {
        ...descriptionObject,
        page: "lesson",
        thumbnailUrl: `/lessons/${slug}/images/thumbnail.png`,
        featureMap: config.featureMap,
      }

      response.render("lesson", renderObject)
    },
  }
}

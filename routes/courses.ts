import type { Request, Response } from "express"
import * as coursesApi from "../api/courses.js"
import type { Config } from "../api/types.js"

export default function (config: Config) {
  return {
    async all(request: Request, response: Response) {
      const courses = await coursesApi.getAll()
      const renderObject = {
        title: "Courses",
        page: "courses",
        courses: courses || [],
        featureMap: config.featureMap,
      }

      response.render("courses", renderObject)
    },

    async getById(request: Request, response: Response) {
      const slug = request.params.slug
      const course = await coursesApi.getById(slug)
      const renderObject = {
        ...course,
        page: "course",
        thumbnailUrl: `/courses/${slug}/images/thumbnail.png`,
        featureMap: config.featureMap,
      }

      response.render("course", renderObject)
    },
  }
}

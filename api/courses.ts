import path from "node:path"
import { marked } from "marked"
import fsp from "fs-extra"
import yaml from "js-yaml"

const knowledgeBasePath = path.resolve(
  __dirname,
  "../node_modules/knowledge_base",
)
const coursesPath = path.join(knowledgeBasePath, "courses")
const lessonsPath = path.join(knowledgeBasePath, "lessons")

marked.setOptions({
  breaks: false,
})

export async function getAll() {
  return fsp
    .readdir(path.resolve(coursesPath))
    .then((courses) => {
      const coursesPromises = courses.map((course) => {
        return fsp
          .readFile(path.resolve(coursesPath, course, "description.yaml"))
          .then((fileContent) => {
            return yaml.load(fileContent.toString())
          })
          .catch((error) => {
            if (error.code !== "ENOENT") {
              throw error
            }
          })
      })

      return Promise.all(coursesPromises)
    })
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error
      }
    })
}

function createLessonPromise(lesson: string) {
  return fsp
    .readFile(path.resolve(lessonsPath, lesson, "index.yaml"))
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error
      }
    })
    .then((yamlContent) => {
      let lessonObject: Lesson

      if (yamlContent != null) {
        lessonObject = yaml.load(yamlContent.toString()) as Lesson
      } else {
        lessonObject = {
          id: lesson,
          title: lesson,
          thumbnailUrl: `/lessons/${lesson}/images/thumbnail.png`,
          content: "",
        }
      }

      return lessonObject
    })
}

export async function getById(id: string) {
  let courseObject: CourseYaml = { lessons: [] }

  return fsp
    .readFile(path.resolve(coursesPath, id, "description.yaml"))
    .then((fileContent) => {
      courseObject = yaml.load(fileContent.toString()) as CourseYaml

      const lessonsPromises = courseObject.lessons.map(createLessonPromise)

      return Promise.all(lessonsPromises)
    })
    .then((lessons) => {
      return { lessons }
    })
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error
      }
    })
}

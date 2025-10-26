import path from "node:path"
import fsp from "fs-extra"
import yaml from "js-yaml"
import * as commonmark from "commonmark"
import type { LessonDescription } from "./types"

const knowledgeBasePath = path.resolve(
  __dirname,
  "../node_modules/knowledge_base",
)
const lessonsPath = path.join(knowledgeBasePath, "lessons")
const reader = new commonmark.Parser()
const writer = new commonmark.HtmlRenderer()

export function resolveIncludes(contentString: string, id: string) {
  let includeSection
  let includePath

  do {
    includeSection = contentString.match(/\{\{(.+)\}\}/i)
    if (includeSection) {
      includePath = path.resolve(lessonsPath, id, includeSection[1])

      contentString = contentString.replace(
        includeSection[0],
        fsp.readFileSync(includePath).toString(),
      )
    }
  } while (includeSection)

  return contentString
}

export function getAll() {
  return fsp
    .readdir(lessonsPath)
    .then((lessons) => {
      const lessonsPromises = lessons.map((lesson) => {
        return fsp
          .readFile(path.resolve(lessonsPath, lesson, "index.yaml"))
          .catch((error) => {
            if (error.code !== "ENOENT") {
              throw error
            }
          })
          .then((fileContent) => {
            let descriptionObject: LessonDescription = {}

            if (fileContent) {
              descriptionObject = yaml.load(fileContent.toString()) as LessonDescription
            }

            descriptionObject.id = lesson
            descriptionObject.title = descriptionObject.title || lesson

            return descriptionObject
          })
          .catch((error) => {
            if (error.code !== "ENOTDIR") {
              throw error
            }
          })
      })

      return Promise.all(lessonsPromises)
    })
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error
      }
    })
}

export function getById(id: string): Promise<LessonDescription | undefined> {
  function improveImageNode(nodeEvent: { entering: boolean; node: commonmark.Node }) {
    const node = nodeEvent.node
    let imageNode

    if (
      node.type === "paragraph" &&
      !nodeEvent.entering &&
      node.firstChild === node.lastChild &&
      node.firstChild?.type === "image"
    ) {
      imageNode = new commonmark.Node("html_block")
      imageNode.literal = `<img
				srcset="
					${id}/${node.firstChild.destination} 1x,
					${id}/${node.firstChild.destination?.replace(".", "_hq.")} 2x
				"
				alt="${node.firstChild.literal}"
			>`

      node.insertAfter(imageNode)
      node.unlink()
    }
  }

  return Promise.all([
    fsp.readFile(path.resolve(lessonsPath, id, "index.yaml")),
    fsp.readFile(path.resolve(lessonsPath, id, "index.md")),
  ])
    .then((array) => {
      const descriptionObject = yaml.load(array[0].toString()) as LessonDescription
      const wordsPerMinute = 50
      const contentString = resolveIncludes(array[1].toString(), id)
      const numberOfWords = contentString.split(" ").length
      const parsedMarkdown = reader.parse(contentString)
      const walker = parsedMarkdown.walker()
      let nodeEvent

      do {
        nodeEvent = walker.next()
        if (nodeEvent) {
          improveImageNode(nodeEvent)
        }
      } while (nodeEvent)

      descriptionObject.numberOfWords = numberOfWords
      descriptionObject.readingDuration = Math.round(
        numberOfWords / wordsPerMinute,
      )
      descriptionObject.content = writer.render(parsedMarkdown)

      return descriptionObject
    })
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error
      }
      return undefined
    })
}

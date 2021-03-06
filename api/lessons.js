const path = require('path')
const fsp = require('fs-extra')
const yaml = require('js-yaml')
const commonmark = require('commonmark')

const exportObject = {}
const knowledgeBasePath = path.resolve(
  __dirname, '../node_modules/knowledge_base'
)
const lessonsPath = path.join(knowledgeBasePath, 'lessons')
const reader = new commonmark.Parser()
const writer = new commonmark.HtmlRenderer()


function resolveIncludes (contentString, id) {
  let includeSection
  let includePath

  do {
    includeSection = contentString.match(/\{\{(.+)\}\}/i)
  }
  while (includeSection) {
    includePath = path.resolve(lessonsPath, id, includeSection[1])

    contentString = contentString.replace(
      includeSection[0],
      fsp.readFileSync(includePath)
    )
  }

  return contentString
}


exportObject.getAll = function () {
  return fsp
    .readdir(lessonsPath)
    .then((lessons) => {

      const lessonsPromises = lessons.map((lesson) => {
        return fsp
          .readFile(path.resolve(
            lessonsPath, lesson, 'index.yaml'
          ))
          .catch((error) => {
            if (error.code !== 'ENOENT') {
              throw error
            }
          })
          .then((fileContent) => {
            let descriptionObject = {}

            if (fileContent) {
              descriptionObject = yaml.safeLoad(fileContent)
            }

            descriptionObject.id = lesson
            descriptionObject.title = descriptionObject.title ||
              lesson

            return descriptionObject
          })
          .catch((error) => {
            if (error.code !== 'ENOTDIR') {
              throw error
            }
          })
      })

      return Promise.all(lessonsPromises)
    })
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error
      }
    })
}


exportObject.getById = function (id) {
  function improveImageNode (nodeEvent) {

    const node = nodeEvent.node
    let imageNode

    if (node.type === 'Paragraph' &&
      !nodeEvent.entering &&
      node.firstChild === node.lastChild &&
      node.firstChild.type === 'Image'
    ) {
      imageNode = new commonmark.Node('HtmlBlock')
      imageNode.literal = '<img srcset="' +
          id + '/' + node.firstChild.destination + ' 1x, ' +
          id + '/' +
          node.firstChild.destination.replace('.', '_hq.') + ' 2x' +
          '" alt="' +
          node.firstChild.literal +
          '">'

      node.insertAfter(imageNode)
      node.unlink()
    }
  }

  return Promise
    .all([
      fsp.readFile(path.resolve(lessonsPath, id, 'index.yaml')),
      fsp.readFile(path.resolve(lessonsPath, id, 'index.md')),
    ])
    .then((array) => {
      const descriptionObject = yaml.safeLoad(array[0])
      const wordsPerMinute = 50
      const contentString = resolveIncludes(array[1].toString(), id)
      const numberOfWords = contentString.split(' ').length
      const parsedMarkdown = reader.parse(contentString)
      const walker = parsedMarkdown.walker()
      let nodeEvent

      do {
        nodeEvent = walker.next()
      }
      while (nodeEvent) {
        improveImageNode(nodeEvent)
      }

      descriptionObject.numberOfWords = numberOfWords
      descriptionObject.readingDuration = Math.round(
        numberOfWords / wordsPerMinute
      )
      descriptionObject.content = writer.render(parsedMarkdown)

      return descriptionObject
    })
    .catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error
      }
    })
}


module.exports = exportObject

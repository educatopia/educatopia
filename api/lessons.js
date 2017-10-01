'use strict'

require('es6-promise').polyfill()

var path = require('path'),
  fsp = require('fs-promise'),
  yaml = require('js-yaml'),
  commonmark = require('commonmark'),

  exportObject = {},
  knowledgeBasePath = path.resolve(
    __dirname, '../node_modules/knowledge_base'
  ),
  lessonsPath = path.join(knowledgeBasePath, 'lessons'),
  reader = new commonmark.Parser(),
  writer = new commonmark.HtmlRenderer()


function resolveIncludes (contentString, id) {
  var includeSection,
    includePath

  while (includeSection = contentString.match(/\{\{(.+)\}\}/i)) {

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
    .then(function (lessons) {

      var lessonsPromises = lessons .map(function (lesson) {
        return fsp
          .readFile(path.resolve(
            lessonsPath, lesson, 'index.yaml'
          ))
          .catch(function (error) {
            if (error.code !== 'ENOENT')
              throw error
          })
          .then(function (fileContent) {
            var descriptionObject = {}

            if (fileContent)
              descriptionObject = yaml.safeLoad(fileContent)

            descriptionObject.id = lesson
            descriptionObject.title = descriptionObject.title ||
              lesson

            return descriptionObject
          })
          .catch(function (error) {
            if (error.code !== 'ENOTDIR')
              throw error
          })
      })

      return Promise.all(lessonsPromises)
    })
    .catch(function (error) {
      if (error.code !== 'ENOENT')
        throw error
    })
}

exportObject.getById = function (id) {

  function improveImageNode (nodeEvent) {

    var node = nodeEvent.node,
      imageNode

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
      fsp.readFile(path.resolve(lessonsPath, id, 'index.md'))
    ])
    .then(function (array) {
      var descriptionObject = yaml.safeLoad(array[0]),
        contentString = array[1].toString(),
        wordsPerMinute = 50,
        numberOfWords,
        includeSection,
        parsedMarkdown,
        walker,
        nodeEvent


      contentString = resolveIncludes(contentString, id)
      numberOfWords = contentString.split(' ').length

      parsedMarkdown = reader.parse(contentString)
      walker = parsedMarkdown.walker()

      while (nodeEvent = walker.next())
        improveImageNode(nodeEvent)

      descriptionObject.numberOfWords = numberOfWords
      descriptionObject.readingDuration = Math.round(
        numberOfWords / wordsPerMinute
      )
      descriptionObject.content = writer.render(parsedMarkdown)

      return descriptionObject
    })
    .catch(function (error) {
      if (error.code !== 'ENOENT')
        throw error
    })
}

module.exports = exportObject

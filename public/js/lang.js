'use strict'

function I18n (data) {

  var count = 0,
    subs = [],
    i,
    temp,
    history = [],
    untranslated = []

  this.dict = function () {

    // jshint maxstatements: 12

    var regexp,
      args = arguments,
      string = args[0],
      replacedString

    // Build history of all string
    history.push(string)

    // Exit program when no translation exists
    // and add to list of untranslated strings
    if (!data[string]) {

      untranslated.push(string)

      return string
    }


    for (i = 1; i < args.length; i++) {

      temp = args[i]

      // if String
      if (temp.big)
        subs.push(temp)

      // if Number
      else if (temp.toFixed)
        count += temp - 1
    }


    for (i = 0; i < subs.length; i++) {

      regexp = new RegExp('\\{' + i + '\\}', 'gi');

      if (i === 0)
        replacedString = data[string][count].replace(regexp, subs[i])
      else
        replacedString = replacedString.replace(regexp, subs[i])
    }

    return replacedString || data[string][count]
  }

  this.getHistory = function () {
    return untranslated
  }

  this.getUntranslated = function () {
    return untranslated
  }

  return this
}

module.exports = I18n

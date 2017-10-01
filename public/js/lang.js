function I18n (data) {
  let count = 0
  const subs = []
  let temp
  const history = []
  const untranslated = []

  this.dict = function () {

    let regexp
    const args = arguments
    const string = args[0]
    let replacedString

    // Build history of all string
    history.push(string)

    // Exit program when no translation exists
    // and add to list of untranslated strings
    if (!data[string]) {
      untranslated.push(string)

      return string
    }


    for (let index = 1; index < args.length; index++) {
      temp = args[index]

      // if String
      if (temp.big) {
        subs.push(temp)
      }

      // if Number
      else if (temp.toFixed) {
        count += temp - 1
      }
    }


    for (let index = 0; index < subs.length; index++) {
      regexp = new RegExp('\\{' + index + '\\}', 'gi')

      if (index === 0) {
        replacedString = data[string][count].replace(regexp, subs[index])
      }
      else {
        replacedString = replacedString.replace(regexp, subs[index])
      }
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

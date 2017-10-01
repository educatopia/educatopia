/* global document */
/* eslint-disable no-var */

var _paq = _paq || [] //

_paq.push(['trackPageView'])
_paq.push(['enableLinkTracking'])

!(function () {
  var url = '//piwik.adriansieber.com/'
  var scriptElement = document.createElement('script')
  var firstScript = document.getElementsByTagName('script')[0]

  _paq.push(['setTrackerUrl', url + 'piwik.php'])
  _paq.push(['setSiteId', 2])

  scriptElement.type = 'text/javascript'
  scriptElement.async = true
  scriptElement.defer = true
  scriptElement.src = url + 'piwik.js'
  firstScript.parentNode.insertBefore(scriptElement, firstScript)
})()

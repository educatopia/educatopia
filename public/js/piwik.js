'use strict'

/* global document */
// jshint expr: true

var _paq = _paq || []

_paq.push(['trackPageView'])
_paq.push(['enableLinkTracking'])

!function () {
	var u = '//piwik.adriansieber.com/',
		d = document,
		g = d.createElement('script'),
		s = d.getElementsByTagName('script')[0]

	_paq.push(['setTrackerUrl', u + 'piwik.php'])
	_paq.push(['setSiteId', 2])

	g.type = 'text/javascript'
	g.async = true
	g.defer = true
	g.src = u + 'piwik.js'
	s.parentNode.insertBefore(g, s)
}()

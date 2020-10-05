/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

const config = require('./config'),
      i18n = require('node-i18n-util'),
      path = require('path')

module.exports = function (chunk, context, bodies, params) {
  if (params && params.href) {
    const relativePath = `../../${params.href}` // load the properties

    require(relativePath)

    // resolve the bundle locale being used
    const bundlePath = path.join(__dirname, relativePath),
          locale = i18n._resolveBundle(bundlePath, params.locale).locale,
          basePath = params.href.substring(0, params.href.indexOf('.properties'))

    params.href = basePath + (locale ? '_' + locale.replace('-', '_') : '') + '.js'

    return `${config.contextPath}/${params.href}`
  }
  return config.contextPath
}

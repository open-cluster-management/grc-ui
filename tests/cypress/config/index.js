/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')
const jsYaml = require('js-yaml')

exports.getConfig = (filepath) => {
  try {
    return fs.readFileSync(filepath).toString()
  } catch (e) {
    throw new Error(e)
  }
}

exports.getConfigObject = (relativePath, configFormat='') => {
  const postfix = relativePath.replace(/\//g, '__').replace(/-/g,'_').replace(/\./g,'_').toUpperCase()
  // if configFormat not provided, try to detect the file format from a relativePath file suffix
  if (!configFormat) {
    const arr = relativePath.split('.')
    configFormat = arr[arr.length-1]
  }
  try {
    switch(configFormat.toLowerCase()) {
      case 'yaml':
        return jsYaml.load(Cypress.env(`TEST_CONFIG_${postfix}`))
      case 'json':
        return JSON.parse(Cypress.env(`TEST_CONFIG_${postfix}`))
      case 'raw':
      case 'txt':
      default:
        return Cypress.env(`TEST_CONFIG_${postfix}`)
    }
  } catch (e) {
    throw new Error(e)
  }
}

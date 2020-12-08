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

exports.getConfigObject = (fileName, subDirName='', returnType='raw') => {
  let postfix = subDirName ? `${subDirName}_${fileName}` : fileName
  postfix = postfix.replace('-','_').toUpperCase()
  try {
    switch(returnType.toLowerCase()) {
      case 'json':
        return jsYaml.load(Cypress.env(`TEST_CONFIG_${postfix}`))
      case 'raw':
      default:
        return Cypress.env(`TEST_CONFIG_${postfix}`)
    }
  } catch (e) {
    throw new Error(e)
  }
}

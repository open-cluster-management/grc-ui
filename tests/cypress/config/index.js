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

exports.getConfigObject = (postfix, returnType='raw') => {
  try {
    switch(returnType.toLowerCase()) {
      case 'json':
        return jsYaml.load(Cypress.env('TEST_CONFIG_'+postfix.replace('-','_').toUpperCase()))
      case 'raw':
      default:
        return Cypress.env('TEST_CONFIG_'+postfix.replace('-','_').toUpperCase())
    }
  } catch (e) {
    throw new Error(e)
  }
}

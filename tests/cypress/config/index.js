/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')
const jsYaml = require('js-yaml')

exports.getConfig = (filepath) => {
  let config
  config = fs.readFileSync(filepath).toString()
  console.log(filepath)
  console.log(config)

 return config
}

exports.getConfigObject = (prefix) => {
  let config
  try {
    config = jsYaml.safeLoad(Cypress.env('TEST_CONFIG_'+prefix.toUpperCase()))
  } catch (e) {
    throw new Error(e)
  }
 
  return config
}

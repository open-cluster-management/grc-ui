/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')

exports.getYAMLStrFromFile = (filepath) => {
  return fs.readFileSync(filepath).toString()
}

exports.getYAMLStrFromCyEnv = (prefix) => {
  return Cypress.env('TEST_YAML_'+prefix.toUpperCase())
}

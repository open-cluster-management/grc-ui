/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')
const jsYaml = require('js-yaml')

exports.getConfig = (filepath) => {
  let config
  config = fs.readFileSync(filepath)

  try {
    config = jsYaml.safeLoad(config)
  } catch (e) {
    throw new Error(e)
  }
  return JSON.stringify(config)
}

/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

const glob = require('glob')
const path = require('path')
const getConfig = require('../config').getConfig
const configFiles = glob.sync(path.join(__dirname, '../config', '*.yaml'))

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  for (const file of configFiles) {
    // get base name, cut-off .yaml suffice, replace - with _ and convert to uppercase
    const norm = file.replace(/^.*\//, '').replace(/\.yaml$/, '').replace('-','_').toUpperCase()
    config.env['TEST_CONFIG_'+norm] = getConfig(file)
  }
  require('cypress-terminal-report/src/installLogsPrinter')(on)

  return config
}

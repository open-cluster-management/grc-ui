/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

/**
 * @type {Cypress.PluginConfig}
 */

const glob = require("glob")
const path = require("path")
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

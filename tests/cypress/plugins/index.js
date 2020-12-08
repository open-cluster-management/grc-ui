/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

const glob = require('glob')
const path = require('path')
const getYAMLStrFromFile = require('../yaml').getYAMLStrFromFile
const yamlFiles = glob.sync(path.join(__dirname, '../yaml/*/', '*.yaml'))
const getConfig = require('../config').getConfig
const configFiles = glob.sync(path.join(__dirname, '../config/*/', '*.config'))

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  for (const yaml of yamlFiles) {
    // get base name, cut-off .yaml suffice, replace - with _ and convert to uppercase
    const norm = yaml.replace(/^.*\//, '').replace(/\.yaml$/, '').replace('-','_').toUpperCase()
    config.env['TEST_YAML_'+norm] = getYAMLStrFromFile(yaml)
  }
  for (const conf of configFiles) {
    // get base name, cut-off .yaml suffice, replace - with _ and convert to uppercase
    const norm = conf.replace(/^.*\//, '').replace(/\.config$/, '').replace('-','_').toUpperCase()
    config.env['TEST_CONFIG_'+norm] = getConfig(conf)
  }
  require('cypress-terminal-report/src/installLogsPrinter')(on)

  return config
}

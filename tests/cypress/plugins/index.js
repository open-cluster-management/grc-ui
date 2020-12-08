/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

const glob = require('glob')
const path = require('path')
const getConfig = require('../config').getConfig
const configFiles = glob.sync(path.join(__dirname, '../config/*/', '*.yaml'))

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  for (const singleConfig of configFiles) {
    // get base name, cut-off .yaml suffice, replace - with _ and convert to uppercase
    const pathArray = singleConfig.split('/')
    const lastSubDirName = pathArray[pathArray.length-2]
    const fileName = pathArray[pathArray.length-1]
    const uFileName = lastSubDirName ? `${lastSubDirName}_${fileName}` : fileName
    const fomarttedFileName = uFileName.replace(/\.yaml$/, '').replace('-','_').toUpperCase()
    config.env[`TEST_CONFIG_${fomarttedFileName}`] = getConfig(singleConfig)
  }
  require('cypress-terminal-report/src/installLogsPrinter')(on)

  return config
}

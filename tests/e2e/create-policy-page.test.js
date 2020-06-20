/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = require('../../config')

let page

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/all`
    page = browser.page.CreatePolicyPage()
    page.navigate(url)
  },

  'Select and confirm namespace': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-namespace-policy-test`
    page.createTestPolicy(policyName)
    browser.collectCoverage(() => {
      page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
      page.verifyPolicy(true, policyName)
      page.deletePolicy(policyName)
    })
  }
}
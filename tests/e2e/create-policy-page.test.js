/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = require('../../config')
let page
let standards = ['FISMA', 'HIPAA', 'NIST', 'NIST-CSF', 'PCI']

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
  'Select and confirm standards': (browser) => {
    standards.forEach(std => {
      let time = browser.globals.time
      let policyName = `${time}-namespace-policy-test`
      page.createTestPolicy(policyName, { standard: [std] })
      page.verifyPolicy(true, policyName, { standard: [std] })
      page.deletePolicy(policyName)
    })
  },
  'Select and confirm all standards': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-namespace-policy-test`
    page.createTestPolicy(policyName, { standard: standards })
    page.verifyPolicy(true, policyName, { standard: standards })
    page.deletePolicy(policyName)
  }
}
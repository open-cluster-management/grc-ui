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
    page.createTestPolicy(browser, time)
    // browser.collectCoverage(() => {
    //   page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
    //   page.searchPolicy(true, time)
    //   page.testDetailsPage(browser, `${time}-policy-test`)
    // })
  }
}
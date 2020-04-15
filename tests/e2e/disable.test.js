/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
let page

module.exports = {
  '@disabled': true,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/all`
    page = browser.page.DisablePage()
    page.navigate(url)
  },

  'Disable policy: test policy disable': (browser) => {
    const time = browser.globals.time
    page.createPolicy()
    page.tryDisable()
    page.createPolicy()
    page.verifyDisable()
    page.tryEnable()
    page.verifyEnable()
    page.deletePolicy()
    page.deletePolicy()
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

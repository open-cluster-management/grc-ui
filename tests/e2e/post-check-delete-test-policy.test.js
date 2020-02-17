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
    page = browser.page.AllPolicyPage()
    page.navigate(url)
  },

  'All policy page: delete policy': (browser) => {
    page.searchPolicy(true, browser.globals.time)
    page.deletePolicy()
    page.searchPolicy(false, browser.globals.time)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

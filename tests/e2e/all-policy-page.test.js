// /*******************************************************************************
//  * Licensed Materials - Property of IBM
//  * (c) Copyright IBM Corporation 2018. All Rights Reserved.
//  *
//  * Note to U.S. Government Users Restricted Rights:
//  * Use, duplication or disclosure restricted by GSA ADP Schedule
//  * Contract with IBM Corp.
//  *******************************************************************************
//  * Copyright (c) 2020 Red Hat, Inc.
//  *******************************************************************************/

// const config = require('../../config')
// // const a11yScan = require('../utils/accessibilityScan')
// let page

// module.exports = {
//   '@disabled': false,

//   before: (browser) => {
//     const loginPage = browser.page.LoginPage()
//     if(process.env.SELENIUM_USER === undefined || process.env.SELENIUM_PASSWORD === undefined){
//       browser.end()
//       throw new Error('Env variable NOT set.\nPlease export UI user/password as SELENIUM_USER/SELENIUM_PASSWORD')
//     }
//     loginPage.navigate()
//     loginPage.authenticate()

//     const url = `${browser.launch_url}${config.get('contextPath')}/all`
//     page = browser.page.AllPolicyPage()
//     page.navigate(url)
//   },

//   'All policy page: Add, search, disable/enable test policy': (browser) => {
//     const time = browser.globals.time
//     page.createTestPolicy(browser, time)
//     page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//     page.searchPolicy(true, time)
//     page.testDetailsPage(browser, `${time}-policy-test`)
//     // page.verifyDisableEnable(`${time}-policy-test`, browser)
//   },

//   // 'All policy page: Load and run expand': (browser) => {
//   //   page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//   //   page.verifyTable(browser, false)
//   // },

//   'All policy page: Verify summary table': (browser) => {
//     page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//     page.verifySummary(browser, `${browser.launch_url}${config.get('contextPath')}/all`)
//   },

//   'All policy page: Test pagination': (browser) => {
//     page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//     page.verifyPagination(browser)
//   },

//   // 'All policy page: Run Accessibility Scan': (browser) => {
//   //   page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//   //   a11yScan.runAccessibilityScan(browser, 'allPolicy')
//   //   page.navigate(`${browser.launch_url}${config.get('contextPath')}/all`)
//   //   a11yScan.runAccessibilityScan(browser, 'policyDetail')
//   // },

//   'All policy page: Delete test policy': (browser) => {
//     const time = browser.globals.time
//     page.deletePolicy(`${time}-policy-test`, browser)
//   },

//   after: function (browser, done) {
//     setTimeout(() => {
//       browser.end()
//       done()
//     })
//   }
// }

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

var fs = require('fs')
const path = require('path')

const config = require('../../config')
// const a11yScan = require('../utils/accessibilityScan')
let page

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    if(process.env.SELENIUM_USER === undefined || process.env.SELENIUM_PASSWORD === undefined){
      browser.end()
      throw new Error('Env variable NOT set.\nPlease export UI user/password as SELENIUM_USER/SELENIUM_PASSWORD')
    }
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/all`
    page = browser.page.PolicyController()
    page.navigate(url)
  },

//   'IAM policy: create namespace ': (browser) => {
//     const time = browser.globals.time
//     const createNS = fs.readFileSync(path.join(__dirname, 'yaml/create_test_ns.yaml'))
//     var yaml = createNS.toString()
//     page.createPolicy(browser, 'policy-namespace-create-' + time, yaml, time)
//     browser.pause(20000) // Wait for policy to create namespace 20s
//     page.checkViolations('policy-namespace-create-' + time, false)
//     page.deletePolicy('policy-namespace-create-' + time)
//   },

  'IAM policy: create iam-policy ': (browser) => {
    const time = browser.globals.time
    const createIamPolicy = fs.readFileSync(path.join(__dirname, 'yaml/create_test_iam_policy.yaml'))
    var yaml = createIamPolicy.toString()
    page.createPolicy(browser, 'policy-iampolicy-' + time, yaml, time)
    browser.pause(60000) // Wait for policy to create iam-policy 20s
    page.checkViolations('policy-iampolicy-' + time, false)
  },

  'IAM policy: create clusterrolebinding as should show violation ': (browser) => {
    const time = browser.globals.time
    const createCRB = fs.readFileSync(path.join(__dirname, 'yaml/create_test_clusterrolebinding.yaml'))
    var yaml = createCRB.toString()
    page.createPolicy(browser, 'policy-clusterrolebinding-test-' + time, yaml, time)
    browser.pause(20000) // Wait for policy to create clusterrolebinding 20s
    page.checkViolations('policy-clusterrolebinding-test-' + time, false)
    page.deletePolicy('policy-clusterrolebinding-test-' + time)

    browser.pause(60000) // Wait for iam policy to detect change 60s
    page.checkViolations('policy-iampolicy-' + time, true)
  },

  'IAM policy: delete clusterrolebinding as should show compliant ': (browser) => {
    const time = browser.globals.time
    const deleteCRB = fs.readFileSync(path.join(__dirname, 'yaml/delete_test_clusterrolebinding.yaml'))
    var yaml = deleteCRB.toString()
    page.createPolicy(browser, 'policy-clusterrolebinding-delete-' + time, yaml, time)
    browser.pause(20000) // Wait for policy to delete clusterrolebinding 20s
    page.checkViolations('policy-clusterrolebinding-delete-' + time, false)
    page.deletePolicy('policy-clusterrolebinding-delete-' + time)

    browser.pause(120000) // Wait for iam policy to detect change 120s
    page.checkViolations('policy-iampolicy-' + time, false)
  },

  'IAM policy: clean up ': (browser) => {
    const time = browser.globals.time
    page.deletePolicy('policy-iampolicy-' + time)

    // const deleteNS = fs.readFileSync(path.join(__dirname, 'yaml/delete_test_ns.yaml'))
    // var yaml = deleteNS.toString()
    // page.createPolicy(browser, 'policy-namespace-delete-' + time, yaml, time)
    // browser.pause(20000) // Wait for policy to delete namespace 20s
    // page.checkViolations('policy-namespace-delete-' + time, false)
    // page.deletePolicy('policy-namespace-delete-' + time)
    // browser.pause(1000)

    // page.searchPolicy('policy-namespace-create-' + time, false)
    page.searchPolicy('policy-iampolicy-' + time, false)
    page.searchPolicy('policy-clusterrolebinding-test-' + time, false)
    page.searchPolicy('policy-clusterrolebinding-delete-' + time, false)
    // page.searchPolicy('policy-namespace-delete-' + time, false)
  },


  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

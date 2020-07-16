/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
* Copyright (c) 2020 Red Hat, Inc. */

var fs = require('fs')
const path = require('path')

let page

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    page = browser.page.RemediationPage()
  },

  'Remediation policy: test policy enforce + inform': (browser) => {
    const time = browser.globals.time

    const inform = fs.readFileSync(path.join(__dirname, 'yaml/disable_test/ed_pod_mustnothave_inform.yaml'))
    var yaml = inform.toString()
    page.createPolicy(browser, yaml, time)
    browser.pause(30000)
    //policy-pod-inform isn't violated
    page.checkViolations('policy-pod-inform-' + time, false)

    const createPod = fs.readFileSync(path.join(__dirname, 'yaml/disable_test/ed_pod_create.yaml'))
    yaml = createPod.toString()
    page.createPolicy(browser, yaml, time)
    browser.pause(30000)
    page.checkViolations('policy-pod-create-' + time, false)
    // after creating policy-pod-create, now policy-pod-inform is violated
    page.checkViolations('policy-pod-inform-' + time, true)

    page.tryEnforce('policy-pod-inform-' + time)
    browser.pause(30000)
    page.checkEnforce('policy-pod-inform-' + time)
    browser.pause(30000)
    page.checkViolations('policy-pod-create-' + time, false)
    //policy-pod-inform isn't violated after enforcing
    page.checkViolations('policy-pod-inform-' + time, false)

    page.tryInform('policy-pod-inform-' + time)
    browser.pause(30000)
    page.checkInform('policy-pod-inform-' + time)
    browser.pause(30000)
    page.checkViolations('policy-pod-create-' + time, false)
    //policy-pod-inform is violated after informing
    page.checkViolations('policy-pod-inform-' + time, true)

    page.deletePolicy('policy-pod-create-' + time)
    page.deletePolicy('policy-pod-inform-' + time)
  },
}

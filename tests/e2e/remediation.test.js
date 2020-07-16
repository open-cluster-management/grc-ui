/* Copyright (c) 2020 Red Hat, Inc. */

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

    const inform = fs.readFileSync(path.join(__dirname, 'yaml/disable_test/ed_pod_remediation_inform.yaml'))
    var yaml = inform.toString()
    page.createPolicy(browser, yaml, time)
    browser.pause(30000)
    //policy-pod-remediation-inform isn't violated
    page.checkViolations('policy-pod-remediation-inform-' + time, false)

    const createPod = fs.readFileSync(path.join(__dirname, 'yaml/disable_test/ed_pod_remediation_enforce.yaml'))
    yaml = createPod.toString()
    page.createPolicy(browser, yaml, time)
    browser.pause(30000)
    page.checkViolations('policy-pod-remediation-enforce-' + time, false)
    // after creating policy-pod-remediation-enforce, now policy-pod-remediation-inform is violated
    page.checkViolations('policy-pod-remediation-inform-' + time, true)

    page.tryEnforce('policy-pod-remediation-inform-' + time)
    browser.pause(30000)
    page.checkEnforce('policy-pod-remediation-inform-' + time)
    browser.pause(30000)
    page.checkViolations('policy-pod-remediation-enforce-' + time, false)
    //policy-pod-remediation-inform isn't violated after enforcing
    page.checkViolations('policy-pod-remediation-inform-' + time, false)

    page.tryInform('policy-pod-remediation-inform-' + time)
    browser.pause(30000)
    page.checkInform('policy-pod-remediation-inform-' + time)
    browser.pause(30000)
    page.checkViolations('policy-pod-remediation-enforce-' + time, false)
    //policy-pod-remediation-inform is violated after informing
    page.checkViolations('policy-pod-remediation-inform-' + time, true)

    page.deletePolicy('policy-pod-remediation-enforce-' + time)
    page.deletePolicy('policy-pod-remediation-inform-' + time)
  },
}

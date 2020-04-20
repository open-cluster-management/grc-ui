/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var fs = require('fs')
const path = require('path')

const config = require('../../config')
let page

module.exports = {

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/all`
    page = browser.page.DisablePage()
    page.navigate(url)
  },

  'Disable policy: test policy disable + enable': (browser) => {
    const time = browser.globals.time

    const enforce = fs.readFileSync(path.join(__dirname, 'yaml/ed_pod_mustnothave.yaml'))
    var yaml = enforce.toString()
    page.createPolicy(browser, yaml, time)
    const inform = fs.readFileSync(path.join(__dirname, 'yaml/ed_pod_mustnothave_inform.yaml'))
    yaml = inform.toString()
    page.createPolicy(browser, yaml, time)
    page.checkViolations('policy-pod-inform-' + time, false)

    page.tryDisable('policy-pod-' + time)
    const createPod = fs.readFileSync(path.join(__dirname, 'yaml/ed_pod_create.yaml'))
    yaml = createPod.toString()
    page.createPolicy(browser, yaml, time)
    page.checkViolations('policy-pod-create-' + time, false)
    page.checkViolations('policy-pod-inform-' + time, true)

    page.tryEnable('policy-pod-' + time)
    browser.pause(5000)
    page.checkViolations('policy-pod-inform-' + time, false)

    page.deletePolicy('policy-pod-create-' + time)
    page.deletePolicy('policy-pod-inform-' + time)
    page.deletePolicy('policy-pod-' + time)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

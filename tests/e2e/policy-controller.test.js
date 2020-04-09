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

  'Policy controller: single object / musthave': (browser) => {
    //const time = browser.globals.time
    const singleMustHaveInform = fs.readFileSync(path.join(__dirname, 'yaml/single_musthave_inform.yaml'))
    var yaml = singleMustHaveInform.toString()
    page.createPolicy(browser, 'policy-pod-single-musthave-inform', yaml)
    browser.pause(15000)
    page.checkViolations('policy-pod-single-musthave-inform', true)
    page.deletePolicy('policy-pod-single-musthave-inform')
    browser.pause(1000)
    const singleMustHaveEnforce = fs.readFileSync(path.join(__dirname, 'yaml/single_musthave_enforce.yaml'))
    yaml = singleMustHaveEnforce.toString()
    page.createPolicy(browser, 'policy-pod-single-musthave-enforce', yaml)
    browser.pause(15000)
    page.checkViolations('policy-pod-single-musthave-enforce', false)
    page.deletePolicy('policy-pod-single-musthave-enforce')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

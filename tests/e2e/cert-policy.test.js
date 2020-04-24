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

  'Cert policy: create issuer and certificate ': (browser) => {
    const time = browser.globals.time
    const testIssuer = fs.readFileSync(path.join(__dirname, 'yaml/create_test_issuer.yaml'))
    var yaml = testIssuer.toString()
    page.createPolicy(browser, 'policy-create-issuer-' + time, yaml, time)
    browser.pause(20000) // Wait for policy to create issuer 20s
    page.checkViolations('policy-create-issuer-' + time, false)
    browser.pause(1000)

    const testCertificate = fs.readFileSync(path.join(__dirname, 'yaml/create_test_certificate.yaml'))
    yaml = testCertificate.toString()
    page.createPolicy(browser, 'policy-create-certificate-' + time, yaml, time)
    browser.pause(20000) // Wait for policy to create certificate 20s
    page.checkViolations('policy-create-certificate-' + time, false)
    page.deletePolicy('policy-create-certificate-' + time)
  },

  'Cert policy: create cert policy and should show violation': (browser) => {
    const time = browser.globals.time
    const certPolicy = fs.readFileSync(path.join(__dirname, 'yaml/create_test_certpolicy.yaml'))
    var yaml = certPolicy.toString()
    page.createPolicy(browser, 'policy-certificatepolicy-' + time, yaml, time)
    browser.pause(30000) // Wait for cert policy to detect violation 30s
    page.checkViolations('policy-certificatepolicy-' + time, true)
  },

  'Cert policy: update certificate and secret': (browser) => {
    const time = browser.globals.time
    const updateCertificate = fs.readFileSync(path.join(__dirname, 'yaml/update_test_certificate.yaml'))
    var yaml = updateCertificate.toString()
    page.createPolicy(browser, 'policy-update-certificate-' + time, yaml, time)
    browser.pause(60000) // Wait for policy to update certificate 30s
    page.checkViolations('policy-update-certificate-' + time, false)
    page.deletePolicy('policy-update-certificate-' + time)
  },

  'Cert policy: cert policy should show compliant': (browser) => {
    const time = browser.globals.time
    page.searchPolicy('policy-certificatepolicy-' + time, true)
    browser.pause(60000) // Wait for cert policy to detect compliant 60s
    page.checkViolations('policy-certificatepolicy-' + time, false)
  },

  'Cert policy: clean up': (browser) => {
    const time = browser.globals.time
    page.deletePolicy('policy-create-issuer-' + time)
    page.deletePolicy('policy-certificatepolicy-' + time)

    const deleteCertificate = fs.readFileSync(path.join(__dirname, 'yaml/delete_test_certificate.yaml'))
    var yaml = deleteCertificate.toString()
    page.createPolicy(browser, 'policy-delete-certificate-' + time, yaml, time)
    browser.pause(30000) // Wait for policy to delete certificate 30s
    page.checkViolations('policy-delete-certificate-' + time, false)
    page.deletePolicy('policy-delete-certificate-' + time)

    const deleteSecret = fs.readFileSync(path.join(__dirname, 'yaml/delete_test_secret.yaml'))
    yaml = deleteSecret.toString()
    page.createPolicy(browser, 'policy-delete-secret-' + time, yaml, time)
    browser.pause(30000) // Wait for policy to delete secret 30s
    page.checkViolations('policy-delete-secret-' + time, false)
    page.deletePolicy('policy-delete-secret-' + time)

    const deleteIssuer = fs.readFileSync(path.join(__dirname, 'yaml/delete_test_issuer.yaml'))
    yaml = deleteIssuer.toString()
    page.createPolicy(browser, 'policy-delete-issuer-' + time, yaml, time)
    browser.pause(30000) // Wait for policy to delete issuer 30s
    page.checkViolations('policy-delete-issuer-' + time, false)
    page.deletePolicy('policy-delete-issuer-' + time)

    page.searchPolicy('policy-create-issuer-' + time, false)
    page.searchPolicy('policy-create-certificate-' + time, false)
    page.searchPolicy('policy-certificatepolicy-' + time, false)
    page.searchPolicy('policy-update-certificate-' + time, false)
    page.searchPolicy('policy-delete-certificate-' + time, false)
    page.searchPolicy('policy-delete-secret-' + time, false)
    page.searchPolicy('policy-delete-issuer-' + time, false)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

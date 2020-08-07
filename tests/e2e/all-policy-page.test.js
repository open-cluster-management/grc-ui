/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

const config = require('../../config')
let page

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    page = browser.page.AllPolicyPage()
  },

  'Create policy page: Verify templates': (browser) => {
    const templates = [
      'CertificatePolicy',
      'IamPolicy',
      'ImageManifestVulnPolicy',
      'LimitRange',
      'Namespace',
      'Pod',
      'PodSecurityPolicy',
      'Role',
      'RoleBinding',
      'SecurityContextConstraints'
    ]
    const time = browser.globals.time
    let policyName = '', templateFile = ''
    templates.forEach(t => {
      policyName = `${time}-${t}-policy-test`
      templateFile = `${t}_template.yaml`
      page.createTestPolicy(false, { policyName: policyName, specification: [t] }, templateFile)
    })
  },

  'Create policy page: Updating YAML in editor': () => {
    page.updateYamlEditor()
  },

  'All policy page: Create, Search, Verify details of policy': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-policy-test`
    const templateFile = 'modifiedIMVP_template.yaml'
    page.createTestPolicy(true, {
      policyName: policyName,
      specification: ['ImageManifestVulnPolicy'],
      standard: ['FISMA'],
      category: ['PR.DS Data Security'],
      control: ['DE.CM-7 Monitoring for unauthorized activity']
    }, templateFile)
    page.searchPolicy(true, policyName)
    page.verifyPolicyTable(policyName, templateFile)
    page.testDetailsPage(policyName, templateFile)
  },

  'All policy page: Verify summary table': (browser) => {
    page.verifySummary(browser, `${browser.launch_url}${config.get('contextPath')}/all`)
  },

  'All policy page: Test pagination': (browser) => {
    page.verifyPagination(browser)
  },

  'All policy page: Delete test policy': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-policy-test`
    page.deletePolicy(policyName, browser)
  }

}

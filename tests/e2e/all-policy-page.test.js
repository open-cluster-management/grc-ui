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
let page, common, loginPage

module.exports = {
  '@disabled': false,

  before: (browser) => {
    loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    page = browser.page.AllPolicyPage()
    common = browser.page.CommonPage()
  },

  'GRC Create policy page: Verify templates': (browser) => {
    const templates = [
      'CertificatePolicy',
      'ComplianceOperator',
      'GatekeeperOperator',
      'IamPolicy',
      'ImageManifestVulnPolicy',
      'LimitRange',
      'Namespace',
      'Pod',
      'PodSecurityPolicy',
      'Role',
      'RoleBinding',
      'SecurityContextConstraints',
      'EtcdEncryption'
    ]
    const time = browser.globals.time
    let policyName = '', templateFile = ''
    templates.forEach(t => {
      policyName = `${time}-${t}-policy-test`
      templateFile = `${t}_template.yaml`
      page.createTestPolicy(false, { policyName: policyName, specification: [t] }, templateFile)
    })
    page.testCreateCustomSelections(templates.slice(0,3))
  },

  'GRC Create policy page: Updating YAML in editor': () => {
    page.updateYamlEditor()
  },

  'GRC All policy page: Create, Search, Verify details of policy': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-policy-test`
    const templateFile = 'modifiedIMVP_template.yaml'
    const policySpec = {
      policyName: policyName,
      specification: ['ImageManifestVulnPolicy'],
      standards: ['FISMA'],
      categories: ['PR.DS Data Security'],
      controls: ['DE.CM-7 Monitoring for Unauthorized Activity']
    }
    page.createTestPolicy(true, policySpec, templateFile)
    common.checkStatus(policyName, true)
    common.searchPolicy(policyName, true)
    page.testFilters(policySpec)
    page.verifyToggle()
    common.searchPolicy(policyName, true)
    page.verifyPolicyTable(policyName, templateFile)
    page.testDetailsPage(policyName, templateFile)
  },

  'GRC All policy page: Verify summary table': (browser) => {
    page.verifySummary(`${browser.launch_url}${config.get('contextPath')}/all`)
  },

  // 'GRC All policy page: Test pagination': (browser) => {
  //   page.verifyPagination(browser)
  // },


  'GRC All policy page: Check nonexistent URLs': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-policy-test`
    const policyNamespace = 'default'

    // Check to make sure pages that don't exist return 'No Resource' and those
    // that do exist can return resources even though extra paths are present:
    //
    // - Cluster name and policy that do exist
    common.noResourceCheck(`/policy/local-cluster/${policyNamespace}.${policyName}`, true)
    common.noResourceCheck(`/policy/local-cluster/${policyNamespace}.${policyName}/a/b/c`, true)
    // - Cluster name and policy that don't exist
    common.noResourceCheck('/policy/not-a-cluster/not-a-policy', false)
    common.noResourceCheck('/policy/not-a-cluster/not-a-policy/a/b/c', false)
    // - Namespace and policy that do exist
    common.noResourceCheck(`/all/${policyNamespace}/${policyName}`, true)
    common.noResourceCheck(`/all/${policyNamespace}/${policyName}/a/b/c`, true)
    common.noResourceCheck(`/all/${policyNamespace}/${policyName}/yaml`, true)
    common.noResourceCheck(`/all/${policyNamespace}/${policyName}/yaml/a/b/c`, true)
    // - Namespace and policy that don't exist
    common.noResourceCheck('/all/not-a-namespace/not-a-policy', false)
    common.noResourceCheck('/all/not-a-namespace/not-a-policy/status', false)
    common.noResourceCheck('/all/not-a-namespace/not-a-policy/yaml', false)
    common.noResourceCheck('/all/not-a-namespace/not-a-policy/other/a/b/c', false)

    // Return to summary page
    loginPage.navigate()
  },

  'GRC All policy page: Delete test policy': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-policy-test`
    common.deletePolicy(policyName)
  },

}

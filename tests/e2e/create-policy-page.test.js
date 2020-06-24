/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = require('../../config')
let page
let standards = [
  'FISMA',
  'HIPAA',
  'NIST',
  'NIST-CSF',
  'PCI']
let categories = [
  'DE.CM Security Continuous Monitoring',
  'PR.AC Identity Management Authentication and Access Control',
  'PR.DS Data Security',
  'PR.IP Information Protection Processes and Procedures',
  'PR.PT Protective Technology']
let controls = [
  'DE.CM-7 Monitoring for unauthorized activity',
  'DE.CM-8 Vulnerability scans',
  'PR.AC-4 Access Control',
  'PR.AC-5 Network Integrity',
  'PR.DS-2 Data-at-rest',
  'PR.DS-2 Data-in-transit',
  'PR.IP-1 Baseline Configuration',
  'PR.PT-1 Audit Logging',
  'PR.PT-3 Least Functionality']

module.exports = {
  '@disabled': false,

  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/all`
    page = browser.page.CreatePolicyPage()
    page.navigate(url)
  },
  'Select and confirm standards': (browser) => {
    standards.forEach(std => {
      let time = browser.globals.time
      let policyName = `${time}-standard-policy-test`
      page.createTestPolicy(policyName, { standard: [std] })
      page.verifyPolicy(true, policyName, { standard: [std] })
      page.deletePolicy(policyName)
    })
  },
  'Select and confirm all standards': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-all-standards-policy-test`
    page.createTestPolicy(policyName, { standard: standards })
    page.verifyPolicy(true, policyName, { standard: standards })
    page.deletePolicy(policyName)
  },
  'Select and confirm categories': (browser) => {
    categories.forEach(cat => {
      let time = browser.globals.time
      let policyName = `${time}-category-policy-test`
      page.createTestPolicy(policyName, { category: [cat] })
      page.verifyPolicy(true, policyName, { category: [cat] })
      page.deletePolicy(policyName)
    })
  },
  'Select and confirm all categories': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-all-categories-policy-test`
    page.createTestPolicy(policyName, { category: categories })
    page.verifyPolicy(true, policyName, { category: categories })
    page.deletePolicy(policyName)
  },
  'Select and confirm controls': (browser) => {
    controls.forEach(cont => {
      let time = browser.globals.time
      let policyName = `${time}-control-policy-test`
      page.createTestPolicy(policyName, { control: [cont] })
      page.verifyPolicy(true, policyName, { control: [cont] })
      page.deletePolicy(policyName)
    })
  },
  'Select and confirm all controls': (browser) => {
    const time = browser.globals.time
    const policyName = `${time}-all-controls-policy-test`
    page.createTestPolicy(policyName, { control: controls })
    page.verifyPolicy(true, policyName, { control: controls })
    page.deletePolicy(policyName)
  }
}
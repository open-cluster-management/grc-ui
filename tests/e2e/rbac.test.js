/* Copyright (c) 2020 Red Hat, Inc. */

const policies = [], namespaces = []
let page, loginPage, createPage, policyName

module.exports = {
  '@disabled': false,

  before: (browser) => {
    page = browser.page.RbacPage()
    createPage = browser.page.AllPolicyPage()
    loginPage = browser.page.LoginPage()
    // Login with cluster admin
    loginPage.navigate()
    loginPage.authenticate()
    // Create policies for RBAC testing and save names for deletion later
    policyName = `rbac-policy-test-${browser.globals.time}`
    const ns = 'e2e-rbac-test'
    for (let i = 1; i <= 2; i++ ) {
      namespaces.push(`${ns}-${i}`)
      policies.push(`${policyName}-${ns}-${i}`)
      createPage.createTestPolicy(true, { policyName: policies[policies.length - 1], namespace: namespaces[namespaces.length - 1] })
    }
    loginPage.logout()
  },

  after: () => {
    loginPage.navigate()
    loginPage.authenticate()
    // Delete created policies
    policies.forEach((policy) => {
      createPage.deletePolicy(policy)
    })
  },

  beforeEach: () => {
    loginPage.navigate()
  },

  afterEach: () => {
    loginPage.logout()
  },

  'Cluster-wide cluster-admin user': () => {
    loginPage.authenticate('e2e-cluster-admin-cluster')
    page.verifyAllTable(policyName, namespaces.length)
  },

  'Cluster-wide admin user': () => {
    loginPage.authenticate('e2e-admin-cluster')
    page.verifyAllTable(policyName, namespaces.length)
  },

  'Cluster-wide edit user': () => {
    loginPage.authenticate('e2e-edit-cluster')
    page.verifyAllTable(policyName, namespaces.length)
  },

  'Cluster-wide view user': () => {
    loginPage.authenticate('e2e-view-cluster')
    page.verifyAllTable(policyName, namespaces.length)
  },

  'Cluster-wide view user in a group': () => {
    loginPage.authenticate('e2e-group-cluster')
    page.verifyAllTable(policyName, namespaces.length)
  },

  'Namespaced cluster-admin user': () => {
    loginPage.authenticate('e2e-cluster-admin-ns')
    page.verifyAllTable(policyName, 1)
  },

  'Namespaced admin user': () => {
    loginPage.authenticate('e2e-admin-ns')
    // This would be 1, but admin user also has view access to namespace 2
    page.verifyAllTable(policyName, 2)
  },

  'Namespaced edit user': () => {
    loginPage.authenticate('e2e-edit-ns')
    page.verifyAllTable(policyName, 1)
  },

  'Namespaced view user': () => {
    loginPage.authenticate('e2e-view-ns')
    page.verifyAllTable(policyName, 1)
  },

  'Namespaced view user in a group': () => {
    loginPage.authenticate('e2e-group-ns')
    page.verifyAllTable(policyName, 1)
  }

}

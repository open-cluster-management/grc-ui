/* Copyright (c) 2020 Red Hat, Inc. */

const policies = [], namespaces = []
let page, loginPage, createPage, policyName
const DISABLE_CANARY_TEST = process.env.DISABLE_CANARY_TEST ? true : false
const permissions = {
  'clusterAdmin': {
    'get': true,
    'patch': true,
    'create': true,
    'delete': true
  },
  'admin': {
    'get': true,
    'patch': true,
    'create': true,
    'delete': true
  },
  'edit': {
    'get': true,
    'patch': true,
    'create': true,//false,
    'delete': true//false
  },
  'view': {
    'get': true,
    'patch': true,//false,
    'create': true,//false,
    'delete': true//false
  },
}

module.exports = {
  '@disabled': DISABLE_CANARY_TEST,

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
    for (let i = 1; i <= 2; i++) {
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
    page.verifyAllPage(policyName, namespaces.length, permissions.clusterAdmin)
    const createdPolicy = `${policyName}-cluster-admin-cluster`
    page.verifyCreatePage(permissions.clusterAdmin, createPage, createdPolicy, namespaces, true)
    createPage.deletePolicy(createdPolicy)
    page.verifyPolicyPage(policyName, permissions.clusterAdmin)
  },

  'Cluster-wide admin user': () => {
    loginPage.authenticate('e2e-admin-cluster')
    page.verifyAllPage(policyName, namespaces.length, permissions.admin)
    const createdPolicy = `${policyName}-admin-cluster`
    page.verifyCreatePage(permissions.admin, createPage, createdPolicy, namespaces, true)
    createPage.deletePolicy(createdPolicy)
    page.verifyPolicyPage(policyName, permissions.admin)
  },

  'Cluster-wide edit user': () => {
    loginPage.authenticate('e2e-edit-cluster')
    page.verifyAllPage(policyName, namespaces.length, permissions.edit)
    page.verifyCreatePage({ create: false })//permissions.edit) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.edit)
  },

  'Cluster-wide view user': () => {
    loginPage.authenticate('e2e-view-cluster')
    page.verifyAllPage(policyName, namespaces.length, permissions.view)
    page.verifyCreatePage({ create: false })//permissions.view) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.view)
  },

  'Cluster-wide view user in a group': () => {
    loginPage.authenticate('e2e-group-cluster')
    page.verifyAllPage(policyName, namespaces.length, permissions.view)
    page.verifyCreatePage({ create: false })//permissions.view) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.view)
  },

  'Namespaced cluster-admin user': () => {
    loginPage.authenticate('e2e-cluster-admin-ns')
    page.verifyAllPage(policyName, 1, permissions.clusterAdmin)
    const createdPolicy = `${policyName}-cluster-admin-ns`
    page.verifyCreatePage(permissions.clusterAdmin, createPage, createdPolicy, [namespaces[0]], false)
    createPage.deletePolicy(createdPolicy)
    page.verifyPolicyPage(policyName, permissions.clusterAdmin)
  },

  'Namespaced admin user': () => {
    loginPage.authenticate('e2e-admin-ns')
    // This would be 1, but admin user also has view access to namespace 2
    page.verifyAllPage(policyName, 2, permissions.admin)
    const createdPolicy = `${policyName}-admin-ns`
    // The ns array would only be namespace 1 but user also has view access to ns 2
    page.verifyCreatePage(permissions.admin, createPage, createdPolicy, namespaces, false, true)
    createPage.deletePolicy(createdPolicy)
    // Verify view permissions for this user by filtering for the specific policy
    page.verifyAllPage(`${policyName}-${namespaces[1]}`, 1, permissions.view)
    page.verifyPolicyPage(policyName, permissions.admin)
  },

  'Namespaced edit user': () => {
    loginPage.authenticate('e2e-edit-ns')
    page.verifyAllPage(policyName, 1, permissions.edit)
    page.verifyCreatePage({ create: false })//permissions.edit) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.edit)
  },

  'Namespaced view user': () => {
    loginPage.authenticate('e2e-view-ns')
    page.verifyAllPage(policyName, 1, permissions.view)
    page.verifyCreatePage({ create: false })//permissions.view) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.view)
  },

  'Namespaced view user in a group': () => {
    loginPage.authenticate('e2e-group-ns')
    page.verifyAllPage(policyName, 1, permissions.view)
    page.verifyCreatePage({ create: false })//permissions.view) // TODO: Restore permissions
    page.verifyPolicyPage(policyName, permissions.view)
  }

}

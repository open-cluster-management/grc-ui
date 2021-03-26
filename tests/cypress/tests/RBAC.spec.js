/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

/// <reference types="cypress" />

import { describeT } from '../support/tagging'
import { getConfigObject } from '../config'
import { test_userPermissionsPageContentCheck } from '../common/tests'


describeT('@rbac RHACM4K-2584 - GRC UI: [P1][Sev1][policy-grc] Role Based Access Control tests', () => {

  // we expect the user password to be exported in CYPRESS_RBAC_PASS variable
  const RBACpass = Cypress.env('RBAC_PASS')
  const IDP = Cypress.env('OC_IDP') || 'e2e-htpasswd'
  const confPolicies = getConfigObject('RBAC/policy-config.yaml')
  const permissions = getConfigObject('RBAC/permissions.json')
  const policyNames = Object.keys(confPolicies)
  const policyNamesNS1 = ['rbac-policy-test-e2e-rbac-test-1']

  it('Verify that CYPRESS_RBAC_PASS environment variable is defined', () => {
    expect(RBACpass).to.not.equal(undefined)
  })

  it('Create policies used for the testing', () => {

    for (const policyName in confPolicies) {
      cy.FromGRCToCreatePolicyPage()
        .createPolicyFromSelection(policyName, true, confPolicies[policyName])
    }
    for (const policyName in confPolicies) {
      cy.waitForPolicyStatus(policyName)
    }

  })

  it('Logout', () => {
    cy.logout()
  })

  test_userPermissionsPageContentCheck('e2e-cluster-admin-cluster', RBACpass, IDP, policyNames, confPolicies, permissions['clusterAdmin'], false, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-admin-cluster', RBACpass, IDP, policyNames, confPolicies, permissions['admin'], false, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-edit-cluster', RBACpass, IDP, policyNames, confPolicies, permissions['edit'], false, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-view-cluster', RBACpass, IDP, policyNames, confPolicies, permissions['view'], false, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-group-cluster', RBACpass, IDP, policyNames, confPolicies, permissions['view'], false, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-cluster-admin-ns', RBACpass, IDP, policyNamesNS1, confPolicies, permissions['clusterAdmin'], true, false, 'e2e-rbac')

  // This would be 1 policy, but admin user also has view access to namespace 2
  // Verify admin permissions for this user by filtering for the specific policy
  test_userPermissionsPageContentCheck('e2e-admin-ns', RBACpass, IDP, policyNamesNS1, confPolicies, permissions['admin'], true, false, 'rbac-test-1')

  test_userPermissionsPageContentCheck('e2e-edit-ns', RBACpass, IDP, policyNamesNS1, confPolicies, permissions['edit'], true, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-view-ns', RBACpass, IDP, policyNamesNS1, confPolicies, permissions['view'], true, false, 'e2e-rbac')

  test_userPermissionsPageContentCheck('e2e-group-ns', RBACpass, IDP, policyNamesNS1, confPolicies, permissions['view'], true, false, 'e2e-rbac')

  it('Login again as kubeadmin', () => {
    cy.login()
  })

  it('Remove test policies', () => {
    for (const policyName in confPolicies) {
      cy.actionPolicyActionInListing(policyName, 'Remove')
        .verifyPolicyNotInListing(policyName)
    }
  })

})

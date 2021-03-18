/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

/// <reference types="cypress" />

import { getConfigObject } from '../config'

// the function does check the content of the /multicloud/policies/all page with respect to the user permissions
// arguments:
//   policyNames = array of policy names that are expected to be found
//   confPolicies = dictionary storing policy configurations where policyName is a key
//   permissions = user permissions
//   elevated = true if a user has multiple permissions for different namespaces and Create policy button should be enabled
//   searchFilter = filter to be used in the Search field to limit the scope of a test
export const action_checkPolicyListingPageUserPermissions = (policyNames = [], confPolicies = {}, permissions = {}, elevated = false, searchFilter='') => {

 const policyCount = policyNames.length

  // check whether Create button is enabled/disabled
  const createBtnState = permissions.create || elevated ? 'enabled' : 'disabled'
  cy.get('#create-policy').should(`be.${createBtnState}`)

  // check policy listing
  if (policyCount > 0) {
    // there should be policies listed let's check them
    // enter the filter first
    cy.doTableSearch(searchFilter)  // clears the search eventually
    // check total number of policies listed
    cy.get('div.pf-c-pagination').find('b').last().contains(new RegExp(`^${policyCount}$`))
    // check each policy is listed
    for (const policyName of policyNames) {
      cy.verifyPolicyInListing(policyName, confPolicies[policyName])
    }
    // check Actions menu for the first policy
   cy.doTableSearch(policyNames[0])
   // all users should be able to click the Action button
   cy.get('.grc-view-by-policies-table').within(() => {  // click the Action button
      cy.get('button[aria-label="Actions"]').first().click()
        .then(() => {
          for (const action of ['Edit', 'Disable', 'Enforce']) {
            if (permissions.patch) {
              cy.get('button.pf-c-dropdown__menu-item').contains(action, { matchCase: false }).should('be.enabled')
            } else {
              cy.get('button.pf-c-dropdown__menu-item').contains(action, { matchCase: false }).parent().should('be.disabled')
            }
          }
          if (permissions.delete) {
            cy.get('button.pf-c-dropdown__menu-item').contains('Remove', { matchCase: false }).should('be.enabled')
          } else {
            cy.get('button.pf-c-dropdown__menu-item').contains('Remove', { matchCase: false }).parent().should('be.disabled')
          }
        })
        // close the menu again
        cy.get('button[aria-label="Actions"]').first().click()
      })

  } else if (searchFilter) {
    // some policies should be filtered out
    cy.doTableSearch(searchFilter)
      .get('h2.pf-c-title').contains('No results found')
  } else {
    // no policies should be listed at all
    cy.checkPolicyNoResourcesIconMessage(false, 'No policies found')
    // check whether Create button below is enabled/disabled
    const createBtnState = permissions.create || elevated ? 'enabled' : 'disabled'
    cy.get('#create-resource').should(`be.${createBtnState}`)
  }
  cy.clearTableSearch()

}


// the command does check the content of the /multicloud/policies/all page with respect to the user permissions
// arguments:
//   policyNames = array of policy names that are expected to be found
//   confPolicies = dictionary storing policy configurations where policyName is a key
//   permissions = user permissions
//   searchFilter = filter to be used in the Search field to limit the scope of a test
Cypress.Commands.add('checkPolicyListingPageUserPermissions', (policyNames = [], confPolicies = {}, permissions = {}, elevated = false, searchFilter='') => {
  action_checkPolicyListingPageUserPermissions(policyNames, confPolicies, permissions, elevated, searchFilter)
})

// visit the policy details page, either through a link from a policy table or directly through URL
// does not clearTableSearch so you need to do it later eventually
Cypress.Commands.add('fromGRCToPolicyDetailsPage', (policyName) => {
  cy.doTableSearch(policyName)
    .get('.grc-view-by-policies-table').within(() => {
      cy.get('a').contains(new RegExp(`^${policyName}$`)).click()
    })
})

// the command does check the content of the /multicloud/policies/all/${namespace}/${policyName} page with respect to the user permissions
// checks that PlacementRule and PlacementBinding Edit buttons are enabled/disabled accordingly
Cypress.Commands.add('checkDetailedPolicyPageUserPermissions', (policyName, permissions) => {
  const btnState = permissions.patch ? 'enabled' : 'disabled'
  // need to search for button this way since disabled button is wrapped in an extra <div>
  cy.get('h1').contains('Placement rule').parent().find('button').then($button => {
      cy.wrap($button).should(`be.${btnState}`)
    })
    .get('h1').contains('Placement binding').parent().find('button').then($button => {
       cy.wrap($button).should(`be.${btnState}`)
    })
})

// the command does check controls availability at the Status tab of /multicloud/policies/all/${namespace}/${policyName}
// page with respect to the user permissions
// works both for Clusters and Templates tabs, you just need to set messageColumnIndex accordingly (4 for Clusters, 3 for templates)
Cypress.Commands.add('checkPolicyStatusPageUserPermissions', (policyName, permissions, namespaced, messageColumnIndex=4) => {
  if (namespaced) {  // not permitted to see the content
    cy.checkPolicyNoResourcesIconMessage(false, 'No policy status found')
  } else {
    // The "View details" link should be disabled with a tooltip since it requires
    // permissions to create a managedClusterView
    cy.get('table[aria-label="Sortable Table"]').each(($table) => {  // for each table, on templates tab there could be more
      cy.wrap($table).within(() => {
        cy.get('tbody').find('tr').each(($row) => {  // for each table row
          cy.wrap($row).find('td').then(columns => {  // get all columns
            if (permissions.create) {
              cy.wrap(columns[messageColumnIndex-1]).contains('View details').should('have.attr', 'href')
            } else {
              cy.wrap(columns[messageColumnIndex-1]).contains('View details').should('have.class', 'link-disabled')
            }
          })
        })
      })
    })
  }
})

// does check controls availability at the YAML Editor tab of /multicloud/policies/all/${namespace}/${policyName} page
// with respect to the user permissions
Cypress.Commands.add('checkPolicyYAMLPageUserPermissions', (permissions) => {
  const btnState = permissions.patch ? 'enabled' : 'disabled'
  cy.get('#edit-button').should(`be.${btnState}`)
  cy.get('#submit-button').should(`be.${btnState}`)
})

//   userName - user to use when logging
//   userPassword - password to use when logging
//   IDP - IDP to use when logging
//   policyNames = array of policy names that are expected to be found
//   confPolicies = dictionary storing policy configurations where policyName is a key
//   permissions = user permissions
//   namespaced = true if the user namespaced
//   elevated = true if a user has multiple permissions for different namespaces and Create policy button should be enabled
//   searchFilter = filter to be used in the Search field to limit the scope of a test
export const test_userPermissionsPageContentCheck = (userName, userPassword, IDP, policyNames, confPolicies, permissions, namespaced, elevated, searchFilter) => {

  it(`Login ${userName} user`, () => {
    cy.login(userName, userPassword, IDP)
  })

  it(`Check All policies listing page content as ${userName}`, () => {
    cy.checkPolicyListingPageUserPermissions(policyNames, confPolicies, permissions, elevated, searchFilter)
  })

  // check policy details only if there are policies available
  // TODO: maybe we should also check that we are not able to access details through URL for policy we are not allowed
  if (policyNames.length > 0) {
    const firstPolicyName = policyNames[0]

    it(`Check detailed ${firstPolicyName} policy page as ${userName}`, () => {
      // search for policy in the Listing
      cy.fromGRCToPolicyDetailsPage(firstPolicyName).waitForPageContentLoad()
        .verifyPolicyInPolicyDetails(firstPolicyName, confPolicies[firstPolicyName])  // do a basic content check
        .checkDetailedPolicyPageUserPermissions(firstPolicyName, permissions)
    })

    it(`Check ${firstPolicyName} policy Status page as ${userName}`, () => {
      // click on Status tab
      cy.get('#status-tab').contains('Status').click().waitForPageContentLoad()
        // check permissions
        .checkPolicyStatusPageUserPermissions(firstPolicyName, permissions, namespaced)
        // check Templates tab only for a non-namespaced user
        .then(() => {
          if (!namespaced) {
            // click on Templates tab
            cy.get('#policy-status-templates').click().waitForPageContentLoad()
              .checkPolicyStatusPageUserPermissions(firstPolicyName, permissions, namespaced, 3)
          }
        })
    })

    it(`Check ${firstPolicyName} policy YAML Editor page as ${userName}`, () => {
      // click on YAML tab
      cy.get('#yaml-tab').contains('YAML').click().waitForPageContentLoad()
        .checkPolicyYAMLPageUserPermissions(permissions)
    })

  }

  it(`Logout ${userName} user`, () => {
    // go back to policy listing and clear table search
    //cy.visit('/multicloud/policies/all').waitForPageContentLoad()
    //  .clearTableSearch()
    cy.logout()
  })

}

describe('Role Based Access Control tests', () => {

  // we expect the user password to be exported in CYPRESS_RBAC_PASS variable
  const RBACpass = Cypress.env('RBAC_PASS')
  const IDP = 'e2e-htpasswd'
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

  it('Logout as kube-admin', () => {
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

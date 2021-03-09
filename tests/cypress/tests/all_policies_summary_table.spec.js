/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { getConfigObject } from '../config'

describe('RHACM4K-2343 - [P1][Sev1][policy-grc] All policies page: Verify summary table', () => {

  const confClusters = getConfigObject('clusters.yaml')
  const clusterCount = Object.keys(confClusters).length
  const substitutionRules = [ [/\[ID\]/g, Cypress.env('RESOURCE_ID')] ]
  // policy-config is used for policy creation and validation
  const confPolicies = getConfigObject('all_policies_summary_table/policy-config.yaml', 'yaml', substitutionRules)

  // first check there are no policies, otherwise numbers won't match
  it('Verify there are no policies present', () => {
    cy.get('div.no-resource')  // there should be no-resource element
      .get('.grc-view-by-policies-table').should('not.exist')  // there should not be policy table
  })

  // create all three policies
  for (const policyName in confPolicies) {
    it(`Create new policy ${policyName} using the form`, () => {
      cy.FromGRCToCreatePolicyPage()
        .createPolicyFromSelection(policyName, true, confPolicies[policyName])
        .verifyPolicyInListing(policyName, confPolicies[policyName])
    })
  }

  // wait for policy statuses to become available
  for (const policyName in confPolicies) {
    it(`Wait for policy ${policyName} status to become available`, () => {
      cy.waitForPolicyStatus(policyName)
    })
  }

  // verify toggle button
  it('Verify toggle button does work', () => {
    cy.toggleVisibilityButton('#summary-toggle', 'dd.grc-cards-container')
      .get('dd.grc-cards-container').should('not.be.visible')
      .toggleVisibilityButton('#summary-toggle', 'dd.grc-cards-container')
      .get('dd.grc-cards-container').should('be.visible')
  })

  // verify the actual card content
  it('Verify the content of Standards card', () => {
    const violationCounters = {
      'NIST-CSF': [`${clusterCount}/${clusterCount}`, `${2*clusterCount}/${2*clusterCount}`],
      'FISMA': [`${clusterCount}/${clusterCount}`, `${clusterCount}/${clusterCount}`]
    }
    cy.verifyCardsOnPolicyListingPage('Standards', violationCounters)
  })

  it('Verify the content of Categories card', () => {
    const violatonCounters = {
      'PR.AC Identity Management and Access Control': [`${clusterCount}/${clusterCount}`, `${clusterCount}/${clusterCount}`],
      'PR.DS Data Security': [`${clusterCount}/${clusterCount}`, `${clusterCount}/${clusterCount}`],
      'PR.IP Information Protec...rocesses and Procedures': [`${clusterCount}/${clusterCount}`, `${clusterCount}/${clusterCount}`],
    }
    cy.verifyCardsOnPolicyListingPage('Categories', violatonCounters)
  })

  // delete created policies at the end
  for (const policyName in confPolicies) {
    it(`Policy ${policyName} can be deleted in the policy listing`, () => {
      // we could use a different way how to return to this page
      cy.actionPolicyActionInListing(policyName, 'Remove')
        .verifyPolicyNotInListing(policyName)
    })
  }

})

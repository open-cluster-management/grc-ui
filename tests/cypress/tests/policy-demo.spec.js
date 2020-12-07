/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import {
  createPolicy, verifyPolicyInListing, verifyPolicyNotInListing,
  actionPolicyActionInListing
} from '../views/policy'
import { getUniqueResourceName } from '../scripts/utils'
import { getConfigObject } from '../config'


//const { policies } = JSON.parse(Cypress.env('TEST_CONFIG_DEMO'))
const { policies } = getConfigObject('demo')

describe('Policy can be created and deleted', () => {
  for (const name in policies) {
    const policyDetails = policies[name]
    const frname = getUniqueResourceName(name)

    it (`Can create new policy ${frname}`, () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicy({ name, create:true, ...policyDetails})
    })

    it(`Policy ${frname} is present in the policy listing`, () => {
      verifyPolicyInListing({ name, ...policyDetails})
    })

    it('Policy status becomes available', () => {
      // cy.visit(`/multicloud/policies/all/${policies[name]['namespace']}/${frname}`)
      // or cy.visit('/multicloud/policies/all')
      // both pages should be supported
      cy.waitForPolicyStatus(name)
    })

    it('Disable policy', () => {
      actionPolicyActionInListing(name, 'Disable')
    })

    it('Check disabled policy', () => {
      verifyPolicyInListing({ name, ...policyDetails}, 'disabled', 3)
    })

    it('Enable policy', () => {
      actionPolicyActionInListing(name, 'Enable')
    })

    it('Check enabled policy', () => {
      verifyPolicyInListing({ name, ...policyDetails}, 'enabled', 1)
    })

    it('Enforce policy', () => {
      actionPolicyActionInListing(name, 'Enforce')
    })

    it('Check enforced policy', () => {
      policyDetails.enforce = true
      policyDetails.inform = false
      verifyPolicyInListing({ name, ...policyDetails})
    })

    it('Inform policy', () => {
      actionPolicyActionInListing(name, 'Inform')
    })

    it('Check informed policy', () => {
      policyDetails.enforce = false
      policyDetails.inform = true
      verifyPolicyInListing({ name, ...policyDetails})
    })

    it(`Policy ${frname} can be deleted in the policy listing`, () => {
      actionPolicyActionInListing(name, 'Remove')
    })

    it(`Deleted policy ${frname} is not present in the policy listing`, () => {
      verifyPolicyNotInListing(name)
    })
  }
})

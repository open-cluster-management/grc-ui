/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

import { pageLoader } from '../views/common'
import { createPolicy, verifyPolicyInListing, verifyPolicyNotInListing, deletePolicyInListing } from '../views/policy'
import { formatResourceName } from '../scripts/utils'
import { getConfigObject } from '../config'


//const { policies } = JSON.parse(Cypress.env('TEST_CONFIG_DEMO'))
const { policies } = getConfigObject('demo')

describe('Policy can be created and deleted', () => {
  for (const name in policies) {
    const policyDetails = policies[name]
    const frname = formatResourceName(name)

    it (`Can create new policy ${frname}`, () => {
      cy.visit('/multicloud/policies/create')
      pageLoader.shouldNotExist()
      createPolicy({ name, create:true, ...policyDetails})
    })

    it ('Redirects browser to a page with policy listing', () => {
      cy.location('pathname').should('eq', '/multicloud/policies/all')
      pageLoader.shouldNotExist()
    })

    it(`Policy ${frname} is present in the policy listing`, () => {
      cy.visit('/multicloud/policies/all')
      verifyPolicyInListing({ name, ...policyDetails})
    })

    it('Policy status becomes available', () => {
      cy.visit(`/multicloud/policies/all/${policies[name]['namespace']}/${frname}`)
      // or
      // cy.visit('/multicloud/policies/all')
      // both pages should be supported
      cy.waitForPolicyStatus(name)
        //.wait(3000)  // just to give user some time to see the change
    })

    it(`Policy ${frname} can be deleted in the policy listing`, () => {
      cy.visit('/multicloud/policies/all')
      deletePolicyInListing(name)
    })

    it(`Deleted policy ${frname} is not present in the policy listing`, () => {
      cy.visit('/multicloud/policies/all')
      verifyPolicyNotInListing(name)
    })
  }
})

/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

import { pageLoader } from '../views/common'
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

    it ('Redirects browser to a page with policy listing', () => {
      cy.CheckGrcMainPage()
    })

    it(`Policy ${frname} is present in the policy listing`, () => {
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
      actionPolicyActionInListing(name, 'Remove')
    })

    it(`Deleted policy ${frname} is not present in the policy listing`, () => {
      cy.visit('/multicloud/policies/all')
      verifyPolicyNotInListing(name)
    })
  }
})

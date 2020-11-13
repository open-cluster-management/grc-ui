/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2020. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

/// <reference types="cypress" />

import { pageLoader } from '../views/common'
import { createPolicy, verifyPolicyListing } from '../views/policy'
import { formatResourceName } from '../scripts/utils'

const { policies } = JSON.parse(Cypress.env('TEST_CONFIG'))

describe('Clusters', () => {

  it ('/policies/all page should load', () => {
    cy.visit('/multicloud/policies/all')
      .then(() => { pageLoader.shouldNotExist()
    })
  })

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
      verifyPolicyListing({ name, ...policyDetails})
    })

  }
})

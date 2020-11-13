/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />


import { pageLoader, selectItems } from './common'
import { formatResourceName } from '../scripts/utils'

export const createPolicy = ({ name, create=false, ...policyConfig }) => {
  name = formatResourceName(name)
  // fill the form
  // name
  cy.get('input[aria-label="name"]')
    .clear()
    .type(name)
  // namespace
  cy.get('.bx--dropdown[aria-label="Choose an item"]')
    .click()
    .contains(policyConfig['namespace'])
    .click()
  //specs
    .then(() => {
      selectItems(policyConfig['specifications'], '.bx--multi-select[aria-label="specs"]')
    })
  // cluster binding
    .then(() => {
      selectItems(policyConfig['cluster_binding'], '.bx--multi-select[aria-label="clusters"]', )
    })
  // standards
    .then(() => {
      selectItems(policyConfig['standards'], '.bx--multi-select[aria-label="standards"]', )
    })
  // categories
    .then(() => {
      selectItems(policyConfig['categories'], '.bx--multi-select[aria-label="categories"]', )
    })
  // controls
    .then(() => {
      selectItems(policyConfig['controls'], '.bx--multi-select[aria-label="controls"]', )
    })
  // enforce
    .then(() => {
      if (policyConfig['enforce']) {
        cy.get('input[aria-label="enforce"][type="checkbox"]')
          .next('label')
          .click()
      }
    })
  // disable
    .then(() => {
      if (policyConfig['disable']) {
        cy.get('input[aria-label="disabled"][type="checkbox"]')
          .next('label')
          .click()
      }
    })
  // create
    .then(() => {
      if (create) {
        cy.get("#create-button-portal-id-btn").click()
      }
    })
}



export const verifyPolicyListing = ({ name, create=false, ...policyConfig }) => {
  name = formatResourceName(name)
  cy.get('#table-container').within(() => {
    cy.get(`tr[data-row-name="${name}"]>td`).as('cells')
    cy.get('@cells').spread((dropdown, policyname, namespace, remediation, violations, standards, categories, controls) => {
      // policy nanme
      cy.wrap(policyname).contains(name)
      // namespace
      cy.wrap(namespace).contains(policyConfig['namespace'])
      // enforce/inform
      if (policyConfig['enforce']) {
        cy.wrap(remediation).contains('enforce')
      } else {
        cy.wrap(remediation).contains('inform')
      }
      // standard
      for (let std of policyConfig['standards']) {
        // replace() below is a workaround for bz#1896399
        cy.wrap(standards).contains(std.replace(/[\.\-]/g, ' '))
      }
      // categories
      for (let cat of policyConfig['categories']) {
        // replace() below is a workaround for bz#1896399
        cy.wrap(categories).contains(cat.replace(/[\.\-]/g, ' '))
      }
      // controls
      for (let ctl of policyConfig['controls']) {
        // replace() and matchCase:false below is a workaround for bz#1896399
        cy.wrap(controls).contains(ctl.replace(/[\.\-]/g, ' '), { matchCase: false})
      }
    })
  })
}

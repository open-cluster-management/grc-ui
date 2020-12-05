/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { selectItems } from './common'
import { getUniqueResourceName } from '../scripts/utils'

export const createPolicy = ({ name, create=false, ...policyConfig }) => {
  name = getUniqueResourceName(name)
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
        cy.get('#create-button-portal-id-btn').click()
      }
    })

    // after creation, always return to grc main page
    cy.CheckGrcMainPage()
}

export const verifyPolicyInListing = ({ name, ...policyConfig }) => {
  name = getUniqueResourceName(name)
  cy.get('.grc-view-by-policies-table').within(() => {
    cy.get('a').contains(name).parents('td').siblings('td').spread((namespace, remediation, violations, standards, categories, controls) => {
      // namespace
      if (policyConfig['namespace']) {
        cy.wrap(namespace).contains(policyConfig['namespace'])
      }
      // enforce/inform
      if (policyConfig['enforce']) {
        cy.wrap(remediation).contains('enforce', { matchCase: false })
      } else {
        cy.wrap(remediation).contains('inform', { matchCase: false })
      }
      // standard
      if (policyConfig['standards']) {
        for (const std of policyConfig['standards']) {
          // replace() below is a workaround for bz#1896399
          cy.wrap(standards).contains(std.replace(/[.-]/g, ' '))
        }
      }
      // categories
      if (policyConfig['categories']) {
        for (const cat of policyConfig['categories']) {
          // replace() below is a workaround for bz#1896399
          cy.wrap(categories).contains(cat.replace(/[.-]/g, ' '))
        }
      }
      // controls
      if (policyConfig['controls']) {
        for (const ctl of policyConfig['controls']) {
          // replace() and matchCase:false below is a workaround for bz#1896399
          cy.wrap(controls).contains(ctl.replace(/[.-]/g, ' '), { matchCase: false})
        }
      }
    })
  })
}

export const verifyPolicyNotInListing = (name) => {
  name = getUniqueResourceName(name)
  // either there are no policies at all or there are some policies listed
  if (!Cypress.$('#page').find('div.no-resouce'.length)) {
    cy.get('.grc-view-by-policies-table').within(() => {
      cy.get('a')
        .contains(name)
        .should('not.exist')
    })
  }
}

export const actionPolicyActionInListing = (name, action, cancel=false) => {
  name = getUniqueResourceName(name)
  cy.get('.grc-view-by-policies-table').within(() => {
    cy.get('a')
      .contains(name)
      .parents('td')
      .siblings('td')
      .last()
      .click()
  })
  .then(() => {
    cy.get('button').contains(action, { matchCase: false }).click()
  })
  .then(() => {
    cy.get('.bx--modal-container').within(() => {
      if (cancel) {
        cy.get('button').contains('Cancel', { matchCase: false })
          .click()
      } else {
        cy.get('button').contains(action, { matchCase: false })
          .click()
      }
    })
  })

  // after mainpage table action, always return to grc main page
  cy.CheckGrcMainPage()
}

// needs to be run either at /multicloud/policies/all or /multicloud/policies/all/{namespace}/{policy} page
// here statusPending = true to check consist pending status for disable policy
export const isPolicyStatusAvailable = (name, statusPending=false) => {
  name = getUniqueResourceName(name)
  // page /multicloud/policies/all
  if (window.location.toString().endsWith('/multicloud/policies/all')) {
    return cy.get('.grc-view-by-policies-table').within(() => {
    cy.get('a').contains(name).parents('td').siblings('td').spread((namespace, remediation, violations) => {
      // check the violation status
      cy.wrap(violations).find('path').then((elems) => {
        if (elems.length === 1) {
          const d = elems[0].getAttribute('d')
          // M569 seem to be unique to an icon telling that policy status is not available for some cluster
          statusPending = !d.startsWith('M569')
        }
      })
    })
  })
  .then(() => statusPending)
  } else { // other pages
    return cy.get('.violationCell').spread((violations) => {
      // check the violation status
      cy.wrap(violations).find('path').then((elems) => {
        if (elems.length == 1) {
          const d = elems[0].getAttribute('d')
          // M569 seem to be unique to an icon telling that policy status is not available for some cluster
          statusPending = !d.startsWith('M569')
        }
      })
    })
    .then(() => statusPending)
  }
}

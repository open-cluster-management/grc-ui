/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { selectItems } from './common'

export const createPolicyFromYAML = (uPolicyName, policyYAML, create=false) => {
  let label = '[]'
  if (process.env.MANAGED_CLUSTER_NAME !== undefined) {
    label = `- {key: name, operator: In, values: ["${process.env.MANAGED_CLUSTER_NAME}"]}`
  }
  const formattedYAML = policyYAML.replace(/\[LABEL\]/g, label).replace(/\[UNAME\]/g, uPolicyName)
  console.log(formattedYAML)
  cy.toggleYAMLeditor('On')
    .YAMLeditor()
    .invoke('getValue')
    .should('contain', 'apiVersion: policy.open-cluster-management.io/v1')
    .toggleYAMLeditor('Off')
    .toggleYAMLeditor()
    .YAMLeditor()
    .invoke('setValue', formattedYAML)
    // create
    .then(() => {
      if (create) {
        cy.get('#create-button-portal-id-btn').click()
      }
    })
    // after creation, always return to grc main page
    cy.CheckGrcMainPage()
}

// this function is mainly used to testing selection on the create policy page
export const createPolicyFromSelection = ({ uPolicyName, create=false, ...policyConfig }) => {
  // fill the form uName
  cy.get('input[aria-label="name"]')
    .clear()
    .type(uPolicyName)
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

// enabled='enabled', checking if policy is enabled; enabled='disabled', checking if policy is disabled
// targetStatus = 0, don't check policy status; targetStatus = 1, check policy status is non-violation
// targetStatus = 2, check policy status is violation; targetStatus = 3, check policy status is pending
export const verifyPolicyInListing = (uName, policyConfig, enabled='enabled', targetStatus=0) => {
  cy.get('.grc-view-by-policies-table').within(() => {
    console.log(uName)
    cy.log(uName)
    cy.get('a').contains(uName).parents('td').siblings('td')
    .spread((namespace, remediation, violations, standards, categories, controls) => {
      // check namespace
      if (policyConfig['namespace']) {
        cy.wrap(namespace).contains(policyConfig['namespace'].trim(), { matchCase: false })
      }
      // check enforce/inform
      if (policyConfig['enforce']) {
        cy.wrap(remediation).contains('enforce', { matchCase: false })
      } else {
        cy.wrap(remediation).contains('inform', { matchCase: false })
      }
      if (targetStatus === 1 || targetStatus === 2 || targetStatus === 3) {
        // check the violation status
        cy.wrap(violations).find('svg').then((elems) => {
          if (elems.length === 1) {
            const filledColor = elems[0].getAttribute('fill').trim().toLowerCase()
            switch(targetStatus) {
              case 1: // 467f40 is the unique non-volation status color
                filledColor === '#467f40'
                break
              case 2: // c9190b is the unique violation status color
                filledColor === '#c9190b'
                break
              case 3:
              default: // f0ab00 is the unique pending status color
                filledColor === '#f0ab00'
                break
            }
          }
        })
      }
      // check standard
      if (policyConfig['standards']) {
        for (const std of policyConfig['standards']) {
          // replace() below is a workaround for bz#1896399
          cy.wrap(standards).contains(std.trim(), { matchCase: false})
        }
      }
      // check categories
      if (policyConfig['categories']) {
        for (const cat of policyConfig['categories']) {
          // replace() below is a workaround for bz#1896399
          cy.wrap(categories).contains(cat.trim(), { matchCase: false})
        }
      }
      // check controls
      if (policyConfig['controls']) {
        for (const ctl of policyConfig['controls']) {
          // replace() and matchCase:false below is a workaround for bz#1896399
          cy.wrap(controls).contains(ctl.trim(), { matchCase: false})
        }
      }
    })

    if (enabled.toLowerCase() === 'disabled') { // check disabled policy
      cy.get('a')
      .contains(uName)
      .siblings('span')
      .contains('disabled', { matchCase: false })
      .then(() => {
        isPolicyStatusAvailable(uName, true)
      })
    } else { // check enabled policy
      cy.get('a')
        .contains(uName)
        .siblings('span')
        .should('not.exist')
    }
  })
}

export const verifyPolicyNotInListing = (uName) => {
  // either there are no policies at all or there are some policies listed
  if (!Cypress.$('#page').find('div.no-resouce'.length)) {
    cy.get('.grc-view-by-policies-table').within(() => {
      cy.get('a')
        .contains(uName)
        .should('not.exist')
    })
  }
}

export const actionPolicyActionInListing = (uName, action, cancel=false) => {
  cy.CheckGrcMainPage()
  cy.get('.grc-view-by-policies-table').within(() => {
    cy.get('a')
      .contains(uName)
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
export const isPolicyStatusAvailable = (uName, statusPending=false) => {
  // page /multicloud/policies/all
  if (window.location.toString().endsWith('/multicloud/policies/all')) {
    return cy.get('.grc-view-by-policies-table').within(() => {
    cy.get('a').contains(uName).parents('td').siblings('td').spread((namespace, remediation, violations) => {
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

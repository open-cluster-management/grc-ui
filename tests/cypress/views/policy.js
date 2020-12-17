/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { selectItems } from './common'

const timestampRegexp = /^(an?|[0-9]+) (days?|hours?|minutes?|few seconds) ago$/

export const getDefaultSubstitutionRules = (uName) => {
  let label = '[]'
  let timestamp = ''
  if (process.env.MANAGED_CLUSTER_NAME !== undefined) {
    label = `- {key: name, operator: In, values: ["${process.env.MANAGED_CLUSTER_NAME}"]}`
  }
  if (Cypress.env('RESOURCE_ID')) {
    timestamp = Cypress.env('RESOURCE_ID')
  }
  const substitutions = [
      [ /\[LABEL\]/g, label ],
      [ /\[UNAME\]/g, uName ],
      [ /\[TIME\]/g, timestamp ]
  ]
  return substitutions
}

export const createPolicyFromYAML = (policyYAML, create=false) => {
  console.log(policyYAML)
  cy.toggleYAMLeditor('On')
    .YAMLeditor()
    .invoke('setValue', policyYAML)
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
export const verifyPolicyInListing = (
  uName, policyConfig, enabled='enabled',
  targetStatus=0, violationsCounter=''
  ) => {
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
      // check the violation status
      if ([1,2,3].includes(targetStatus)) {
        cy.wrap(violations).find('svg').then((elems) => {
          if (elems.length === 1) {
            getStatusIconFillColor(targetStatus) === elems[0].getAttribute('fill').trim().toLowerCase()
          }
        })
      }
      // check the cluster violations value
      if (violationsCounter) {
        cy.wrap(violations.textContent).should('match', new RegExp('^'+violationsCounter+'$'))
      }
      // check standard
      if (policyConfig['standards']) {
        for (const std of policyConfig['standards']) {
          cy.wrap(standards).contains(std.trim())
        }
      }
      // check categories
      if (policyConfig['categories']) {
        for (const cat of policyConfig['categories']) {
          cy.wrap(categories).contains(cat.trim())
        }
      }
      // check controls
      if (policyConfig['controls']) {
        for (const ctl of policyConfig['controls']) {
          cy.wrap(controls).contains(ctl.trim())
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


export const verifyPolicyInPolicyDetails = (
  uName, policyConfig, enabled='enabled',
  targetStatus=0, violationsCounter=''
  ) => {
  //cy.get('div.vertical-expend').then((e) => {
  cy.get('#compliance\\.details-expand').within(() => {
    cy.get('div.pf-c-description-list__text').spread((
      name, namespace, enforcement, disabled, violations,
      categories, controls, standards, created
      ) => {
      // check name
      cy.wrap(name).contains(uName)
      // check namespace
      if (policyConfig['namespace']) {
        cy.wrap(namespace).contains(policyConfig['namespace'])
      }
      // check enforce/inform
      if (policyConfig['enforce']) {
        cy.wrap(enforcement).contains('enforce', { matchCase: false })
      } else {
        cy.wrap(enforcement).contains('inform', { matchCase: false })
      }
      // check state
      if (enabled == 'enabled') {
        cy.wrap(disabled).contains('false')
      } else {
        cy.wrap(disabled).contains('true')
      }
      if ([1,2,3].includes(targetStatus)) {
        // check the violation status
        cy.wrap(violations).find('svg').then((elems) => {
          if (elems.length === 1) {
            getStatusIconFillColor(targetStatus) === elems[0].getAttribute('fill').trim().toLowerCase()
          }
        })
      }
      // check violations counter
      if (violationsCounter) {
        cy.wrap(violations).contains(new RegExp('^'+violationsCounter+'$'))
      }
      // check categories
      if (policyConfig['categories']) {
        for (const cat of policyConfig['categories']) {
          cy.wrap(categories).contains(cat)
        }
      }
      // check controls
      if (policyConfig['controls']) {
        for (const ctl of policyConfig['controls']) {
          cy.wrap(controls).contains(ctl)
        }
      }
      // check standard
      if (policyConfig['standards']) {
        for (const std of policyConfig['standards']) {
          cy.wrap(standards).contains(std)
        }
      }
      // check creation time
      cy.wrap(created).contains(timestampRegexp)
    })
  })
}

const getStatusIconFillColor = (targetStatus) => {
  switch(targetStatus) {
    case 1: // 467f40 is the unique non-volation status color
    case 'compliant':
      return '#467f40'
    case 2: // c9190b is the unique violation status color
    case 'not compliant':
      return '#c9190b'
    case 3:
    default: // f0ab00 is the unique pending status color
    case 'no status':
      return '#f0ab00'
  }
}


export const verifyPlacementRuleInPolicyDetails = (placementRuleConfig) => {
  cy.get('section[aria-label="Placement rule"]').within(() => {
    cy.get('.bx--structured-list-td').spread((
      label1, name, label2, namespace, label3,
      selector, label4, decisions, label5, timestamp
      ) => {
      // check name
      if (placementRuleConfig['name']) {
        cy.wrap(name).contains(placementRuleConfig['name'])
      }
      // check namespace
      if (placementRuleConfig['namespace']) {
        cy.wrap(namespace).contains(placementRuleConfig['namespace'])
      }
      // check Cluster selector
      if (placementRuleConfig['selector']) {
        cy.wrap(selector).contains(placementRuleConfig['selector'])
      }
      // check Decisions
      if (placementRuleConfig['clusters']) {
        // check the number of clusters listed matches the configuration
        // for each cluster check that the expected status is listed
        cy.wrap(decisions).find('a').should('have.length', Object.keys(placementRuleConfig['clusters']).length)
        .then(() => {
          for (const [clusterName, expectedStatus] of Object.entries(placementRuleConfig['clusters'])) {
            cy.wrap(decisions).within(() => {
              // find cluster name
              cy.get('a').contains(clusterName)
                .next().as('clusterStatus')
              // check status
              cy.get('@clusterStatus').contains(expectedStatus.toLowerCase())
              // check status icon
              const fillColor = getStatusIconFillColor(expectedStatus.toLowerCase())
              cy.get('@clusterStatus').find('svg').should('have.attr', 'fill', fillColor)
            })
          }
        })
      }
      // check creation time
      cy.wrap(timestamp).contains(timestampRegexp)
    })
  })
}

// will add more check to enhance it later
export const verifyPolicyInPolicyStatus = (uName) => {
  cy.get('.pf-c-toggle-group__button').contains('Templates')
  .click()
  .then(() => {
    cy.get('.policy-status-by-templates-table .pf-c-title').contains(uName)
    verifyPolicyInPolicyHistory(uName)
  })
}

// will add more check to enhance it later
export const verifyPolicyInPolicyHistory = (uName) => {
  cy.get('tbody tr td a').contains('View history', { matchCase: false }).first()
  .click()
  .then(() => {
    cy.get('div h4').contains(uName, { matchCase: false })
  })
}

export const verifyPolicyByYAML = (uName, originalYAML, ingoreClusterSelector=true) => {
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
    cy.get('button').contains('Edit', { matchCase: false }).click()
  })
  .then(() => {
    cy.get('.bx--modal-container').within(() => {
      cy.log(ingoreClusterSelector)
      // // eslint-disable-next-line cypress/no-assigning-return-values
      // const acutalYAML = cy.YAMLeditor().first().invoke('getValue')
      // cy.log(acutalYAML)
    })
  })

  // after mainpage table action, always return to grc main page
  cy.CheckGrcMainPage()
}

export const verifyPolicyInPolicyDetailsTemplates = (uName, policyConfig) => {
  cy.get('#policy-templates-table-container').within(() => {
    cy.get('tr[data-row-name="'+uName+'-example"]').children().spread((name, visibleAPIver, visibleKind) => {
      // check name
      cy.wrap(name).contains(uName)
      // check api version
      cy.wrap(visibleAPIver).contains(policyConfig['apiVersion'])
      // check kind
      cy.wrap(visibleKind).contains(policyConfig['kind'])
    })
  })
}

export const verifyPlacementBindingInPolicyDetails = (uName, policyConfig) => {
  cy.get('section[aria-label="Placement binding"]').within(() => {
    cy.get('.bx--structured-list-td').spread((
      label1, name, label2, namespace, label3,
      placement_rule, label4, subjects, label5, timestamp
      ) => {
        cy.wrap(name).contains('binding-'+uName)
        if (policyConfig['namespace']) {
          cy.wrap(namespace).contains(policyConfig['namespace'])
        }
        cy.wrap(placement_rule).contains('placement-'+uName)
        if (policyConfig['apiVersion']) {
          let apiVer = policyConfig['apiVersion']
          apiVer = apiVer.substring(0, apiVer.length - 3)
          cy.wrap(subjects).contains(uName+'('+apiVer+')')
        }
        cy.wrap(timestamp).contains(timestampRegexp)
      })
    })
}


export const verifyViolationsInPolicyStatusClusters = (clusterViolations, violationPatterns, clusters = undefined) => {
  if (clusters == undefined) {
    clusters = Object.keys(clusterViolations)
  }
  for (const cluster of clusters) {
    for (const patternId of clusterViolations[cluster]) {
      // from a messageId having format "templateName-id' parse both templateName and id
      const templateName = patternId.replace(/-[^-]*$/, '')
      const id = patternId.replace(/^.*-/, '')
      // now use the search to better target the required policy and to get it on the first page
      // FIXME: this should be replaced by a separate function/command doing this, ideally without 'force'
      cy.get('input[aria-label="Search input"]').clear({force: true}).type(templateName, {force: true})
      cy.get('tbody').within(() => {
        cy.get('td').contains(new RegExp('^'+cluster+'$')).parents('td').siblings('td').spread((clusterStatus, template, message, lastReport, history) => {
          // check status
          let expectedStatus = 'Compliant'
          if (id > 0) { expectedStatus = 'Not compliant' }
          cy.wrap(clusterStatus).contains(expectedStatus)
          // check status icon
          const fillColor = getStatusIconFillColor(expectedStatus.toLowerCase())
          cy.wrap(clusterStatus).find('svg').should('have.attr', 'fill', fillColor)
          // double-check template
          cy.wrap(template).contains(templateName)
          // check message
          // FIXME: here we should have a function that split the content per ';' and tests each part agains Compliant/NonCompliant and expected messages
          if (id == 0) {
            cy.wrap(message).contains(new RegExp('Compliant; '+violationPatterns[templateName][id]))
          } else {
            cy.wrap(message).contains(new RegExp('NonCompliant; '+violationPatterns[templateName][id]))
          }
          // check last report timestamp
          cy.wrap(lastReport).contains(timestampRegexp)
          // check View history link
          cy.wrap(history).within(() => {
            cy.get('a').contains('View history')
          })
        })
      })
    }
  }
}

export const verifyViolationsInPolicyStatusTemplates = (clusterViolations, violationPatterns, clusters = undefined) => {
  if (clusters == undefined) {
    clusters = Object.keys(clusterViolations)
  }
  for (const cluster of clusters) {
    for (const patternId of clusterViolations[cluster]) {
      // from a messageId having format "templateName-id' parse both templateName and id
      const templateName = patternId.replace(/-[^-]*$/, '')
      const id = patternId.replace(/^.*-/, '')
      // now find the right search (there could be more) to better target the required cluster result and to get it on the first page
      // FIXME: this should be replaced by a separate function/command doing this, ideally without 'force'
      cy.get('h4').contains(new RegExp('^'+templateName+'$')).parent('div.policy-status-by-templates-table').within(() => {
        cy.get('input[aria-label="Search input"]').clear({force: true}).type(cluster, {force: true})
        cy.get('tbody').within(() => {
          cy.get('td').contains(new RegExp('^'+cluster+'$')).parents('td').siblings('td').spread((clusterStatus, message, lastReport, history) => {
            // check status
            let expectedStatus = 'Compliant'
            if (id > 0) { expectedStatus = 'Not compliant' }
            cy.wrap(clusterStatus).contains(expectedStatus)
            // check status icon
            const fillColor = getStatusIconFillColor(expectedStatus.toLowerCase())
            cy.wrap(clusterStatus).find('svg').should('have.attr', 'fill', fillColor)
            // check message
            // FIXME: here we should have a function that split the content per ';' and tests each part agains Compliant/NonCompliant and expected messages
            if (id == 0) {
              cy.wrap(message).contains(new RegExp('Compliant; '+violationPatterns[templateName][id]))
            } else {
              cy.wrap(message).contains(new RegExp('NonCompliant; '+violationPatterns[templateName][id]))
            }
            // check last report timestamp
            cy.wrap(lastReport).contains(timestampRegexp)
            // check View history link
            cy.wrap(history).within(() => {
              cy.get('a').contains('View history')
            })
          })
        })
      })
    }
  }
}

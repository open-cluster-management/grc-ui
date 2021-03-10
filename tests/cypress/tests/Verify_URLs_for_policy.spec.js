/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

/// <reference types="cypress" />

import { getConfigObject } from '../config'
import { getDefaultSubstitutionRules } from '../common/views'
const substitutionRules = getDefaultSubstitutionRules()
var policyName = ''
describe('RHACM4K-2354 - GRC UI: [P1][Sev1][policy-grc] Check existent and non-existent URLs for the policy', () => {
  it('Create policy for the URL visit', () => {
    const confFilePolicy = 'duplicatePolicyInDiffNS/create_ns_template.yaml'
    const rawPolicyYAML = getConfigObject(confFilePolicy, 'raw', substitutionRules)
    policyName = rawPolicyYAML.replace(/\r?\n|\r/g, ' ').replace(/^.*?name:\s*/m, '').replace(/\s.*/m,'')
    cy.visit('/multicloud/policies/create')
      .createPolicyFromYAML(rawPolicyYAML)
  })
  it('Verify URLs for cluster name and policy that do exist', () => {
    cy.visit('/multicloud/policies/policy/local-cluster/default.'+policyName)
    .checkPolicyNoResourcesIconMessage()
    cy.visit('/multicloud/policies/policy/local-cluster/default.'+policyName+'/a/b/c')
    .checkPolicyNoResourcesIconMessage()
  })
  it('Verify URLs for cluster name and policy that dont exist', () => {
    cy.visit('/multicloud/policies/policy/not-a-cluster/not-a-policy')
    .checkPolicyNoResourcesIconMessage(false)
    cy.visit('/multicloud/policies/policy/not-a-cluster/not-a-policy/a/b/c')
    .checkPolicyNoResourcesIconMessage(false)
  })
  it('Verify URLs for Namespace and policy that do exist', () => {
    cy.visit('/multicloud/policies/all/default/'+policyName)
    .checkPolicyNoResourcesIconMessage()
    cy.visit('/multicloud/policies/all/default/'+policyName+'/a/b/c')
    .checkPolicyNoResourcesIconMessage()
    cy.visit('/multicloud/policies/all/default/'+policyName+'/yaml')
    .checkPolicyNoResourcesIconMessage()
    cy.visit('/multicloud/policies/all/default/'+policyName+'/yaml/a/b/c')
    .checkPolicyNoResourcesIconMessage()
  })
  it('Verify URLs for Namespace and policy that dont exist', () => {
    cy.visit('/multicloud/policies/all/not-a-namespace/not-a-policy')
    .checkPolicyNoResourcesIconMessage(false)
    cy.visit('/multicloud/policies/all/not-a-namespace/not-a-policy/status')
    .checkPolicyNoResourcesIconMessage(false, 'No policy status found')
    cy.visit('/multicloud/policies/all/not-a-namespace/not-a-policy/yaml')
    .checkPolicyNoResourcesIconMessage(false, )
    cy.visit('/multicloud/policies/all/not-a-namespace/not-a-policy/other/a/b/c')
    .checkPolicyNoResourcesIconMessage(false)
  })
})

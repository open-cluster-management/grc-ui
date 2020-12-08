/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import {
  createPolicyFromYAML, verifyPolicyInListing, verifyPolicyNotInListing,
  actionPolicyActionInListing
} from '../views/policy'
import { getUniqueResourceName } from '../scripts/utils'
import { getYAMLStrFromCyEnv } from '../yaml'
import { getConfigObject } from '../config'

describe('Testing policy named demo-policy in demo.yaml file', () => {
    const policyName = 'demo-policy'
    const policyYAML = getYAMLStrFromCyEnv('demo')
    const { policyConfig } = getConfigObject('demo')
    const uPolicyName = getUniqueResourceName(policyName)

    it (`Can create new policy ${uPolicyName} from YAML editor`, () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicyFromYAML(uPolicyName, policyYAML, true)
    })

    it(`Policy ${uPolicyName} is present in the policy listing`, () => {
      verifyPolicyInListing(uPolicyName,  policyConfig)
    })

    it('Policy status becomes available', () => {
      // cy.visit(`/multicloud/policies/all/${policies[name]['namespace']}/${uPolicyName}`)
      // or cy.visit('/multicloud/policies/all')
      // both pages should be supported
      cy.waitForPolicyStatus(uPolicyName)
    })

    it('Disable policy', () => {
      actionPolicyActionInListing(uPolicyName, 'Disable')
    })

    it('Check disabled policy', () => {
      verifyPolicyInListing(uPolicyName,  policyConfig, 'disabled', 3)
    })

    it('Enable policy', () => {
      actionPolicyActionInListing(uPolicyName, 'Enable')
    })

    it('Check enabled policy', () => {
      verifyPolicyInListing(uPolicyName,  policyConfig, 'enabled', 1)
    })

    it('Enforce policy', () => {
      actionPolicyActionInListing(uPolicyName, 'Enforce')
    })

    it('Check enforced policy', () => {
       policyConfig.enforce = true
       policyConfig.inform = false
      verifyPolicyInListing(uPolicyName,  policyConfig)
    })

    it('Inform policy', () => {
      actionPolicyActionInListing(uPolicyName, 'Inform')
    })

    it('Check informed policy', () => {
       policyConfig.enforce = false
       policyConfig.inform = true
      verifyPolicyInListing(uPolicyName,  policyConfig)
    })

    it(`Policy ${uPolicyName} can be deleted in the policy listing`, () => {
      actionPolicyActionInListing(uPolicyName, 'Remove')
    })

    it(`Deleted policy ${uPolicyName} is not present in the policy listing`, () => {
      verifyPolicyNotInListing(uPolicyName)
    })
})

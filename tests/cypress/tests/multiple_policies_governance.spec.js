/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import {
  createPolicyFromSelection, verifyPolicyInListing, verifyPolicyNotInListing,
  actionPolicyActionInListing, verifyPolicyInPolicyDetails, getDefaultSubstitutionRules,
  verifyPolicyInPolicyDetailsTemplates, verifyPlacementRuleInPolicyDetails, verifyPlacementBindingInPolicyDetails,
  verifyViolationsInPolicyStatusClusters, verifyViolationsInPolicyStatusTemplates,
  getViolationsPerPolicy, getViolationsCounter
} from '../views/policy'
import { getConfigObject } from '../config'

describe('Testing multiple policy governance', () => {
    const confClusters = getConfigObject('clusters.yaml')
    const clusterList = Object.keys(confClusters)  // these are clusters we would be working with
    const substitutionRules = [ [/\[ID\]/g, Cypress.env('RESOURCE_ID')] ]
    // policy-config is used for policy creation and validation
    const confPolicies = getConfigObject('multiple_policies_governance/policy-config.yaml', 'yaml', substitutionRules)

    for (const policyName in confPolicies) {

      it(`Create new policy ${policyName} using the form`, () => {
        cy.FromGRCToCreatePolicyPage()
        createPolicyFromSelection(policyName, true, confPolicies[policyName])
      })

      it(`Check that policy ${policyName} is present in the policy listing`, () => {
        verifyPolicyInListing(policyName, confPolicies[policyName])
      })

      it(`Disable policy ${policyName}`, () => {
        actionPolicyActionInListing(policyName, 'Disable')
      })

      it(`Check disabled policy ${policyName}`, () => {
        verifyPolicyInListing(policyName, confPolicies[policyName], 'disabled', 3)
      })

      it(`Enable policy ${policyName}`, () => {
        actionPolicyActionInListing(policyName, 'Enable')
      })

    }

    for (const policyName in confPolicies) {

      // we need to do the substitution per policy - probably we could do this once for whole test
      const confClusterViolations = getConfigObject('multiple_policies_governance/violations-inform.yaml', 'yaml', getDefaultSubstitutionRules(policyName))
      const clusterViolations = getViolationsPerPolicy(policyName, confPolicies[policyName], confClusterViolations, clusterList)
      const violationsCounter = getViolationsCounter(clusterViolations)

      it(`Wait for policy ${policyName} status becomes available`, () => {
        cy.waitForPolicyStatus(policyName)
      })

      it(`Check enabled policy ${policyName}`, () => {
        verifyPolicyInListing(policyName, confPolicies[policyName], 'enabled', 1, violationsCounter)
      })

    }

    for (const policyName in confPolicies) {

      // we need to do the substitution per policy
      const confViolationPatterns = getConfigObject('violation-patterns.yaml', 'yaml', getDefaultSubstitutionRules(policyName))
      const confClusterViolations = getConfigObject('multiple_policies_governance/violations-inform.yaml', 'yaml', getDefaultSubstitutionRules(policyName))
      const clusterViolations = getViolationsPerPolicy(policyName, confPolicies[policyName], confClusterViolations, clusterList)
      const violationsCounter = getViolationsCounter(clusterViolations)

      it(`Verify policy ${policyName} details at the detailed page`, () => {
        cy.visit(`/multicloud/policies/all/${confPolicies[policyName]['namespace']}/${policyName}`)
        verifyPolicyInPolicyDetails(policyName, confPolicies[policyName], 'enabled', 1, violationsCounter)
      })

      it(`Verify policy ${policyName} template details at the detailed page`, () => {
        verifyPolicyInPolicyDetailsTemplates(policyName, confPolicies[policyName])
      })

      it(`Verify policy ${policyName} placement binding details at the detailed page`, () => {
        verifyPlacementBindingInPolicyDetails(policyName, confPolicies[policyName])
      })

      it(`Verify policy ${policyName} placement rule at the detailed page`, () => {
        verifyPlacementRuleInPolicyDetails(policyName, confPolicies[policyName], clusterViolations)
      })

      it(`Verify policy ${policyName} violations at the Status - Clusters page`, () => {
        cy.visit(`/multicloud/policies/all/${confPolicies[policyName]['namespace']}/${policyName}/status`)
        // verify all violations per cluster
        verifyViolationsInPolicyStatusClusters(clusterViolations, confViolationPatterns)
      })

      it(`Verify policy ${policyName} violations at the Status - Templates page`, () => {
        // open the Templates tab - we should have a command for this
        cy.get('#policy-status-templates').click()
        // verify violations per template
        verifyViolationsInPolicyStatusTemplates(clusterViolations, confViolationPatterns)
      })

    }

    for (const policyName in confPolicies) {

      it(`Enforce policy ${policyName}`, () => {
        cy.visit('/multicloud/policies/all')
        actionPolicyActionInListing(policyName, 'Enforce')
      })

      it(`Check that enforced policy ${policyName} is present in the policy listing`, () => {
        confPolicies[policyName]['enforce'] = true
        verifyPolicyInListing(policyName, confPolicies[policyName])
      })

    }


    for (const policyName in confPolicies) {

      // we need to do the substitution per policy
      const confViolationPatterns = getConfigObject('violation-patterns.yaml', 'yaml', getDefaultSubstitutionRules(policyName))
      const confClusterViolations = getConfigObject('multiple_policies_governance/violations-enforce.yaml', 'yaml', getDefaultSubstitutionRules(policyName))
      const clusterViolations = getViolationsPerPolicy(policyName, confPolicies[policyName], confClusterViolations, clusterList)
      const violationsCounter = getViolationsCounter(clusterViolations)

      it(`Wait for policy ${policyName} status becomes available`, () => {
        cy.visit('/multicloud/policies/all')
        cy.waitForPolicyStatus(policyName)
      })

      it(`Check enabled policy ${policyName}`, () => {
        confPolicies[policyName]['enforce'] = true  // not needed if done previously
        verifyPolicyInListing(policyName, confPolicies[policyName], 'enabled', 1, violationsCounter)
      })

      it(`Verify policy ${policyName} details at the detailed page`, () => {
        cy.visit(`/multicloud/policies/all/${confPolicies[policyName]['namespace']}/${policyName}`)
        verifyPolicyInPolicyDetails(policyName, confPolicies[policyName], 'enabled', 1, violationsCounter)
      })

      it(`Verify policy ${policyName} template details at the detailed page`, () => {
        verifyPolicyInPolicyDetailsTemplates(policyName, confPolicies[policyName])
      })

      it(`Verify policy ${policyName} placement binding details at the detailed page`, () => {
        verifyPlacementBindingInPolicyDetails(policyName, confPolicies[policyName])
      })

      it(`Verify policy ${policyName} placement rule at the detailed page`, () => {
        verifyPlacementRuleInPolicyDetails(policyName, confPolicies[policyName], clusterViolations)
      })

      it(`Verify policy ${policyName} violations at the Status - Clusters page`, () => {
        cy.visit(`/multicloud/policies/all/${confPolicies[policyName]['namespace']}/${policyName}/status`)
        // verify all violations per cluster
        verifyViolationsInPolicyStatusClusters(clusterViolations, confViolationPatterns)
      })

      it(`Verify policy ${policyName} violations at the Status - Templates page`, () => {
        // open the Templates tab - we should have a command for this
        cy.get('#policy-status-templates').click()
        // verify violations per template
        verifyViolationsInPolicyStatusTemplates(clusterViolations, confViolationPatterns)
      })

    }

    for (const policyName in confPolicies) {
      it(`Policy ${policyName} can be deleted in the policy listing`, () => {
        // we could use a different way how to return to this page
        cy.visit('/multicloud/policies/all')
        actionPolicyActionInListing(policyName, 'Remove')
      })

      it(`Deleted policy ${policyName} is not present in the policy listing`, () => {
        verifyPolicyNotInListing(policyName)
      })
    }

})

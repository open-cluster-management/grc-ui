/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

// BEWARE: The execution if this test is altered by an environment variable
// STANDALONE_TESTSUITE_EXECUTION (resp. CYPRESS_STANDALONE_TESTSUITE_EXECUTION)
// when set to 'FALSE', some checks are loosened due to possible conflicts with
// other tests running in the environment

/// <reference types="cypress" />
import { describeT } from '../support/tagging'
import { getConfigObject } from '../config'
import { getDefaultSubstitutionRules } from '../support/views'

describeT('RHACM4K-2343 - [P1][Sev1][policy-grc] All policies page: Verify automation modal', () => {
  const subscriptionPolicy = 'automation/create_subscription.yaml'
  const confFilePolicy = 'automation/policy_toBeAutomated.yaml'
  const credentialPolicy = 'automation/create_credential.yaml'
  const cleanUpPolicy = 'automation/clean_up.yaml'

  //create subscription to install ansible automation operator
  const substitutionRules = getDefaultSubstitutionRules()
  const rawSubPolicyYAML = getConfigObject(subscriptionPolicy, 'raw', substitutionRules)
  const subPolicyName = rawSubPolicyYAML.replace(/\r?\n|\r/g, ' ').replace(/^.*?name:\s*/m, '').replace(/\s.*/m,'')

  it('Creates a subscription to install the Ansible operator', () => {
    cy.visit('/multicloud/policies/create')
    cy.log(rawSubPolicyYAML)
      .createPolicyFromYAML(rawSubPolicyYAML, true)
  })

  it(`Check that policy ${subPolicyName} is present in the policy listing`, () => {
    cy.verifyPolicyInListing(subPolicyName, {})
  })

  it(`Wait for ${subPolicyName} status to become available`, () => {
    cy.waitForPolicyStatus(subPolicyName, '0/')
  })

  const rawPolicyYAML = getConfigObject(confFilePolicy, 'raw', substitutionRules)
  const policyName = rawPolicyYAML.replace(/\r?\n|\r/g, ' ').replace(/^.*?name:\s*/m, '').replace(/\s.*/m,'')

  it('Creates the policy to automate using the YAML', () => {
    cy.visit('/multicloud/policies/create')
    cy.log(rawPolicyYAML)
      .createPolicyFromYAML(rawPolicyYAML, true)
  })

  it(`Check that policy ${policyName} is present in the policy listing`, () => {
    cy.verifyPolicyInListing(policyName, {})
  })

  it(`Wait for ${policyName} status to become available`, () => {
    cy.waitForPolicyStatus(policyName, '1/')
  })

  //check credential table before creation
  it('verifies sidebar credentials not existing', () => {
    cy.verifyCredentialsInSidebar(policyName, '')
  })

  //create credential
  const rawCredPolicyYAML = getConfigObject(credentialPolicy, 'raw', substitutionRules)
  const credPolicyName = rawPolicyYAML.replace(/\r?\n|\r/g, ' ').replace(/^.*?name:\s*/m, '').replace(/\s.*/m,'')

  it('Create the credential policy using the YAML', () => {
    cy.visit('/multicloud/policies/create')
    cy.log(rawCredPolicyYAML)
      .createPolicyFromYAML(rawCredPolicyYAML, true)
  })

  it(`Check that policy ${credPolicyName} is present in the policy listing`, () => {
    cy.verifyPolicyInListing(credPolicyName, {})
  })

  it(`Wait for ${credPolicyName} status to become available`, () => {
    cy.waitForPolicyStatus(credPolicyName, '0/')
  })

  //check modal post credential creation
  it('verifies sidebar credentials after creation', () => {
    cy.verifyCredentialsInSidebar(policyName, 'grcui-e2e-credential')
  })

  //verify contents of modal
  it('Successfully can schedule an automation', () => {
    cy.scheduleAutomation(policyName, 'grcui-e2e-credential', 'disabled')
    cy.scheduleAutomation(policyName, 'grcui-e2e-credential', 'once')
    cy.scheduleAutomation(policyName, 'grcui-e2e-credential', 'manual')
    cy.verifyHistoryPageWithMock(policyName)
  })

  //clean up
  it(`Delete policy ${policyName}`, () => {
    cy.actionPolicyActionInListing(policyName, 'Remove')
  })
  it(`Delete policy ${subPolicyName}`, () => {
    cy.actionPolicyActionInListing(subPolicyName, 'Remove')
  })
  const cleanUprawPolicyYAML = getConfigObject(cleanUpPolicy, 'raw', substitutionRules)
  const cleanUppolicyName = rawPolicyYAML.replace(/\r?\n|\r/g, ' ').replace(/^.*?name:\s*/m, '').replace(/\s.*/m,'')

  it('Create the clean up policy using the YAML', () => {
    cy.visit('/multicloud/policies/create')
    cy.log(cleanUprawPolicyYAML)
      .createPolicyFromYAML(cleanUprawPolicyYAML, true)
  })
  it(`Wait for ${cleanUppolicyName} status to become available`, () => {
    cy.waitForPolicyStatus(cleanUppolicyName, '0/')
  })
  it(`Delete policy ${cleanUppolicyName}`, () => {
    cy.actionPolicyActionInListing(cleanUppolicyName, 'Remove')
  })

  it(`Verify that policy ${policyName} is not present in the policy listing`, () => {
    cy.verifyPolicyNotInListing(policyName)
  })
  it(`Verify that policy ${subPolicyName} is not present in the policy listing`, () => {
    cy.verifyPolicyNotInListing(subPolicyName)
  })
  it(`Verify that policy ${cleanUppolicyName} is not present in the policy listing`, () => {
    cy.verifyPolicyNotInListing(cleanUppolicyName)
  })
})

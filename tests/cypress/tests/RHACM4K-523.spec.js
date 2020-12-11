/* eslint-disable no-unused-vars */
/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import {
  createPolicyFromYAML, verifyPolicyInListing, verifyPolicyNotInListing,
  actionPolicyActionInListing, verifyPolicyInPolicyDetails, getDefaultSubstitutionRules,
  verifyPlacementRuleInPolicyDetails
} from '../views/policy'
import { getUniqueResourceName } from '../scripts/utils'
import { getConfigObject } from '../config'

describe('Testing polarion test case RHACM4K-523', () => {
    const certificateName = 'policy-create-certificate'
    const uCertificateName = getUniqueResourceName(certificateName)
    const certificateYAML = getConfigObject('RHACM4K-523/test_certificate_raw.yaml', 'raw', getDefaultSubstitutionRules(uCertificateName))

    const certificatePolicyName = 'policy-certificatepolicy'
    const uCertificatePolicyName = getUniqueResourceName(certificatePolicyName)
    const certificatePolicyYAML = getConfigObject('RHACM4K-523/test_certpolicy_raw.yaml', 'raw', getDefaultSubstitutionRules(uCertificatePolicyName))


    const certificatePolicyConfig = getConfigObject('RHACM4K-523/test_certpolicy_config.yaml')

    it ('"Govern risk" page can be launched.', () => {
      cy.CheckGrcMainPage()
    })

    it (`Create an expiring certificate ${uCertificateName} in the managed cluster.`, () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicyFromYAML(certificateYAML, true)
      cy.waitForPolicyStatus(uCertificateName)
    })

    it ('Navigated to "Govern risk" page and clicked at "Create policy"', () => {
      cy.CheckGrcMainPage()
      cy.FromGRCToCreatePolicyPage()
    })

    it (`Create policy ${uCertificatePolicyName}`, () => {
      createPolicyFromYAML(certificatePolicyYAML, true)
      cy.waitForPolicyStatus(uCertificatePolicyName)
    })

    it (`Verify all information about the created policy ${uCertificatePolicyName} on the "Govern and risk" page`, () => {
      verifyPolicyInListing(uCertificatePolicyName,  certificatePolicyConfig)
    })

    // it(`Policy ${uPolicyName} is present in the policy listing`, () => {
    //   verifyPolicyInListing(uPolicyName,  policyConfig)
    // })

    // it('Policy status becomes available', () => {
    //   // cy.visit(`/multicloud/policies/all/${policies[name]['namespace']}/${uPolicyName}`)
    //   // or cy.visit('/multicloud/policies/all')
    //   // both pages should be supported
    //   cy.waitForPolicyStatus(uPolicyName)
    // })

    // it('Disable policy', () => {
    //   actionPolicyActionInListing(uPolicyName, 'Disable')
    // })

    // it('Check disabled policy', () => {
    //   verifyPolicyInListing(uPolicyName,  policyConfig, 'disabled', 3)
    // })

    // it('Enable policy', () => {
    //   actionPolicyActionInListing(uPolicyName, 'Enable')
    // })

    // it('Check enabled policy', () => {
    //   verifyPolicyInListing(uPolicyName,  policyConfig, 'enabled', 1, '0/1')
    // })

    // it('Enforce policy', () => {
    //   actionPolicyActionInListing(uPolicyName, 'Enforce')
    // })

    // it('Check enforced policy', () => {
    //    policyConfig.enforce = true
    //    policyConfig.inform = false
    //   verifyPolicyInListing(uPolicyName,  policyConfig)
    // })

    // it('Inform policy', () => {
    //   actionPolicyActionInListing(uPolicyName, 'Inform')
    // })

    // it('Check informed policy', () => {
    //    policyConfig.enforce = false
    //    policyConfig.inform = true
    //   verifyPolicyInListing(uPolicyName,  policyConfig)
    // })

    // it('check policy and the detailed policy page', () => {
    //    // we need to find another way how to access this page
    //    cy.visit(`/multicloud/policies/all/default/${uPolicyName}`)
    //    verifyPolicyInPolicyDetails(uPolicyName, policyConfig, 'enabled', 1, '0/1')
    //    verifyPlacementRuleInPolicyDetails(policyPlacementRule)
    // })

    // it(`Remove created certificate ${uCertificateName}`, () => {
    //   // we could use a different way how to return to this page
    //   cy.visit('/multicloud/policies/all')
    //   actionPolicyActionInListing(uCertificateName, 'Remove')
    // })

    // it(`Check created certificate ${uCertificateName} is not present`, () => {
    //   verifyPolicyNotInListing(uCertificateName)
    // })

    // it(`Remove created policy ${uCertificatePolicyName}`, () => {
    //   actionPolicyActionInListing(uCertificatePolicyName, 'Remove')
    // })

    // it(`Check created policy ${uCertificatePolicyName} is not present`, () => {
    //   verifyPolicyNotInListing(uCertificatePolicyName)
    // })
})

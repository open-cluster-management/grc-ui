/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import {
  createPolicyFromYAML, verifyPolicyInListing, verifyPolicyNotInListing,
  actionPolicyActionInListing, verifyPolicyInPolicyDetails, getDefaultSubstitutionRules,
  verifyPolicyInPolicyStatus, verifyPolicyByYAML
} from '../views/policy'
import { getUniqueResourceName } from '../scripts/utils'
import { getConfigObject } from '../config'

describe('Testing encryption policy governance over managed cluster', () => {
    const encryptionPolicyName = 'policy-etcdencryption-first'
    const uEncryptionPolicyName = getUniqueResourceName(encryptionPolicyName)
    const encryptionPolicyYAML = getConfigObject('encryPolicyTest/test_etcdencryption_first_raw.yaml', 'raw', getDefaultSubstitutionRules(uEncryptionPolicyName))
    const encryptionPolicyConfig = getConfigObject('encryPolicyTest/test_etcdencryption_config.yaml')

    it ('Navigated to "Govern risk" page and clicked at "Create policy"', () => {
      cy.CheckGrcMainPage()
      cy.FromGRCToCreatePolicyPage()
    })

    it (`Create policy ${uEncryptionPolicyName}`, () => {
      createPolicyFromYAML(encryptionPolicyYAML, true)
    })

    it(`Encryption policy ${uEncryptionPolicyName} status becomes available`, () => {
      cy.CheckGrcMainPage()
      cy.waitForPolicyStatus(uEncryptionPolicyName)
    })

    it (`Verify all information about the created encryption policy ${uEncryptionPolicyName} on the "Govern and risk" page`, () => {
      verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled')
    })

    it(`Validate violations/status of created policy ${uEncryptionPolicyName} on the detailed policy page`, () => {
      // we need to find another way how to access this page
      cy.visit(`/multicloud/policies/all/default/${uEncryptionPolicyName}`)
        .then(() => {
          verifyPolicyInPolicyDetails(uEncryptionPolicyName, encryptionPolicyConfig, 'enabled')
        })
    })

    it(`Validate violations/status of created policy ${uEncryptionPolicyName} on the policy status/history page`, () => {
      // we need to find another way how to access this page
      cy.visit(`/multicloud/policies/all/default/${uEncryptionPolicyName}/status`)
        .then(() => {
        verifyPolicyInPolicyStatus(uEncryptionPolicyName)
      })
    })

    it(`Validate yaml of created policy ${uEncryptionPolicyName} from edit YAML action`, () => {
      // we could use a different way how to return to this page
      cy.visit('/multicloud/policies/all')
      verifyPolicyByYAML(uEncryptionPolicyName, encryptionPolicyYAML, true)
    })

    it(`Validate disable of the policy ${uEncryptionPolicyName}`, () => {
      // we could use a different way how to return to this page
      cy.visit('/multicloud/policies/all')
      actionPolicyActionInListing(uEncryptionPolicyName, 'Disable')
    })

    it('Check disabled policy', () => {
      cy.CheckGrcMainPage()
      verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'disabled', 3)
    })

    it(`Validate enable of the policy ${uEncryptionPolicyName}` , () => {
      actionPolicyActionInListing(uEncryptionPolicyName, 'Enable')
      cy.CheckGrcMainPage()
    })

    it(`Check enabled policy ${uEncryptionPolicyName}`, () => {
      cy.waitForPolicyStatus(uEncryptionPolicyName)
      verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled', 2)
    })

    it(`Edit policy ${uEncryptionPolicyName} and change "remediateAction" to "enforce"`, () => {
      actionPolicyActionInListing(uEncryptionPolicyName, 'Enforce')
      cy.CheckGrcMainPage()
      cy.waitForPolicyStatus(uEncryptionPolicyName)
    })

    it('Check violations is remediated', () => {
      encryptionPolicyConfig.enforce = true
      encryptionPolicyConfig.inform = false
      verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled', 1)
    })
})

describe('RHACM4K-1581 Testing encryption policy governance over managed cluster has preivously been encrypted', () => {
  const preEncryptionPolicyName = 'policy-etcdencryption-first'
  const uPreEncryptionPolicyName = getUniqueResourceName(preEncryptionPolicyName)
  const encryptionPolicyName = 'policy-etcdencryption-second'
  const uEncryptionPolicyName = getUniqueResourceName(encryptionPolicyName)
  const encryptionPolicyYAML = getConfigObject('encryPolicyTest/test_etcdencryption_second_raw.yaml', 'raw', getDefaultSubstitutionRules(uEncryptionPolicyName))
  const encryptionPolicyConfig = getConfigObject('encryPolicyTest/test_etcdencryption_config.yaml')

  it ('Navigated to "Govern risk" page and clicked at "Create policy"', () => {
    cy.CheckGrcMainPage()
    cy.FromGRCToCreatePolicyPage()
  })

  it (`Create policy ${uEncryptionPolicyName}`, () => {
    createPolicyFromYAML(encryptionPolicyYAML, true)
  })

  it(`Encryption policy ${uEncryptionPolicyName} status becomes available`, () => {
    cy.CheckGrcMainPage()
    cy.waitForPolicyStatus(uEncryptionPolicyName)
  })

  it (`Verify all information about the created encryption policy ${uEncryptionPolicyName} on the "Govern and risk" page`, () => {
    verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled')
  })

  it(`Validate violations/status of created policy ${uEncryptionPolicyName} on the detailed policy page`, () => {
    // we need to find another way how to access this page
    cy.visit(`/multicloud/policies/all/default/${uEncryptionPolicyName}`)
      .then(() => {
        verifyPolicyInPolicyDetails(uEncryptionPolicyName, encryptionPolicyConfig, 'enabled')
      })
  })

  it(`Validate violations/status of created policy ${uEncryptionPolicyName} on the policy status/history page`, () => {
    // we need to find another way how to access this page
    cy.visit(`/multicloud/policies/all/default/${uEncryptionPolicyName}/status`)
      .then(() => {
      verifyPolicyInPolicyStatus(uEncryptionPolicyName)
    })
  })

  it(`Validate yaml of created policy ${uEncryptionPolicyName} from edit YAML action`, () => {
    // we could use a different way how to return to this page
    cy.visit('/multicloud/policies/all')
    verifyPolicyByYAML(uEncryptionPolicyName, encryptionPolicyYAML, true)
  })

  it(`Validate disable of the policy ${uEncryptionPolicyName}`, () => {
    // we could use a different way how to return to this page
    cy.visit('/multicloud/policies/all')
    actionPolicyActionInListing(uEncryptionPolicyName, 'Disable')
  })

  it('Check disabled policy', () => {
    cy.CheckGrcMainPage()
    verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'disabled', 3)
  })

  it(`Validate enable of the policy ${uEncryptionPolicyName}` , () => {
    actionPolicyActionInListing(uEncryptionPolicyName, 'Enable')
    cy.CheckGrcMainPage()
  })

  it(`Check enabled policy ${uEncryptionPolicyName}`, () => {
    cy.waitForPolicyStatus(uEncryptionPolicyName)
    verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled', 2)
  })

  it(`Edit policy ${uEncryptionPolicyName} and change "remediateAction" to "enforce"`, () => {
    actionPolicyActionInListing(uEncryptionPolicyName, 'Enforce')
    cy.CheckGrcMainPage()
    cy.waitForPolicyStatus(uEncryptionPolicyName)
  })

  it('Check violations is remediated', () => {
    encryptionPolicyConfig.enforce = true
    encryptionPolicyConfig.inform = false
    verifyPolicyInListing(uEncryptionPolicyName,  encryptionPolicyConfig, 'enabled', 1)
  })

  it(`Remove previous created policy ${uPreEncryptionPolicyName}`, () => {
    actionPolicyActionInListing(uPreEncryptionPolicyName, 'Remove')
    cy.CheckGrcMainPage()
  })

  it(`Check previous created policy ${uPreEncryptionPolicyName} is not present`, () => {
    verifyPolicyNotInListing(uPreEncryptionPolicyName)
  })

  it(`Remove created policy ${uEncryptionPolicyName}`, () => {
    actionPolicyActionInListing(uEncryptionPolicyName, 'Remove')
    cy.CheckGrcMainPage()
  })

  it(`Check created policy ${uEncryptionPolicyName} is not present`, () => {
    verifyPolicyNotInListing(uEncryptionPolicyName)
  })
})

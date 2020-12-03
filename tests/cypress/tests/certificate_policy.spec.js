/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />

import {
  createPolicy, verifyPolicyInListing, verifyPolicyNotInListing, deletePolicyInListing,
  disablePolicyInListing, enablePolicyInListing, enforcePolicyInListing, informPolicyInListing,
  isPolicyStatusAvailable,
} from '../views/policy'
import { getConfigObject } from '../config'

const { createIssuer } = getConfigObject('create_test_issuer')
const createIssuerName = createIssuer.name
const { createCertificate } = getConfigObject('create_test_certificate')
const createCertificateName = createCertificate.name
const { certificatePolicy } = getConfigObject('create_test_certpolicy')
const certificatePolicyName = certificatePolicy.name
describe('GRC certificate policy controller e2e tests', () => {
    it ('Create issuer', () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicy({ createIssuerName, create:true, ...createIssuer})
      verifyPolicyInListing({ createIssuerName, ...createIssuer})
    })

    it ('Create certificate', () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicy({ createCertificateName, create:true, ...createCertificate})
      verifyPolicyInListing({ createCertificateName, ...createCertificate})
    })

    it ('Create certificate policy with violation', () => {
      cy.FromGRCToCreatePolicyPage()
      createPolicy({ certificatePolicyName, create:true, ...certificatePolicy})
      verifyPolicyInListing({ certificatePolicyName, ...certificatePolicy})
    })

    it('Disable certificate policy', () => {
      cy.CheckGrcMainPage()
      disablePolicyInListing(certificatePolicyName)
      cy.CheckGrcMainPage()
      isPolicyStatusAvailable(certificatePolicyName, true)
    })

    it('Enable certificate policy', () => {
      cy.CheckGrcMainPage()
      enablePolicyInListing(certificatePolicyName)
      cy.CheckGrcMainPage()
    })

    it('Enforce certificate policy', () => {
      cy.CheckGrcMainPage()
      enforcePolicyInListing(certificatePolicyName)
      cy.CheckGrcMainPage()
    })

    it('Inform certificate policy', () => {
      cy.CheckGrcMainPage()
      informPolicyInListing(certificatePolicyName)
      cy.CheckGrcMainPage()
    })

    it('Delete issuer', () => {
      cy.CheckGrcMainPage()
      deletePolicyInListing(createIssuerName)
      verifyPolicyNotInListing(createIssuerName)
      cy.CheckGrcMainPage()
    })

    it('Delete certificate', () => {
      cy.CheckGrcMainPage()
      deletePolicyInListing(createCertificateName)
      verifyPolicyNotInListing(createCertificateName)
      cy.CheckGrcMainPage()
    })

    it('Delete certificate policy', () => {
      cy.CheckGrcMainPage()
      deletePolicyInListing(certificatePolicyName)
      verifyPolicyNotInListing(certificatePolicyName)
      cy.CheckGrcMainPage()
    })
})

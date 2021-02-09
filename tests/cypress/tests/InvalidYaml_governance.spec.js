/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { getConfigObject } from '../config'
import { createPolicyFromYAML, getDefaultSubstitutionRules } from '../views/policy'

describe('RHACM4K-247 - GRC UI: [P1][Sev1][policy-grc] Create policy with invalid yaml', () => {
  it.only('Create policy should fail with invalid policy name in yaml', () => {
    const confFilePolicy = 'InvalidYamlTests/InvalidPolicyName.yaml'
    const rawPolicyYAML = getConfigObject(confFilePolicy, 'raw', getDefaultSubstitutionRules())
    cy.visit('/multicloud/policies/create')
    createPolicyFromYAML(rawPolicyYAML, true, true, 'invalidName')
  })
  it('Create policy should fail with missing namespace in yaml', () => {
    const confFilePolicy = 'InvalidYamlTests/MissingNamespace.yaml'
    const rawPolicyYAML = getConfigObject(confFilePolicy, 'raw', getDefaultSubstitutionRules())
    cy.visit('/multicloud/policies/create')
    createPolicyFromYAML(rawPolicyYAML, true, true, 'missingNamespace')
  })
  it('Create policy should fail with invalid indentation in yaml', () => {
    const confFilePolicy = 'InvalidYamlTests/InvalidIndentation.yaml'
    const rawPolicyYAML = getConfigObject(confFilePolicy, 'raw', getDefaultSubstitutionRules())
    cy.visit('/multicloud/policies/create')
    createPolicyFromYAML(rawPolicyYAML, true, true, 'badIndentation')
  })
})

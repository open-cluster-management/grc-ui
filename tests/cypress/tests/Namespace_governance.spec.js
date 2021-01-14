/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup'

describe('Namespace policy governance - setup', () => {
    cleanup_usingPolicyYAML('Namespace_governance/namespace_specification_setup_policy_raw.yaml')
})
describe('Namespace policy governance', () => {
    test_genericPolicyGovernance('Namespace_governance/policy-config.yaml', 'Namespace_governance/violations-inform.yaml', 'Namespace_governance/violations-enforce.yaml')
})
describe('Namespace policy governance - clean up', () => {
    cleanup_usingPolicyYAML('Namespace_governance/namespace_specification_cleanup_policy_raw.yaml')
})

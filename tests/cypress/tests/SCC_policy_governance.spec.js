/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup'

describe('SecurityContextConstraints policy governance', () => {
  test_genericPolicyGovernance('SCC_policy_governance/policy-config.yaml', 'SCC_policy_governance/violations-inform.yaml', 'SCC_policy_governance/violations-enforce.yaml')
})

describe('SecurityContextConstraints policy governance - clean up', () => {
  cleanup_usingPolicyYAML('SCC_policy_governance/SCC_cleanup_policy_raw.yaml')
})

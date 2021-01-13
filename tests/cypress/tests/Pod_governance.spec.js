/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup'

describe('Pod policy governance', () => {
    test_genericPolicyGovernance('Pod_governance/policy-config.yaml', 'Pod_governance/violations-inform.yaml', 'Pod_governance/violations-enforce.yaml')
})

describe('Pod policy governance - clean up', () => {
    cleanup_usingPolicyYAML('Pod_governance/pod_specification_cleanup_policy_raw.yaml')
})

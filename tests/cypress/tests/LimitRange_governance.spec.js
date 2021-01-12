/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup'

test_genericPolicyGovernance('LimitRange governance', 'LimitRange_governance/policy-config.yaml', 'LimitRange_governance/violations-inform.yaml', 'LimitRange_governance/violations-enforce.yaml')
describe('LimitRange policy governance - clean up', () => {
    cleanup_usingPolicyYAML('LimitRange_governance/limitRange_specification_cleanup_policy_raw.yaml')
})

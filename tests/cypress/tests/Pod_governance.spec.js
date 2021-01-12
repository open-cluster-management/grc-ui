/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance.spec.js'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup.js'

test_genericPolicyGovernance('Pod governance', 'Pod_governance/policy-config.yaml', 'Pod_governance/violations-inform.yaml', 'Pod_governance/violations-enforce.yaml')
describe('Pod policy governance - clean up', () => {
    cleanup_usingPolicyYAML('Pod_governance/pod_specification_cleanup_policy_raw.yaml')
})

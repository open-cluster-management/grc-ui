/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance.spec.js'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup.js'

test_genericPolicyGovernance('Namespace governance', 'Namespace_governance/policy-config.yaml', 'Namespace_governance/violations-inform.yaml', 'Namespace_governance/violations-enforce.yaml')
describe('Namespace policy governance - clean up', () => {
    cleanup_usingPolicyYAML('Namespace_governance/namespace_specification_cleanup_policy_raw.yaml')
})

/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance'
import { cleanup_usingPolicyYAML } from './common/generic_policy_cleanup'

describe('ImageManifest policy governance', () => {
    test_genericPolicyGovernance('ImageManifest governance', 'ImageManifest_governance/policy-config.yaml', 'ImageManifest_governance/violations-inform.yaml', 'ImageManifest_governance/violations-enforce.yaml')
})
describe('ImageManifest policy governance - clean up', () => {
    cleanup_usingPolicyYAML('ImageManifest_governance/imageManifest_specification_cleanup_policy_raw.yaml')
})

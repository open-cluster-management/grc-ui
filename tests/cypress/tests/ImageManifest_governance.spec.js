/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance.js'
import { getOpenShiftCluster } from '../config'

if(getOpenShiftCluster().length>0)
{
    describe('RHACM4K-1727 - GRC UI: [P1][Sev1][policy-grc] ImageManifest policy governance', () => {
        test_genericPolicyGovernance('ImageManifest_governance/policy-config.yaml', 'ImageManifest_governance/violations-inform.yaml', 'ImageManifest_governance/violations-enforce.yaml', 'clusters.yaml', getOpenShiftCluster())
    })
}

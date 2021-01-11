/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
import { test_genericPolicyGovernance } from './common/generic_policies_governance.spec.js'

test_genericPolicyGovernance('IamPolicy governance', 'IamPolicy_governance/policy-config.yaml', 'IamPolicy_governance/violations-inform.yaml', 'IamPolicy_governance/violations-inform.yaml')

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'
import {
  createComplianceLink,
  createClusterLaunchLink
} from '../../../src-web/definitions/hcm-policies-policy'
import {
  hcmPoliciesPolicyItem,
  hcmPoliciesPolicyCluster
} from './DefinitionsTestingData'

describe('createComplianceLink', () => {
  it('Should item.metadata.name', () => {
    expect(createComplianceLink(
      hcmPoliciesPolicyItem, 'en-US', 'test', 'grcTest'
    )).toMatchSnapshot()
  })
  it('Should create policy link', () => {
    expect(createComplianceLink(hcmPoliciesPolicyItem, 'en-US')).toMatchSnapshot()
  })
  it('Should create compliance link', () => {
    hcmPoliciesPolicyItem.raw.kind = 'Compliance'
    expect(createComplianceLink(hcmPoliciesPolicyItem, 'en-US')).toMatchSnapshot()
  })
  it('Should undefined', () => {
    expect(createComplianceLink()).toMatchSnapshot()
  })
})

describe('createClusterLaunchLink', () => {
  it('Should return a valid cluster link', () => {
    expect(createClusterLaunchLink(hcmPoliciesPolicyCluster.valid, '', hcmPoliciesPolicyCluster.param)).toMatchSnapshot()
  })
  it('Should return \'-\' with empty string for URL', () => {
    expect(createClusterLaunchLink(hcmPoliciesPolicyCluster.empty, '', hcmPoliciesPolicyCluster.param)).toMatchSnapshot()
  })
  it('Should return \'-\' with null status', () => {
    expect(createClusterLaunchLink(hcmPoliciesPolicyCluster.null, '', hcmPoliciesPolicyCluster.param)).toMatchSnapshot()
  })
  it('Should return undefined with incorrect param', () => {
    expect(createClusterLaunchLink(hcmPoliciesPolicyCluster.valid, '', 'notafield')).toMatchSnapshot()
  })
})

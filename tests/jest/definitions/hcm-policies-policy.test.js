/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { createComplianceLink } from '../../../src-web/definitions/hcm-policies-policy'
import { hcmPoliciesPolicyItem } from './DefinitionsTestingData'

describe('createComplianceLink', () => {
  it('Should item.metadata.name', () => {
    expect(createComplianceLink(hcmPoliciesPolicyItem, 'en-US', 'test', 'grcTest')).toMatchSnapshot()
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

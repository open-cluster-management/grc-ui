/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { predicate } from '../../../src-web/reducers/index'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

describe('predicate', () => {
  it('should return true', () => {
    const action = {
      resourceType: RESOURCE_TYPES.HCM_POLICIES,
    }
    const resourceType = RESOURCE_TYPES.HCM_POLICIES
    expect(predicate(resourceType, action)).toEqual(true)
  })

  it('should return true', () => {
    const action = {
      resourceType: 'HCMPolicy',
    }
    const resourceType = RESOURCE_TYPES.HCM_POLICIES
    expect(predicate(resourceType, action)).toEqual('HCMPolicy')
  })

  it('should return undefined', () => {
    const action = {
      resourceType: 'HCMPolicy',
    }
    expect(predicate(RESOURCE_TYPES, action)).toEqual(null)
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import * as Actions from '../../../src-web/actions'
import { uiconfig } from '../../../src-web/reducers/uiconfig'

describe('uiconfig reducer', () => {
  it('should return a state with ROLE_RECEIVE_SUCCESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.UICONFIG_RECEIVE_SUCCESS,
      data: 'testData'
    }
    const expectedValue = 'testData'
    expect(uiconfig(state, action)).toEqual(expectedValue)
  })
  it('should return a default state', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: null
    }
    const expectedValue = {'test': 'test'}
    expect(uiconfig(state, action)).toEqual(expectedValue)
  })
  it('should return undefined state', () => {
    expect(uiconfig(null, null)).toEqual(undefined)
  })
  it('should return undefined state', () => {
    expect(uiconfig()).toEqual(undefined)
  })
})

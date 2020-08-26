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

import * as Actions from '../../../src-web/actions'
import { role } from '../../../src-web/reducers/role'

describe('role reducer', () => {
  it('should return a state with ROLE_RECEIVE_SUCCESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.ROLE_RECEIVE_SUCCESS
    }
    const expectedValue = {'status': 'DONE', 'type': 'ROLE_RECEIVE_SUCCESS'}
    expect(role(state, action)).toEqual(expectedValue)
  })
  it('should return a state with ROLE_RECEIVE_FAILURE status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.ROLE_RECEIVE_FAILURE,
      err: {
        details: 'errorDetails',
        statusCode: 'errorStatusCode'
      }
    }
    const expectedValue = {
      'errorMessage': 'errorDetails',
      'status': 'ERROR',
      'statusCode': 'errorStatusCode',
      'test': 'test'
    }
    expect(role(state, action)).toEqual(expectedValue)
  })
  it('should return a default state', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.REQUEST_STATUS
    }
    const expectedValue = {'test': 'test'}
    expect(role(state, action)).toEqual(expectedValue)
  })
  it('should return undefined state', () => {
    expect(role(null, null)).toEqual(undefined)
  })
  it('should return undefined state', () => {
    expect(role()).toEqual(undefined)
  })
})

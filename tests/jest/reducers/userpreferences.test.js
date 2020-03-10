/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/*
For a given input, a selector should always produce the same output.
 */

import { userpreferences } from '../../../src-web/reducers/userpreferences'
import * as Actions from '../../../src-web/actions'

describe('User Preferences reducer', () => {
  describe('#userpreferences', () => {

    it('should return the null state', () => {
      expect(userpreferences(undefined, null)).toEqual(null)
    })
    it('should return the initial state', () => {
      expect(userpreferences(undefined, {})).toEqual(null)
    })
    it('should handle USERPREFERENCES_RECEIVE_SUCCESS', () => {
      const state = {
        test: 'testUserPreferences'
      }
      const action = {
        type: Actions.USERPREFERENCES_RECEIVE_SUCCESS,
      }
      const expectedValue = {'status': 'DONE', 'type': 'USERPREFERENCES_RECEIVE_SUCCESS'}
      expect(userpreferences(state, action)).toEqual(expectedValue)
    })
    it('should handle USERPREFERENCES_RECEIVE_FAILURE', () => {
      const state = {
        test: 'testUserPreferences'
      }
      const action = {
        type: Actions.USERPREFERENCES_RECEIVE_FAILURE,
        err: {
          details:'testingUserPreferencesReducerErrorDetails',
          statusCode:'testingUserPreferencesReducerErrorStatusCode',
        }
      }
      const expectedValue = {'errorMessage': 'testingUserPreferencesReducerErrorDetails', 'status': 'ERROR', 'statusCode': 'testingUserPreferencesReducerErrorStatusCode', 'test': 'testUserPreferences'}
      expect(userpreferences(state, action)).toEqual(expectedValue)
    })
  })
})

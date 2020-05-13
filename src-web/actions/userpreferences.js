/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
import {
  USERPREFERENCES_RECEIVE_SUCCESS, USERPREFERENCES_RECEIVE_FAILURE,
} from './index'

export const userPreferencesReceiveSuccess = userPreferences => ({
  type: USERPREFERENCES_RECEIVE_SUCCESS,
  userPreferences
})

export const userPreferencesReceiveFailure = err => ({ type: USERPREFERENCES_RECEIVE_FAILURE, err })

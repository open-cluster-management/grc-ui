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
  USER_ACCESS_SUCCESS, USER_ACCESS_FAILURE,
} from './index'

export const userAccessSuccess = access => ({
  type: USER_ACCESS_SUCCESS,
  access
})

export const userAccessFailure = err => ({ type: USER_ACCESS_FAILURE, err })

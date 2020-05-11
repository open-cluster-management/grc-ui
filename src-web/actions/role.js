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
  ROLE_RECEIVE_SUCCESS, ROLE_RECEIVE_FAILURE,
} from './index'


export const roleReceiveSuccess = role => ({
  type: ROLE_RECEIVE_SUCCESS,
  role
})

export const roleReceiveFailure = err => ({ type: ROLE_RECEIVE_FAILURE, err })

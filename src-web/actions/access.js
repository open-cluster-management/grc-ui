/* Copyright (c) 2020 Red Hat, Inc. */
import {
  USER_ACCESS_SUCCESS, USER_ACCESS_FAILURE,
} from './index'

export const userAccessSuccess = access => ({
  type: USER_ACCESS_SUCCESS,
  access
})

export const userAccessFailure = err => ({ type: USER_ACCESS_FAILURE, err })

/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

import {
  USER_ACCESS_SUCCESS, USER_ACCESS_FAILURE,
} from './index'
import GrcApolloClient from '../../lib/client/apollo-client'

export const userAccessSuccess = access => ({
  type: USER_ACCESS_SUCCESS,
  access
})

export const userAccessFailure = err => ({ type: USER_ACCESS_FAILURE, err })

export const getUserAccessData = () => {
  return (dispatch) => {
    return GrcApolloClient.getUserAccess()
      .then(response => {
        if (response.errors) {
          return dispatch(userAccessFailure(response.errors[0]))
        }
        return dispatch(userAccessSuccess(response.data.items))
      })
      .catch(err => dispatch(userAccessFailure(err)))
  }
}

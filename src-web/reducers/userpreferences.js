/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import {
  USERPREFERENCES_RECEIVE_SUCCESS,
  USERPREFERENCES_RECEIVE_FAILURE,
  REQUEST_STATUS
} from '../actions'

export const userpreferences = (state = null, action) => {
  if (action) {
    switch (action.type) {
    case USERPREFERENCES_RECEIVE_SUCCESS:
      return { ...action, status: REQUEST_STATUS.DONE }
    case USERPREFERENCES_RECEIVE_FAILURE:
      return { ...state,
        status: REQUEST_STATUS.ERROR,
        errorMessage: action.err && action.err.details,
        statusCode: action.err && action.err.statusCode }
    default:
      return state
    }
  }
  else {
    return null
  }
}

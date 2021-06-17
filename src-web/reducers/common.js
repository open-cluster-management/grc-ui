/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

/*
Since these selectors are common (i.e used across different components and different parts of the store)
we have to create unique selectors each invocation and the selectors need additional metata data sent
though props that indicate which part of the store it should select from.

//See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
//See https://github.com/reactjs/reselect#q-can-i-share-a-selector-across-multiple-components

The selector pattern is an abstraction that standardizes an application’s store querying logic.
It is simple: for any part of the store that an application needs access to, define a function that
when given the full store, returns the desired part (or derivation) of the store.
*/

import _ from 'lodash'
import { RESOURCE_TYPES } from '../utils/constants'
import {
  PAGE_SIZES, CLEAR_REQUEST_STATUS, POST_REQUEST, PUT_REQUEST,
  PATCH_REQUEST, ACTIVE_FILTER_UPDATE, AVAILABLE_FILTER_UPDATE, REQUEST_STATUS, POST_RECEIVE_SUCCESS,
  PUT_RECEIVE_SUCCESS, PATCH_RECEIVE_SUCCESS, DEL_RECEIVE_SUCCESS,
  POST_RECEIVE_FAILURE, PUT_RECEIVE_FAILURE, PATCH_RECEIVE_FAILURE,
  SECONDARY_HEADER_UPDATE, RESOURCE_REQUEST, RESOURCE_RECEIVE_SUCCESS,
  RESOURCE_RECEIVE_FAILURE, RESOURCE_MUTATE, RESOURCE_MUTATE_FAILURE,
  RESOURCE_MUTATE_SUCCESS
} from '../actions'

export const INITIAL_STATE = {
  items: [],
  itemsPerPage: PAGE_SIZES.DEFAULT,
  page: 1,
  search: '',
  sortColumn: undefined,
  status: REQUEST_STATUS.INCEPTION,
  patchStatus: undefined,
  patchErrorMsg: '',
  putStatus: undefined,
  putErrorMsg: '',
  postStatus: undefined,
  postStatusCode: undefined,
  postErrorMsg: '',
  pendingActions: [],
}

export const resourceToolbar = (state = {}, action) => {
  switch (action.type) {
  case ACTIVE_FILTER_UPDATE:
    return Object.assign({}, state, {
      activeFilters: action.activeFilters,
    })
  case AVAILABLE_FILTER_UPDATE:
    return Object.assign({}, state, {
      availableFilters: action.availableFilters,
    })
  default:
    return state
  }
}

export const secondaryHeader = (state = {title: '', tabs: [], breadcrumbItems: [], links: [], description: {}, information:{}}, action) => {
  switch (action.type) {
  case SECONDARY_HEADER_UPDATE:
    return Object.assign({}, state, {
      title: action.title,
      tabs: action.tabs,
      breadcrumbItems: action.breadcrumbItems,
      links: action.links,
      description: action.description,
      information: action.information
    })
  default:
    return state
  }
}

export const resourceReducerFunction = (state = INITIAL_STATE, action) => {
  let items,index
  switch (action.type) {
    case RESOURCE_REQUEST:
      return Object.assign({}, state, {
        status: REQUEST_STATUS.IN_PROGRESS
      })
    case RESOURCE_RECEIVE_SUCCESS: {
     let pageNumber = 1
      if (action.items.length !== 0 && state.page && state.itemsPerPage) {
        if (action.items.length > state.itemsPerPage * (state.page - 1)) {
          pageNumber = state.page
        } else {
          pageNumber = state.page - 1
        }
      }
      return Object.assign({}, state, {
        status: REQUEST_STATUS.DONE,
        items: action.items,
        page: pageNumber,
        resourceVersion: action.resourceVersion
      })
    }
    case RESOURCE_RECEIVE_FAILURE:
      return Object.assign({}, state, {
        status: REQUEST_STATUS.ERROR,
        err: action.err
      })
    case POST_REQUEST:
      return Object.assign({}, state, {
        postStatus: REQUEST_STATUS.IN_PROGRESS
      })
    case POST_RECEIVE_SUCCESS:
      items = state.items.slice(0)
      if (action.item.length > 0) { // if returned as an array due to making async calls, push action.item elements to the items array
        action.item.forEach(el => {
          items.push(el)
        })
      } else {
        items.push(action.item)
      }
      return Object.assign({}, state, {
        items: items,
        postStatus: REQUEST_STATUS.DONE
      })
    case POST_RECEIVE_FAILURE:
      return Object.assign({}, state, {
        postStatus: REQUEST_STATUS.ERROR,
        postStatusCode: action.err.error && action.err.error.response && action.err.error.response.status,
        postErrorMsg: action.err.error && action.err.error.message
      })
    case PUT_REQUEST:
      return Object.assign({}, state, {
        putStatus: REQUEST_STATUS.IN_PROGRESS
      })
    case PUT_RECEIVE_SUCCESS:
      return Object.assign({}, state, {
        putStatus: REQUEST_STATUS.DONE,
      })
    case PUT_RECEIVE_FAILURE:
      return Object.assign({}, state, {
        putStatus: REQUEST_STATUS.ERROR,
        putErrorMsg: action.err.error ? action.err.error.message : action.err.message
      })
    case PATCH_REQUEST:
      return Object.assign({}, state, {
        patchStatus: REQUEST_STATUS.IN_PROGRESS
      })
    case PATCH_RECEIVE_SUCCESS:
      return Object.assign({}, state, {
        patchStatus: REQUEST_STATUS.DONE,
      })
    case PATCH_RECEIVE_FAILURE:
      return Object.assign({}, state, {
        patchStatus: REQUEST_STATUS.ERROR,
        patchErrorMsg: action.err.error ? action.err.error.message : action.err.message
      })
    case CLEAR_REQUEST_STATUS:
      return Object.assign({}, state, {
        mutateStatus: undefined,
        mutateErrorMsg: undefined,
        postStatus: undefined,
        postStatusCode: undefined,
        postErrorMsg: undefined,
        putStatus: undefined,
        putErrorMsg: undefined,
        patchStatus: undefined,
        patchErrorMsg: undefined
      })
    case RESOURCE_MUTATE:
      return Object.assign({}, state, {
        mutateStatus: REQUEST_STATUS.IN_PROGRESS,
        mutateErrorMsg: null,
        pendingActions: [...state.pendingActions, { name: action.resourceName, action: RESOURCE_MUTATE }]
      })
    case RESOURCE_MUTATE_FAILURE:
      return Object.assign({}, state, {
        mutateStatus: REQUEST_STATUS.ERROR,
        mutateErrorMsg: action.err.message || action.err.error && (action.err.error.message ||
          (action.err.error.data && action.err.error.data.Message)),
        pendingActions: state.pendingActions.filter(r => r && r.name !== action.resourceName),
      })
    case RESOURCE_MUTATE_SUCCESS:
      return Object.assign({}, state, {
        mutateStatus: REQUEST_STATUS.DONE,
        pendingActions: state.pendingActions.filter(r => r && r.name !== action.resourceName),
      })
    case DEL_RECEIVE_SUCCESS:
      {
        items = [...state.items]
        switch (action.resourceType) {
        case RESOURCE_TYPES.POLICIES_BY_POLICY:
        case RESOURCE_TYPES.POLICY: {
          const policy = _.get(action, 'resource')
          index = _.findIndex(items, { 'name':policy.name, 'namespace':policy.namespace })
          break
        }
        default:
          index = _.findIndex(items, o => _.get(o, 'Name') === _.get(action, 'resourceName'))
          break
        }
        if(index > -1) {
          items.splice(index, 1)
          return Object.assign({}, state, {
            items: items
          })
        }
        return state
      }
    default:
      return state
  }
}

/**
 * A common higher order reducer for resources
 * Follows the Redux pattern described here: http://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html#customizing-behavior-with-higher-order-reducers
 * **/
export const createResourceReducer = (reducerFunction, reducerPredicate) => {
  return (state, action) => {
    const isInitializationCall = state === undefined
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state
  }
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
import lodash from 'lodash'

import * as Actions from './index'
import GrcApolloClient from '../../lib/client/apollo-client'
import { formatExpandablePolicies } from '../components/common/FormatTableData'

export const changeTablePage = ({page, pageSize}, resourceType) => ({
  type: Actions.TABLE_PAGE_CHANGE,
  page,
  pageSize,
  resourceType
})

export const searchTable = (search, resourceType) => ({
  type: Actions.TABLE_SEARCH,
  search,
  resourceType
})

export const sortTable = (sortDirection, sortColumn, resourceType) => ({
  type: Actions.TABLE_SORT,
  sortDirection,
  sortColumn,
  resourceType
})

export const receiveResourceSuccess = (response, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  items: response.items,
  resourceVersion: lodash.get(response, 'metadata.resourceVersion'), //only supported on k8s resoruces
  resourceType
})

export const receiveResourceError = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const requestResource = (resourceType) => ({
  type: Actions.RESOURCE_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const addResource = (item, resourceType) => ({
  type: Actions.RESOURCE_ADD,
  resourceType: item.kind || resourceType,
  item
})

export const modifyResource = (item, resourceType) => ({
  type: Actions.RESOURCE_MODIFY,
  resourceType: item.kind || resourceType,
  item
})

export const deleteResource = (item, resourceType) => ({
  type: Actions.RESOURCE_DELETE,
  resourceType: item.kind || resourceType,
  item
})

export const mutateResource = (resourceType, resourceName) => ({
  type: Actions.RESOURCE_MUTATE,
  resourceName,
  resourceType,
})

export const mutateResourceSuccess = (resourceType, resourceName) => ({
  type: Actions.RESOURCE_MUTATE_SUCCESS,
  resourceName,
  resourceType,
})

export const mutateResourceFailure = (resourceType, error) => ({
  type: Actions.RESOURCE_MUTATE_FAILURE,
  postStatus: Actions.REQUEST_STATUS.ERROR,
  err: { error },
  resourceType,
})


export const fetchResources = (resourceType, vars) => {
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    return GrcApolloClient.get(resourceType, vars)
      .then(response => {
        if (response.errors) {
          return dispatch(receiveResourceError(response.errors[0], resourceType))
        }
        return dispatch(receiveResourceSuccess({items: lodash.cloneDeep(formatExpandablePolicies(response.data.items))}, resourceType))
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const fetchResource = (resourceType, namespace, name) => {
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    return GrcApolloClient.getResource(resourceType, {namespace, name})
      .then(response => {
        if (response.errors) {
          return dispatch(receiveResourceError(response.errors[0], resourceType))
        }
        return dispatch(receiveResourceSuccess({items: lodash.cloneDeep(response.data.items)}, resourceType))
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const updateResourceLabels = (resourceType, namespace, name, labels, selfLink) => {
  return (dispatch) => {
    dispatch(putResource(resourceType))
    return GrcApolloClient.updateResourceLabels(resourceType.name, namespace, name, labels, selfLink, '/metadata/labels')
      .then(response => {
        if (response.errors) {
          return dispatch(receivePutError(response.errors[0], resourceType))
        }
        dispatch(fetchResources(resourceType))
        dispatch(updateModal({open: false, type: 'label-editing'}))
        return dispatch(receivePutResource(resourceType))
      })
      .catch(err => dispatch(receivePutError(err, resourceType)))
  }
}

export const editResource = (resourceType, namespace, name, body, selfLink, resourcePath) => (dispatch => {
  dispatch(putResource(resourceType))
  return GrcApolloClient.updateResource(resourceType.name, namespace, name, body, selfLink, resourcePath)
    .then(response => {
      if (response.errors) {
        return dispatch(receivePutError(response.errors[0], resourceType))
      } else {
        dispatch(updateModal({open: false, type: 'resource-edit'}))
      }
      dispatch(fetchResources(resourceType))
      return dispatch(receivePutResource(response, resourceType))
    })
})

export const disableResource = (resourceType, namespace, name, body, selfLink, resourcePath) => (dispatch => {
  dispatch(patchResource(resourceType))
  return GrcApolloClient.updateResource(resourceType.name, namespace, name, body, selfLink, resourcePath)
    .then(response => {
      if (response.errors) {
        return dispatch(receivePatchError(response.errors[0], resourceType))
      } else {
        dispatch(updateModal({open: false, type: 'resource-disable'}))
      }
      dispatch(fetchResources(resourceType))
      return dispatch(receivePatchResource(response, resourceType))
    })
})

export const removeResource = (resourceType, vars) => async dispatch => {
  dispatch(delResource(resourceType))
  try {
    const response = await GrcApolloClient.remove(vars)
    if (response.errors) {
      return dispatch(receiveDelError(response.errors, resourceType))
    }
    dispatch(receiveDelResource(response, resourceType, vars))
  } catch (err) {
    return dispatch(receiveDelError(err, resourceType))
  }
}

export const updateActiveFilters = (activeFilters) => ({
  type: Actions.ACTIVE_FILTER_UPDATE,
  activeFilters,
})

export const updateResourceToolbar = (refreshControl, availableFilters) => ({
  type: Actions.RESOURCE_TOOLBAR_UPDATE,
  refreshControl,
  availableFilters
})

export const updateSecondaryHeader = (title, tabs, breadcrumbItems, links, description, information) => ({
  type: Actions.SECONDARY_HEADER_UPDATE,
  title,
  tabs,
  breadcrumbItems,
  links,
  description,
  information
})

export const updateModal = (data) => ({
  type: Actions.MODAL_UPDATE,
  data
})

export const postResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.POST_REQUEST,
  postStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePostResource = (item, resourceType) => ({
  type: Actions.POST_RECEIVE_SUCCESS,
  postStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item
})

export const receivePostError = (err, resourceType) => ({
  type: Actions.POST_RECEIVE_FAILURE,
  postStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const putResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.PUT_REQUEST,
  putStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePutResource = (item, resourceType) => {
  return ({
    type: Actions.PUT_RECEIVE_SUCCESS,
    putStatus: Actions.REQUEST_STATUS.DONE,
    resourceType: item.kind || resourceType,
    item
  })
}

export const receivePutError = (err, resourceType) => ({
  type: Actions.PUT_RECEIVE_FAILURE,
  putStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const patchResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.PATCH_REQUEST,
  patchStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePatchResource = (item, resourceType) => {
  return ({
    type: Actions.PATCH_RECEIVE_SUCCESS,
    patchStatus: Actions.REQUEST_STATUS.DONE,
    resourceType: item.kind || resourceType,
    item
  })
}

export const receivePatchError = (err, resourceType) => ({
  type: Actions.PATCH_RECEIVE_FAILURE,
  patchStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const delResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.DEL_REQUEST,
  delStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveDelResource = (item, resourceType, resource) => ({
  type: Actions.DEL_RECEIVE_SUCCESS,
  delStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item,
  resource
})

export const receiveDelError = (err, resourceType) => ({
  type: Actions.DEL_RECEIVE_FAILURE,
  delStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const clearRequestStatus = (resourceType) => ({
  type: Actions.CLEAR_REQUEST_STATUS,
  resourceType: resourceType
})

export const resetResource = (resourceType) => ({
  type: Actions.RESOURCE_RESET,
  resourceType: resourceType
})

export const createResources = (resourceType, resourceJson) => {
  return (dispatch) => {
    dispatch(mutateResource(resourceType))
    return GrcApolloClient.createResources(resourceJson)
      .then(result => {
        if (result.data.createResources.errors && result.data.createResources.errors.length > 0){
          dispatch(mutateResourceFailure(resourceType, result.data.createResources.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(resourceType))
        }
        return result
      })
  }
}

export const createResource = (resourceType, variables) => {
  return (dispatch) => {
    dispatch(postResource(resourceType))
    return GrcApolloClient.createResource(resourceType, variables)
      .then(response => {
        if (response.errors) {
          return dispatch(receivePostError(response.errors[0], resourceType))
        }

        return dispatch(receivePostResource(lodash.cloneDeep(response.data.setHelmRepo), resourceType))
      })
      .catch(err => dispatch(receivePostError(err, resourceType)))
  }
}

export const createPolicy = (resourceType, resourceJson) => {
  return (dispatch) => {
    dispatch(mutateResource(resourceType))
    return GrcApolloClient.createPolicy(resourceJson)
      .then(result => {
        if (result.errors && result.errors.length > 0){
          dispatch(mutateResourceFailure(resourceType, result.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(resourceType))
        }
        return result
      })
  }
}

export const createCompliance = (resourceType, resourceJson) => {
  return (dispatch) => {
    dispatch(mutateResource(resourceType))
    return GrcApolloClient.createCompliance(resourceJson)
      .then(result => {
        if (result.errors && result.errors.length > 0){
          dispatch(mutateResourceFailure(resourceType, result.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(resourceType))
        }
        return result
      })
  }
}

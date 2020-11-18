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

import React from 'react'
import { connect } from 'react-redux'
import loadable from '@loadable/component'

let RemoveResourceModal, ResourceModal, PolicyActionModal

const Modal = ({ type, open, ...rest }) => {
  switch (type) {
  case 'resource-remove':
    console.log(open && getRemoveResourceModal({ type, open, ...rest }))
    return open && getRemoveResourceModal({ type, open, ...rest })
  case 'resource-edit':
    return open && getResourceModal({ type, open, ...rest })
  case 'resource-disable':
  case 'resource-enable':
  case 'resource-enforce':
  case 'resource-inform':
    return open && getPolicyActionModal({ type, open, ...rest })
  default:
    return null
  }
}

const getPolicyActionModal = props => {
  PolicyActionModal = PolicyActionModal === undefined
    ? loadable(() => import(/* webpackChunkName: "policy-action-modal" */ '../modals/PolicyActionModal'))
    : PolicyActionModal
  return getModal(PolicyActionModal, props)
}

const getResourceModal = props => {
  ResourceModal = ResourceModal === undefined
    ? loadable(() => import(/* webpackChunkName: "edit-resource-modal" */ '../modals/ResourceModal'))
    : ResourceModal
  return getModal(ResourceModal, props)
}

const getRemoveResourceModal = props => {
  RemoveResourceModal = RemoveResourceModal === undefined
    ? loadable(() => import(/* webpackChunkName: "remove-resource-modal" */ '../modals/RemoveResourceModal'))
    : RemoveResourceModal
  return getModal(RemoveResourceModal, props)
}

const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)

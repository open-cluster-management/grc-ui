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

let RemoveResourceModal, ResourceModal, DescriptionModal,
    PolicySidePanelDetailsModal, FindingSidePanelDetailsModal,
    DisableModal, EnableModal, EnforceModal, InformModal

const Modal = ({ type, open, ...rest }) => {
  switch (type) {
  case 'resource-remove':
    return open && getRemoveResourceModal({ type, open, ...rest })
  case 'resource-edit':
    return open && getResourceModal({ type, open, ...rest })
  case 'description':
    return open && getDescriptionModal({ type, open, ...rest })
  case 'policy-side-panel':
    return open && getPolicySidePanelDetailsModal({ type, open, ...rest })
  case 'finding-side-panel':
    return open && getFindingSidePanelDetailsModal({ type, open, ...rest })
  case 'resource-disable':
    return open && getDisableModal({ type, open, ...rest })
  case 'resource-enable':
    return open && getEnableModal({ type, open, ...rest })
  case 'resource-enforce':
    return open && getEnforceModal({ type, open, ...rest })
  case 'resource-inform':
    return open && getInformModal({ type, open, ...rest })
  default:
    return null
  }
}

const getEnforceModal = props => {
  EnforceModal = EnforceModal === undefined
    ? loadable(() => import(/* webpackChunkName: "enforce-modal" */ '../modals/EnforceModal'))
    : EnforceModal
  return getModal(EnforceModal, props)
}

const getInformModal = props => {
  InformModal = InformModal === undefined
    ? loadable(() => import(/* webpackChunkName: "inform-modal" */ '../modals/InformModal'))
    : InformModal
  return getModal(InformModal, props)
}

const getDisableModal = props => {
  DisableModal = DisableModal === undefined
    ? loadable(() => import(/* webpackChunkName: "disable-modal" */ '../modals/DisableModal'))
    : DisableModal
  return getModal(DisableModal, props)
}

const getEnableModal = props => {
  EnableModal = EnableModal === undefined
    ? loadable(() => import(/* webpackChunkName: "enable-modal" */ '../modals/EnableModal'))
    : EnableModal
  return getModal(EnableModal, props)
}

const getDescriptionModal = props => {
  DescriptionModal = DescriptionModal === undefined
    ? loadable(() => import(/* webpackChunkName: "description-modal" */ '../modals/DescriptionModal'))
    : DescriptionModal
  return getModal(DescriptionModal, props)
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

const getPolicySidePanelDetailsModal = props => {
  PolicySidePanelDetailsModal = PolicySidePanelDetailsModal === undefined
    ? loadable(() => import(/* webpackChunkName: "details-policy-side-panel-modal" */ '../modals/PolicySidePanelDetailsModal'))
    : PolicySidePanelDetailsModal
  return getModal(PolicySidePanelDetailsModal, props)
}

const getFindingSidePanelDetailsModal = props => {
  FindingSidePanelDetailsModal = FindingSidePanelDetailsModal === undefined
    ? loadable(() => import(/* webpackChunkName: "details-finding-side-panel-modal" */ '../modals/FindingSidePanelDetailsModal'))
    : FindingSidePanelDetailsModal
  return getModal(FindingSidePanelDetailsModal, props)
}

const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)

/* eslint-disable import/no-named-as-default */
/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PolicyActionModal from '../modals/PolicyActionModal'
import ResourceModal from '../modals/ResourceModal'
import RemoveResourceModal from '../modals/RemoveResourceModal'

const Modal = ({ type, open, ...rest }) => {
  switch (type) {
  case 'resource-remove':
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
  return getModal(PolicyActionModal, props)
}

const getResourceModal = props => {
  return getModal(ResourceModal, props)
}

const getRemoveResourceModal = props => {
  return getModal(RemoveResourceModal, props)
}

const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)

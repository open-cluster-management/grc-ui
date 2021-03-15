/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import '@patternfly/react-core/dist/styles/base.css'
import { AcmModal, AcmButton, AcmAlert } from '@open-cluster-management/ui-components'
import { Spinner, ButtonVariant } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import { withRouter } from 'react-router-dom'
import { REQUEST_STATUS } from '../../actions/index'
import {
  enforcResource, disableResource, clearRequestStatus, receivePatchError, updateModal,
} from '../../actions/common'
export class PolicyActionModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  handleSubmitClick() {
    const { type:modalType, handleSubmit, data:rawData, resourceType } = this.props
    let resourcePath = '', data = '', dispatchFun = null
    switch(modalType) {
    case 'resource-disable':
      data = true
      resourcePath = '/spec/disabled'
      dispatchFun = disableResource
      break
    case 'resource-enable':
      data = false
      resourcePath = '/spec/disabled'
      dispatchFun = disableResource
      break
    case 'resource-enforce':
      data = 'enforce'
      resourcePath = '/spec/remediationAction'
      dispatchFun = enforcResource
      break
    case 'resource-inform':
      data = 'inform'
      resourcePath = '/spec/remediationAction'
      dispatchFun = enforcResource
      break
    default:
      break
    }
    handleSubmit(resourceType, rawData.namespace, rawData.name, data, rawData, resourcePath, dispatchFun)
  }

  handleCloseClick() {
    const { type:modalType, handleClose } = this.props
    handleClose(modalType)
  }

  render() {
    const { type:modalType, label, locale, open, reqErrorMsg, reqStatus } = this.props
    let dangerFlag = 'default', modalId = '', modalMsg = ''
    switch(modalType) {
    case 'resource-disable':
      dangerFlag = 'danger'
      modalId = 'disable-resource-modal'
      modalMsg = 'modal.disable.description'
      break
    case 'resource-enable':
      modalId = 'enable-resource-modal'
      modalMsg = 'modal.enable.description'
      break
    case 'resource-enforce':
      dangerFlag = 'danger'
      modalId = 'enforce-resource-modal'
      modalMsg = 'modal.enforce.description'
      break
    case 'resource-inform':
      modalId = 'inform-resource-modal'
      modalMsg = 'modal.inform.description'
      break
    default:
      break
    }
    return (
      <div>
        {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Spinner className='patternfly-spinner' />}
        <AcmModal
          titleIconVariant={dangerFlag}
          variant='medium'
          id={modalId}
          isOpen={open}
          showClose={true}
          onClose={this.handleCloseClick}
          title={msgs.get(label.heading, locale)}
          actions={[
            <AcmButton key="cancel" variant={ButtonVariant.link} onClick={this.handleCloseClick}>
            {msgs.get('modal.button.cancel', locale)}
            </AcmButton>,
            <AcmButton key="confirm" variant={ButtonVariant.primary} onClick={this.handleSubmitClick}>
                {msgs.get(label.primaryBtn, locale)}
            </AcmButton>,
          ]}
        >
          <div>
            {reqStatus === REQUEST_STATUS.ERROR &&
              <AcmAlert
                variant='danger'
                title=''
                subtitle={reqErrorMsg || msgs.get('error.default.description', locale)} />}
          </div>
           {msgs.get(modalMsg, locale)}
        </AcmModal>
      </div>
    )
  }
}

PolicyActionModal.propTypes = {
  data: PropTypes.shape({
    metadata: PropTypes.object,
    name: PropTypes.string,
    namespace: PropTypes.string,
  }),
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
    primaryBtn: PropTypes.string,
  }),
  locale: PropTypes.string,
  open:  PropTypes.bool,
  reqErrorMsg:  PropTypes.string,
  reqStatus:  PropTypes.string,
  resourceType: PropTypes.object,
  type: PropTypes.string,
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (resourceType, namespace, name, data, resourceData, resourcePath, dispatchFun) => {
      dispatch(dispatchFun(resourceType, namespace, name, data, resourceData, resourcePath))
    },
    handleClose: (modalType) => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: modalType}))
    },
    receivePatchError: (resourceType, err) => {
      dispatch(receivePatchError(err, resourceType))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyActionModal))

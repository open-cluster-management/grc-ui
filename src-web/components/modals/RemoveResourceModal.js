/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox, Modal, Notification } from 'carbon-components-react'
import { Spinner } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import { withRouter } from 'react-router-dom'
import { REQUEST_STATUS } from '../../actions/index'
import { removeResource, clearRequestStatus, receiveDelError, updateModal } from '../../actions/common'

class RemoveResourceModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.state = {
      selected: [],
    }
  }

  UNSAFE_componentWillMount() {
    const { data } = this.props
    const placements = _.get(data, 'raw.status.placement', [])
    const placementBindings = placements.map(placement => {
      return {
        name: placement.placementBinding,
        selfLink: `/apis/policy.open-cluster-management.io/v1/namespaces/${data.namespace}/placementbindings/${placement.placementBinding}`,
      }
    })
    const placementRules = placements.map(placement => {
      return {
        name: placement.placementRule,
        selfLink: `/apis/apps.open-cluster-management.io/v1/namespaces/${data.namespace}/placementrules/${placement.placementRule}`,
      }
    })
    const children = []
    // Create object specifying Application resources that can be deleted
    _.map(data.deployables, (curr, idx) => {
      children.push({
        id: idx + '-deployable-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [Deployable]',
        selected: true
      })
    })
    _.map(placementBindings, (curr, idx) => {
      children.push({
        id: idx + '-placementBinding-' + curr.name,
        selfLink: curr.selfLink,
        label: curr.name + ' [PlacementBinding]',
        selected: true
      })
    })
    _.map(placementRules, (curr, idx) => {
      children.push({
        id: idx + '-placementPolicy-' + curr.name,
        selfLink: curr.selfLink,
        label: curr.name + ' [PlacementPolicy]',
        selected: true
      })
    })
    _.map(data.applicationRelationships, (curr, idx) => {
      children.push({
        id: idx + '-appRelationship-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [ApplicationRelationship]',
        selected: true
      })
    })
    if (children.length > 0 && this.state.selected.length < 1) {
      this.setState({selected: children})
    }
  }

  toggleSelectedSetState = (target) => {
    this.setState((prevState) => {
      const currState = prevState.selected
      const index = currState.findIndex(item => item.id === target)
      currState[index].selected = !currState[index].selected
      return currState
    })
  }

  toggleSelected = (i, target) => {
    this.toggleSelectedSetState(target)
  }

  toggleSelectedKeyboard = (target) => {
    this.toggleSelectedSetState(target)
  }

  handleSubmitClick() {
    const { handleSubmit, data } = this.props
    data.selected = this.state.selected
    handleSubmit()
  }

  modalBody = (data, label, locale) => {
    switch (label.label) {
    case 'modal.remove-hcmapplication.label':
    case 'modal.remove-hcmcompliance.label':
    case 'modal.remove-hcmpolicypolicy.label':
      return this.state.selected.length > 0
        ? <div className='remove-app-modal-content' >
          <div className='remove-app-modal-content-text' >
            {msgs.get('modal.remove.application.confirm', [data.name || data.Name || data.metadata.name], locale)}
          </div>
          <div>
            {this.state.selected.map((child) => {
              return (
                <div className='remove-app-modal-content-data' key={child.id} >
                  <Checkbox
                    id={child.id}
                    checked={this.state.selected.some((i) => {return (i.id === child.id && child.selected === true)})}
                    onChange={this.toggleSelected}
                    onKeyPress={this.toggleSelectedKeyboard.bind(this, child.id)}
                    labelText={child.label}
                    aria-label={child.id} />
                </div>
              )}
            )}
          </div>
        </div>
        : <p>
          {msgs.get('modal.remove.confirm', [data.name || data.Name || data.metadata.name], locale)}
        </p>
    default:
      return (
        <p>
          {msgs.get('modal.remove.confirm', [data.name || data.Name || data.metadata.name], locale)}
        </p>
      )}
  }

  render() {
    const { data, handleClose, label, locale, open, reqErrorMsg, reqStatus } = this.props
    return (
      <div>
        {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Spinner className='patternfly-spinner' />}
        <Modal
          danger
          id='remove-resource-modal'
          open={open}
          primaryButtonText={msgs.get(label.primaryBtn, locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalLabel={msgs.get(label.label, locale)}
          modalHeading={msgs.get(label.heading, locale)}
          onRequestClose={handleClose}
          onRequestSubmit={this.handleSubmitClick}
          role='region'
          aria-label={msgs.get(label.heading, locale)}>
          <div>
            {reqStatus === REQUEST_STATUS.ERROR &&
              <Notification
                kind='error'
                title=''
                subtitle={reqErrorMsg || msgs.get('error.default.description', locale)} />}
          </div>
          {this.modalBody(data, label, locale)}
        </Modal>
      </div>
    )
  }
}

RemoveResourceModal.propTypes = {
  data: PropTypes.shape({
    deployables: PropTypes.object,
    name: PropTypes.string,
    namespace: PropTypes.string,
    applicationRelationships: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    selected: PropTypes.array,
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
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSubmit: () => {
      dispatch(removeResource(ownProps.resourceType, ownProps.data))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: 'resource-remove'}))
    },
    receiveDelError: (resourceType, err) => {
      dispatch(receiveDelError(err, resourceType))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveResourceModal))

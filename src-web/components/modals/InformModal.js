/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Loading, Notification } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { withRouter } from 'react-router-dom'
import { REQUEST_STATUS } from '../../actions/index'
import { enforcResource, clearRequestStatus, receivePatchError, updateModal } from '../../actions/common'

export class InformModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
  }

  handleSubmitClick() {
    const { handleSubmit, data, resourceType } = this.props
    handleSubmit(resourceType, data.namespace, data.name, 'inform', data.metadata.selfLink, '/spec/remediationAction')
  }

  render() {
    const { handleClose, locale, label, open, reqErrorMsg, reqStatus } = this.props
    return (
      <div>
        {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Loading withOverlay={false} />}
        <Modal
          id='inform-resource-modal'
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
          <p>{msgs.get('modal.inform.description', locale)}</p>
        </Modal>
      </div>
    )
  }
}

InformModal.propTypes = {
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
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (resourceType, namespace, name, data, selfLink, resourcePath) => {
      dispatch(enforcResource(resourceType, namespace, name, data, selfLink, resourcePath))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: 'resource-inform'}))
    },
    receivePatchError: (resourceType, err) => {
      dispatch(receivePatchError(err, resourceType))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InformModal))

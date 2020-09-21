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
import PropTypes from 'prop-types'
import { Modal } from 'carbon-components-react'
import {updateModal, } from '../../actions/common'
import {connect} from 'react-redux'

class DescriptionModal extends React.PureComponent {

  handleModalClose = () => {
    const { updateModal:localUpdateModal } = this.props
    localUpdateModal()
  }

  render(){
    const { content, title } = this.props
    return (
      <div className={'search-guide-modal'}>
        <Modal
          passiveModal
          open={this.props.open}
          onRequestClose={this.handleModalClose}
          modalHeading={title}
          primaryButtonDisabled={true}
        >
          <div>
            <div className={'bx--modal-content-body'}>
              <p>{content}</p>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

DescriptionModal.propTypes = {
  content: PropTypes.string,
  open: PropTypes.bool,
  title: PropTypes.string,
  updateModal: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateModal: () => dispatch(updateModal({ open: false }))
  }
}

export default connect(null, mapDispatchToProps)(DescriptionModal)


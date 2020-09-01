/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import jsYaml from 'js-yaml'
import { Button, InlineNotification, Loading, Modal } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import YamlEditor from '../common/YamlEditor'
import _ from 'lodash'

resources(() => {
  require('../../../scss/modal.scss')
})

const initialState = {
  modalOpen: false,
  processing: false,
  yaml: '',
  yamlParsingError: null,
  requestError: null
}

export class CreateResourceModal extends React.PureComponent {
  static propTypes = {
    headingTextKey: PropTypes.string,
    onCreateResource: PropTypes.func,
    resourceDescriptionKey: PropTypes.string,
    submitBtnTextKey: PropTypes.string,
  }

  state = initialState

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }
  handleModalCancel = () => {
    this.setState(initialState)
  }
  handleModalSubmit = () => {
    let localResources
    try {
      // the next line code will split the yaml content into multi-parts
      // if '---' found in the content
      localResources = jsYaml.safeLoadAll(this.state.yaml)
    } catch (e) {
      this.setState({ yamlParsingError: e })
      return
    }
    this.setState({ yamlParsingError: null, processing: true })
    this.props.onCreateResource && this.props.onCreateResource(localResources)
      .then((data) => {
        const error = _.get(data, 'data.createResources.errors[0].message')
        if (error) {
          this.setState({requestError: error, processing: false})
        } else {
          this.setState(initialState)
        }
      })
  }

  handleEditorChange = (yaml) => this.setState({ yaml })

  handleNotificationClosed = () => this.setState({ yamlParsingError: null, requestError: null })

  isSubmitDisabled = () => this.state.processing === true

  render(){
    return (
      <div>
        <Button icon="add--glyph" small id={msgs.get(this.props.submitBtnTextKey, this.context.locale)} key='create-resource' onClick={this.handleModalOpen}>
          { msgs.get(this.props.submitBtnTextKey, this.context.locale) }
        </Button>
        {this.state.modalOpen && <Modal
          className='modal-with-editor'
          open={this.state.modalOpen}
          modalHeading={ msgs.get(this.props.headingTextKey, this.context.locale) }
          primaryButtonText={ msgs.get(this.props.submitBtnTextKey, this.context.locale) }
          primaryButtonDisabled={this.isSubmitDisabled()}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={this.handleModalSubmit}
          onRequestClose={this.handleModalCancel}
        >
          <div className='bx--modal-content-desc'>
            { msgs.get(this.props.resourceDescriptionKey, this.context.locale) }
            <br />
            {/* TODO: Zack Layne - Awaiting actual documentation link
            <Link to={''}>
              {msgs.get('link.more.info', this.context.locale)}
            </Link> */}
          </div>
          {this.state.yamlParsingError &&
            <InlineNotification
              kind='error'
              title={msgs.get('error.parse', this.context.locale)}
              iconDescription=''
              subtitle={this.state.yamlParsingError.reason}
              onCloseButtonClick={this.handleNotificationClosed}
            />
          }
          {this.state.requestError &&
            <InlineNotification
              kind='error'
              title={msgs.get('error.request', this.context.locale)}
              iconDescription=''
              subtitle={this.state.requestError}
              onCloseButtonClick={this.handleNotificationClosed}
            />
          }
          <YamlEditor onYamlChange={this.handleEditorChange} yaml={this.state.yaml} />
          {this.state.processing && <Loading withOverlay={false} />}
        </Modal>}
      </div>
    )
  }
}

CreateResourceModal.contextTypes = {
  locale: PropTypes.string
}

const mapDispatchToProps = (dispatch, { onCreateResource }) => {
  return {
    onCreateResource: (yaml) => onCreateResource(dispatch, yaml)
  }
}

export default connect(() => ({}), mapDispatchToProps)(CreateResourceModal)


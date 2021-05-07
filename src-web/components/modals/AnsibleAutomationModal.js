/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  AcmModal, AcmButton, AcmAlert
} from '@open-cluster-management/ui-components'
import {
  Text, Spinner, ButtonVariant, Nav,
  NavItem, NavList, Select, Title,
  SelectOption, SelectVariant, Radio
} from '@patternfly/react-core'
import msgs from '../../nls/platform.properties'
import { withRouter, Link } from 'react-router-dom'
import { REQUEST_STATUS } from '../../actions/index'
import {
  clearRequestStatus, receivePatchError, updateModal,
} from '../../actions/common'
import {
  getPolicyCompliantStatus,
} from '../../tableDefinitions/utils'
import { Query } from '@apollo/client/react/components'
import {
  GET_ANSIBLE_CREDENTIALS, GET_ANSIBLE_HISTORY, GET_ANSIBLE_JOB_TEMPLATE
} from '../../utils/client/queries'
import _ from 'lodash'

export class AnsibleAutomationModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.state = {
      activeItem: 0,
      credentialName: null,
      credentialIsOpen: false,
      jobTemplateName: null,
      jobTemplateIsOpen: false,
      ansScheduleMode: '',
    }
  }

  onSelect = result => {
    this.setState({
      activeItem: result.itemId
    })
  }

  handleSubmitClick() {
  }

  handleCloseClick() {
    const { type:modalType, handleClose } = this.props
    handleClose(modalType)
  }

  render() {
    const { data:policyData, label, locale, open, reqErrorMsg, reqStatus } = this.props
    const { activeItem } = this.state
    const policyName = _.get(policyData, 'name')
    const policyNS = _.get(policyData, 'namespace')
    const dangerFlag = 'default', modalId = 'automation-resource-modal', modalMsg = 'modal.ansible.automation.description'
    const query = activeItem ? GET_ANSIBLE_HISTORY : GET_ANSIBLE_CREDENTIALS
    const variables = activeItem ? {name:policyName, namespace:policyNS} : {}
    return (
      <Query query={query} variables={variables}>
        {( result ) => {
          const { loading } = result
          const { data={} } = result
          return (
            <React.Fragment>
            {(reqStatus === REQUEST_STATUS.IN_PROGRESS || loading) && <Spinner className='patternfly-spinner' />}
            <AcmModal
              titleIconVariant={dangerFlag}
              variant='small'
              id={modalId}
              isOpen={open}
              showClose={true}
              onClose={this.handleCloseClick}
              title={msgs.get(label.heading, locale)}
              actions={[
                <AcmButton key="confirm" variant={ButtonVariant.primary} onClick={this.handleSubmitClick}>
                    {msgs.get('modal.button.save', locale)}
                </AcmButton>,
                <AcmButton key="cancel" variant={ButtonVariant.link} onClick={this.handleCloseClick}>
                    {msgs.get('modal.button.cancel', locale)}
                </AcmButton>,
              ]}
            >
              <React.Fragment>
                {reqStatus === REQUEST_STATUS.ERROR &&
                  <AcmAlert
                    isInline={true}
                    noClose={true}
                    variant='danger'
                    title={reqErrorMsg || msgs.get('error.default.description', locale)} />}
              </React.Fragment>
              <Text>
                {msgs.get(modalMsg, locale)}
              </Text>
              <Text>
                {msgs.get('table.header.policy.name', locale)}
              </Text>
              <Text>
                {policyData.name}
              </Text>
              <Text>
                {msgs.get('table.header.cluster.violation', locale)}
              </Text>
              <Text>
                {getPolicyCompliantStatus(policyData, locale, 'clusterCompliant')}
              </Text>
              <Text>
                {msgs.get('modal.ansible.launch.connection', locale)}
              </Text>
              <div>
                {'-'}
              </div>
              <Nav onSelect={this.onSelect} variant="tertiary">
                <NavList>
                  <NavItem key={'Configure'} itemId={0} isActive={activeItem === 0} href="#">
                    Configure
                  </NavItem>
                  <NavItem key={'History'} itemId={1} isActive={activeItem === 1} href="#">
                    History
                  </NavItem>
                </NavList>
              </Nav>
              <div className='ansible-table'>
              {activeItem===0 && data && <div className='ansible-configure-table'>
                {this.renderAnsibleCredentialsSelection(data, locale)}
              </div>}
              {activeItem===1 && data && <div className='ansible-history-table'>
                {this.renderAnsibleHisotry(data)}
              </div>}
            </div>
            </AcmModal>
          </React.Fragment>
          )
        }}
      </Query>
    )
  }

  setCredentialsSelectionValue = (event, selection) => {
    this.setState({
        credentialName: selection,
        credentialIsOpen: false
      })
  }

  onCredentialsSelectionToggle = isOpen => {
    this.setState({
      credentialIsOpen:isOpen
    })
  }

  getAnsibleConnection = (ansCredentials) => {
    const {credentialName} = this.state
    const ansibleConnection = {towerURL:'', token:''}
    const targetCredential = _.find(ansCredentials, ['name', credentialName])
    if (targetCredential && targetCredential.host && targetCredential.token) {
      ansibleConnection.towerURL = targetCredential.host
      ansibleConnection.token = targetCredential.token
    }
    return ansibleConnection
  }

  renderAnsibleCredentialsSelection(credentialsData, locale) {
    const ansCredentials = credentialsData.ansibleCredentials
    const ansCredentialFlag = Array.isArray(ansCredentials) && ansCredentials.length > 0
    const {credentialName, credentialIsOpen} = this.state
    return (
      <React.Fragment>
      {ansCredentialFlag &&
      <React.Fragment>
        <Title headingLevel="h2">
          {msgs.get('modal.ansible.credential.selection.title', locale)}
        </Title>
        <Select
          variant={SelectVariant.single}
          placeholderText={msgs.get('modal.ansible.credential.selection.placeholder', locale)}
          aria-label={msgs.get('modal.ansible.credential.selection.placeholder', locale)}
          onSelect={this.setCredentialsSelectionValue}
          onToggle={this.onCredentialsSelectionToggle}
          selections={credentialName}
          isOpen={credentialIsOpen}
        >
          {ansCredentials.map((credential) => (
            <SelectOption
              key={credential.name}
              value={credential.name ? credential.name : '-'}
              isPlaceholder={credential.name ? credential.name : '-'}
              description="Ansible Credentials Name"
            />
          ))}
        </Select>
        <Link to={'/multicloud/credentials'}>
          {msgs.get('modal.ansible.launch.createCredential', locale)}
        </Link>
        {credentialName && this.renderAnsibleJobTemplatesSelection(this.getAnsibleConnection(ansCredentials), locale)}
      </React.Fragment>}
      {!ansCredentialFlag &&
        <React.Fragment>
          <Text>
            {msgs.get('modal.ansible.no.credential', locale)}
            <Link to={'/multicloud/credentials'}>
            {msgs.get('modal.ansible.launch.createCredential', locale)}
            </Link>
          </Text>
        </React.Fragment>
      }
      </React.Fragment>
    )
  }

  setJobTemplatesSelectionValue = (event, selection) => {
    this.setState({
        jobTemplateName: selection,
        jobTemplateIsOpen: false
      })
  }

  onJobTemplatesSelectionToggle = isOpen => {
    this.setState({
      jobTemplateIsOpen:isOpen
    })
  }

  renderAnsibleJobTemplatesSelection(ansibleConnection, locale) {
    return <React.Fragment>
      <Query query={GET_ANSIBLE_JOB_TEMPLATE} variables={ansibleConnection}>
        {( result ) => {
          const { loading } = result
          const { data={} } = result
          const ansJobTemplates = data ? data.ansibleJobTemplates : data
          const ansJobTemplateFlag = Array.isArray(ansJobTemplates) && ansJobTemplates.length > 0
          const {jobTemplateName, jobTemplateIsOpen} = this.state
          return (
            <React.Fragment>
            {loading && <Spinner className='patternfly-spinner' />}
            <React.Fragment>
            {ansJobTemplateFlag &&
              <React.Fragment>
              <Title headingLevel="h2">
                {msgs.get('modal.ansible.jobTemplates.selection.title', locale)}
              </Title>
              <Select
                variant={SelectVariant.single}
                placeholderText={msgs.get('modal.ansible.jobTemplates.selection.placeholder', locale)}
                aria-label={msgs.get('modal.ansible.jobTemplates.selection.placeholder', locale)}
                  onSelect={this.setJobTemplatesSelectionValue}
                  onToggle={this.onJobTemplatesSelectionToggle}
                  selections={jobTemplateName}
                  isOpen={jobTemplateIsOpen}
                >
                  {ansJobTemplates.map((jobTemplate) => (
                    <SelectOption
                      key={jobTemplate.name}
                      value={jobTemplate.name ? jobTemplate.name : '-'}
                      isPlaceholder={jobTemplate.name ? jobTemplate.name : '-'}
                      description={jobTemplate.description ? jobTemplate.description : '-'}
                    />
                  ))}
                </Select>
                {jobTemplateName && this.renderAnsibleJobTemplateEditor(ansJobTemplates)}
                {jobTemplateName && this.renderAnsibleScheduleMode(locale)}
              </React.Fragment>}
              {!ansJobTemplateFlag &&
                <AcmAlert
                  isInline={true}
                  noClose={true}
                  variant='info'
                  title={msgs.get('modal.ansible.no.jobTemplates.info', locale)} />
              }
            </React.Fragment>
          </React.Fragment>
          )
        }}
        </Query>
    </React.Fragment>
  }

  renderAnsibleJobTemplateEditor(ansJobTemplates) {
    return <div>
      {JSON.stringify(ansJobTemplates)}
    </div>
  }

  handleScheduleModeRadioChange = (_, event) => {
    const { value } = event.currentTarget
    this.setState({ansScheduleMode:value})
  };

  renderAnsibleScheduleMode(locale) {
    const {ansScheduleMode} = this.state
    return <React.Fragment>
      <Title headingLevel="h2">
        {msgs.get('modal.ansible.scheduleMode.title', locale)}
      </Title>
      <Text>
        {msgs.get('modal.ansible.scheduleMode.info', locale)}
      </Text>
      <React.Fragment>
        <Radio
          isChecked={ansScheduleMode==='manual'}
          name="manualRadio"
          onChange={this.handleScheduleModeRadioChange}
          label={msgs.get('modal.ansible.scheduleMode.manual.title', locale)}
          id="manualRadio"
          value="manual"
          description={msgs.get('modal.ansible.scheduleMode.manual.info', locale)}
        />
        <Radio
          isChecked={ansScheduleMode==='once'}
          name="onceRadio"
          onChange={this.handleScheduleModeRadioChange}
          label={msgs.get('modal.ansible.scheduleMode.once.title', locale)}
          id="onceRadio"
          value="once"
          description={msgs.get('modal.ansible.scheduleMode.once.info', locale)}
        />
        <Radio
          isChecked={ansScheduleMode==='disable'}
          name="disableRadio"
          onChange={this.handleScheduleModeRadioChange}
          label={msgs.get('modal.ansible.scheduleMode.disable.title', locale)}
          id="disableRadio"
          value="disable"
          description={msgs.get('modal.ansible.scheduleMode.disable.info', locale)}
        />
      </React.Fragment>
    </React.Fragment>
  }

  renderAnsibleHisotry(historyData) {
    return <div>
      {JSON.stringify(historyData)}
    </div>
  }
}

AnsibleAutomationModal.propTypes = {
  data: PropTypes.shape({
    metadata: PropTypes.object,
    name: PropTypes.string,
    namespace: PropTypes.string,
  }),
  handleClose: PropTypes.func,
  // handleSubmit: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
    primaryBtn: PropTypes.string,
  }),
  locale: PropTypes.string,
  open:  PropTypes.bool,
  reqErrorMsg:  PropTypes.string,
  reqStatus:  PropTypes.string,
  // resourceType: PropTypes.object,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnsibleAutomationModal))

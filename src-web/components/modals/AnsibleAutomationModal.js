/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  AcmModal, AcmButton, AcmAlert, AcmLaunchLink
} from '@open-cluster-management/ui-components'
import {
  Text, Spinner, ButtonVariant, Nav,
  NavItem, NavList, Select, Title,
  SelectOption, SelectVariant, Radio
} from '@patternfly/react-core'
import {
  global_BackgroundColor_100 as lineNumberActiveForeground,
  global_BackgroundColor_dark_100 as editorBackground,
} from '@patternfly/react-tokens'
import MonacoEditor from 'react-monaco-editor'
import msgs from '../../nls/platform.properties'
import { REQUEST_STATUS } from '../../actions/index'
import {
  modifyPolicyAutomation, clearRequestStatus,
  updateModal, copyAnsibleSecret, getPolicyAutomation
} from '../../actions/common'
import {
  getPolicyCompliantStatus,
} from '../../tableDefinitions/utils'
import { Query } from '@apollo/client/react/components'
import {
  GET_ANSIBLE_CREDENTIALS, GET_ANSIBLE_HISTORY,
  GET_ANSIBLE_JOB_TEMPLATE,
} from '../../utils/client/queries'
import _ from 'lodash'
import {stringify} from 'flatted'

if (window.monaco) {
  window.monaco.editor.defineTheme('console', {
    base: 'vs-dark',
    inherit: true,
    rules: [
    // avoid pf tokens for `rules` since tokens are opaque strings that might not be hex values
      { token: 'number', foreground: 'ace12e' },
      { token: 'type', foreground: '73bcf7' },
      { token: 'string', foreground: 'f0ab00' },
      { token: 'keyword', foreground: 'cbc0ff' },
    ],
    colors: {
      'editor.background': editorBackground.value,
      'editorGutter.background': '#292e34', // no pf token defined
      'editorLineNumber.activeForeground': lineNumberActiveForeground.value,
      'editorLineNumber.foreground': '#ededed',  // no pf token defined
    },
  })
}

export class AnsibleAutomationModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.state = {
      activeItem: 0,
      credentialName: null,
      towerURL: '-',
      credentialNS: null,
      credentialIsOpen: false,
      jobTemplateName: null,
      jobTemplateIsOpen: false,
      extra_vars: null,
      ansScheduleMode: '',
      queryMsg: {
        msg: '',
        type: '',
      },
      initialJSON: null,
      confirmClose: false,
    }
    this.initialize()
  }

  buildPolicyAutomationJSON({
    policyAutoName, policyAutoNS, policyName, annotations, extra_vars, resourceVersion
  }) {
    const {credentialName, jobTemplateName, extra_vars:intial_extra_vars, ansScheduleMode} = this.state
    let mode
    switch (ansScheduleMode) {
      case 'once':
      case 'disabled':
        mode = ansScheduleMode
      break
      case 'manual':
      default:
        mode = 'disabled'
      break
    }
    const jsonTemp = {
      kind: 'PolicyAutomation',
      apiVersion: 'policy.open-cluster-management.io/v1beta1',
      metadata: {
        name: policyAutoName ? policyAutoName : '',
        namespace: policyAutoNS ? policyAutoNS : '',
      },
      spec: {
        policyRef: policyName ? policyName : '',
        mode,
        automationDef: {
          type: 'AnsibleJob',
          name: jobTemplateName ? jobTemplateName : '',
          secret: credentialName ? credentialName : '',
        },
      }
    }
    if (annotations) {
      jsonTemp.metadata.annotations = annotations
    }
    if (resourceVersion) {
      jsonTemp.metadata.resourceVersion = resourceVersion
    }
    if (extra_vars || intial_extra_vars) {
      jsonTemp.spec.automationDef.extra_vars = extra_vars || intial_extra_vars
    }
    return jsonTemp
  }

  async initialize(){
    const {  data:policyData, handleGetPolicyAutomation } = this.props
    const policyName = _.get(policyData, 'name')
    const policyNS = _.get(policyData, 'namespace')
    // step to check and loading exisiting policyAutomations
    const {data:initialData} = await handleGetPolicyAutomation(policyNS)
    const policyAutomations = initialData.policyAutomations
    if ( Array.isArray(policyAutomations) && policyAutomations.length > 0) {
      // targetPolicyAutomation must match policy name and ns
      const targetPolicyAutomation = _.find(policyAutomations, ['spec.policyRef', policyName])
      if (targetPolicyAutomation) {
        const policyAutoName = _.get(targetPolicyAutomation, 'metadata.name')
        const policyAutoNS = _.get(targetPolicyAutomation, 'metadata.namespace')
        const annotations = _.get(targetPolicyAutomation, 'metadata.annotations')
        const resourceVersion = _.get(targetPolicyAutomation, 'metadata.resourceVersion')
        const credentialName = _.get(targetPolicyAutomation, 'spec.automationDef.secret')
        const jobTemplateName = _.get(targetPolicyAutomation, 'spec.automationDef.name')
        const extra_vars = _.get(targetPolicyAutomation, 'spec.automationDef.extra_vars')
        let ansScheduleMode = _.get(targetPolicyAutomation, 'spec.mode')
        if (annotations && annotations['policy.open-cluster-management.io/rerun'] === 'true') {
          ansScheduleMode = 'manual'
        }
        const initialJSON = this.buildPolicyAutomationJSON({
          policyAutoName, policyAutoNS, policyName, annotations, extra_vars, resourceVersion
        })
        this.setState({
          credentialName,
          jobTemplateName,
          extra_vars,
          ansScheduleMode,
          initialJSON
        })
      }
    }
  }

  onSelect = result => {
    this.setState({
      activeItem: result.itemId
    })
  }

  async handleSubmitClick() {
    const {latestJSON, action} = await this.generateJSON()
    if (latestJSON && action) {
      const {data:resData} = await this.props.handleModifyPolicyAutomation(latestJSON, action)
      const errors = _.get(resData, 'modifyPolicyAutomation.errors')
      if (Array.isArray(errors) && errors.length > 0)  {
        const error = errors[0]
        if (_.get(error, 'kind') === 'PolicyAutomation' && _.get(error, 'message')) {
          this.setState({
            queryMsg: {
              msg: _.get(error, 'message'),
              type: 'danger',
            }
          })
        }
      } else {
        this.handleCloseClick('directlyClose')
      }
    }
  }

  async handleCloseClick(directlyClose) {
    const { type:modalType, handleClose } = this.props
    if (directlyClose === 'directlyClose') {
      handleClose(modalType)
    } else {
      const { locale } = this.context
      const { initialJSON, confirmClose } = this.state
      const { latestJSON } = await this.generateJSON()
      let ifChanged = false
      if (initialJSON && latestJSON) {
        if (stringify(initialJSON) !== stringify(latestJSON)) {
          ifChanged = true
          this.setState({
            queryMsg: {
              msg: msgs.get('modal.ansible.unsaved.data', locale),
              type: 'warning',
            }
          })
        }
      }
      if (confirmClose || !ifChanged) {
        handleClose(modalType)
      } else {
        // prevent double-click
        setTimeout(this.setState({
          confirmClose: true
        }), 500)
      }
    }
  }

  async generateJSON() {
    let latestJSON, action ='post'
    const {jobTemplateName, credentialName, credentialNS,
      ansScheduleMode, extra_vars, initialJSON
    } = this.state
    const { data:policyData} = this.props
    const policyName = _.get(policyData, 'name')
    const policyNS = _.get(policyData, 'namespace')
    if (jobTemplateName && credentialName && credentialNS && ansScheduleMode && policyName && policyNS) {
      // step to copy secret to target ns
      const secretData = await this.props.handleCopyAnsibleSecret(credentialName, credentialNS, policyNS)
      const secretName = _.get(secretData, 'data.copyAnsibleSecret.name')
      const secretErrors = _.get(secretData, 'errors')
      if (Array.isArray(secretErrors) && secretErrors.length > 0) {
        this.setState({
          queryMsg: {
            msg: _.get(secretErrors[0], 'message'),
            type: 'danger',
          }
        })
      } else if (secretName) {
        const policyAutoName = `${policyName}-policy-automation`
        const policyAutoNS = policyNS
        let annotations = ''
        if (ansScheduleMode === 'manual') {
          annotations = {'policy.open-cluster-management.io/rerun':'true'}
        }
        let resourceVersion = ''
        if (initialJSON) {
          action = 'patch'
          resourceVersion = _.get(initialJSON, 'metadata.resourceVersion')
          if (ansScheduleMode !== 'manual') { // override existing annotations
            const initialAnnotations = _.get(initialJSON, 'metadata.annotations')
            if (initialAnnotations && initialAnnotations['policy.open-cluster-management.io/rerun'] === 'true') {
              annotations = {'policy.open-cluster-management.io/rerun':'false'}
            }
          }
        }
        latestJSON = this.buildPolicyAutomationJSON({
          policyAutoName, policyAutoNS, policyName, annotations, extra_vars, resourceVersion
        })
      }
    }
    return {latestJSON, action}
  }

  render() {
    const { data:policyData, label, locale, open, reqErrorMsg, reqStatus } = this.props
    const { activeItem, towerURL, queryMsg } = this.state
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
                {(queryMsg.msg ||reqStatus === REQUEST_STATUS.ERROR) &&
                  <AcmAlert
                    isInline={true}
                    noClose={true}
                    variant={queryMsg.type ? queryMsg.type : 'danger'}
                    title={queryMsg.msg || reqErrorMsg || msgs.get('error.default.description', locale)} />}
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
                {towerURL && this.renderURL('towerURL', towerURL, towerURL)}
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

  renderURL = (id, text, URL) => {
    const link = { id, text: text, href: URL }
  return <AcmLaunchLink links={[link]} />
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
    const {credentialName, credentialNS} = this.state
    const ansibleConnection = {towerURL:'', token:''}
    const targetCredential = _.find(ansCredentials, ['name', credentialName])
    if (targetCredential && targetCredential.namespace && targetCredential.host && targetCredential.token) {
      if (credentialNS !== targetCredential.namespace) {
        this.setState({
          credentialNS: targetCredential.namespace,
          towerURL:targetCredential.host,
        })
      }
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
        {this.renderURL('createCredentialLink', msgs.get('modal.ansible.launch.createCredential', locale), '/multicloud/credentials')}
        {credentialName && this.renderAnsibleJobTemplatesSelection(this.getAnsibleConnection(ansCredentials), locale)}
      </React.Fragment>}
      {!ansCredentialFlag &&
        <React.Fragment>
          <Text>
            {msgs.get('modal.ansible.no.credential', locale)}
            {this.renderURL('createCredentialLink', msgs.get('modal.ansible.launch.createCredential', locale), '/multicloud/credentials')}
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
                {jobTemplateName && this.renderAnsibleJobTemplateEditor(locale)}
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

  editorOnChange = newValue => {
    this.setState({
      extra_vars:newValue
    })
  }

  renderAnsibleJobTemplateEditor(locale) {
    return (
      <div>
        <Title headingLevel="h2">
          {msgs.get('modal.ansible.jobTemplates.editor.title', locale)}
        </Title>
        <MonacoEditor
          width="100%"
          height="100"
          language="yaml"
          theme="console"
          onChange={this.editorOnChange}
          value={this.state.extra_vars}
        />
      </div>
    )
  }

  handleScheduleModeRadioChange = (update, event) => {
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
          isChecked={ansScheduleMode==='disabled'}
          name="disableRadio"
          onChange={this.handleScheduleModeRadioChange}
          label={msgs.get('modal.ansible.scheduleMode.disabled.title', locale)}
          id="disableRadio"
          value="disabled"
          description={msgs.get('modal.ansible.scheduleMode.disabled.info', locale)}
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
    copyAnsibleSecret: {
      name: PropTypes.string,
    }
  }),
  handleClose: PropTypes.func,
  handleCopyAnsibleSecret: PropTypes.func,
  handleGetPolicyAutomation: PropTypes.func,
  handleModifyPolicyAutomation: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
    primaryBtn: PropTypes.string,
  }),
  locale: PropTypes.string,
  open:  PropTypes.bool,
  reqErrorMsg:  PropTypes.string,
  reqStatus:  PropTypes.string,
  type: PropTypes.string,
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClose: (modalType) => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: modalType}))
    },
    handleModifyPolicyAutomation: (poliyAutomationJSON, action) =>
      dispatch(modifyPolicyAutomation(poliyAutomationJSON, action)),
    handleCopyAnsibleSecret: (name, namespace, targetNamespace) =>
      dispatch(copyAnsibleSecret(name, namespace, targetNamespace)),
    handleGetPolicyAutomation: (namespace) =>
      dispatch(getPolicyAutomation(namespace)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnsibleAutomationModal)

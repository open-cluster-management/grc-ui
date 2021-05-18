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
import TruncateText from '../../components/common/TruncateText'
import _ from 'lodash'
import jsYaml from 'js-yaml'

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
      initializeFinished: false,
      activeItem: 0,
      credentialName: null,
      towerURL: '-',
      credentialNS: null,
      credentialIsOpen: false,
      jobTemplateName: null,
      jobTemplateIsOpen: false,
      extraVars: null,
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
    policyAutoName, policyAutoNS, policyName, annotations,
    resourceVersion, extraVars, credentialName, jobTemplateName
  }) {
    const {
      credentialName:stateCredentialName,
      jobTemplateName:stateJobTemplateName,
      extraVars:stateExtraVars, ansScheduleMode
    } = this.state
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
          name: stateJobTemplateName ? stateJobTemplateName : jobTemplateName,
          secret: stateCredentialName ? stateCredentialName : credentialName,
        },
      }
    }
    if (annotations) {
      jsonTemp.metadata.annotations = annotations
    }
    if (resourceVersion) {
      jsonTemp.metadata.resourceVersion = resourceVersion
    }
    if (stateExtraVars || extraVars) {
      jsonTemp.spec.automationDef.extra_vars = this.yamlToJSON(stateExtraVars || extraVars)
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
        const extraVarsJSON = _.get(targetPolicyAutomation, 'spec.automationDef.extra_vars')
        const extraVars = this.jsonToYaml(extraVarsJSON)
        let ansScheduleMode = _.get(targetPolicyAutomation, 'spec.mode')
        if (annotations && annotations['policy.open-cluster-management.io/rerun'] === 'true') {
          ansScheduleMode = 'manual'
        }
        const initialJSON = this.buildPolicyAutomationJSON({
          policyAutoName, policyAutoNS, policyName, annotations, resourceVersion,
          extraVars, credentialName, jobTemplateName
        })
        this.setState({
          credentialName,
          jobTemplateName,
          extraVars,
          ansScheduleMode,
          initialJSON
        })
      }
    }
    this.setState({
      initializeFinished: true,
    })
  }

  yamlToJSON = yaml => {
    let resultJSON = null
    if (typeof yaml === 'string') {
      try {
        resultJSON = jsYaml.load(yaml)
      } catch (error) {
        console.error(error)
      }
    } else if (typeof yaml === 'object') {
      resultJSON = yaml
    }
    return resultJSON
  }

  jsonToYaml = json => {
    let resultYaml = null
    if (typeof json === 'string') {
      resultYaml = json
    } else if (typeof json === 'object') {
      try {
        resultYaml = jsYaml.dump(json)
      } catch (error) {
        console.error(error)
      }
    }
    return resultYaml
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
      if (initialJSON && latestJSON && _.isEqual(initialJSON, latestJSON)) {
        ifChanged = true
        this.setState({
          queryMsg: {
            msg: msgs.get('ansible.unsaved.data', locale),
            type: 'warning',
          }
        })
      }
      if (confirmClose || !ifChanged) {
        handleClose(modalType)
      } else {
        // prevent double-click
        setTimeout(this.setState({
          confirmClose: true
        }), 200)
      }
    }
  }

  async generateJSON() {
    let latestJSON, action ='post'
    const {jobTemplateName, credentialName, credentialNS,
      ansScheduleMode, initialJSON
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
          policyAutoName, policyAutoNS, policyName, annotations, resourceVersion,
          extraVars:null, credentialName:secretName, jobTemplateName:null
        })
      }
    }
    return {latestJSON, action}
  }

  render() {
    const { data:policyData, locale, open, reqErrorMsg, reqStatus } = this.props
    const { activeItem, towerURL, queryMsg, initialJSON, initializeFinished } = this.state
    console.log(JSON.stringify(this.state))
    const policyName = _.get(policyData, 'name')
    const policyNS = _.get(policyData, 'namespace')
    const query = activeItem ? GET_ANSIBLE_HISTORY : GET_ANSIBLE_CREDENTIALS
    const variables = activeItem ? {name:policyName, namespace:policyNS} : {}
    const panelType = initialJSON ? 'edit' : 'create'
    return (
      <Query query={query} variables={variables}>
        {( result ) => {
          const { loading } = result
          const { data={} } = result
          const readyFlag = (initializeFinished && !(reqStatus === REQUEST_STATUS.IN_PROGRESS || loading))
          const titleText = readyFlag
            ? msgs.get(`ansible.automation.heading.${panelType}`, locale)
            : msgs.get('ansible.loading.info', locale)
          return (
            <React.Fragment>
              <AcmModal
              titleIconVariant={'default'}
              variant='small'
              id={'automation-resource-panel'}
              isOpen={open}
              showClose={true}
              onClose={this.handleCloseClick}
              title={titleText}
              actions={[
                <AcmButton key="confirm" variant={ButtonVariant.primary} onClick={this.handleSubmitClick}>
                    {msgs.get('modal.button.save', locale)}
                </AcmButton>,
                <AcmButton key="cancel" variant={ButtonVariant.link} onClick={this.handleCloseClick}>
                    {msgs.get('modal.button.cancel', locale)}
                </AcmButton>,
              ]}
            >
              {!readyFlag && <Spinner className='patternfly-spinner' />}
              {readyFlag && <React.Fragment>
                <React.Fragment>
                  {(queryMsg.msg ||reqStatus === REQUEST_STATUS.ERROR) &&
                    <AcmAlert
                      isInline={true}
                      noClose={true}
                      variant={queryMsg.type ? queryMsg.type : 'danger'}
                      title={queryMsg.msg || reqErrorMsg || msgs.get('error.default.description', locale)} />}
                </React.Fragment>
                <Text>
                  {msgs.get(`ansible.automation.description.${panelType}`, locale)}
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
                  {msgs.get('ansible.launch.connection', locale)}
                </Text>
                <div>
                  {towerURL && this.renderURL('towerURL', towerURL, towerURL, 60)}
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
              </React.Fragment>}
            </AcmModal>
          </React.Fragment>
          )
        }}
      </Query>
    )
  }

  renderURL = (id, text, URL, truncateLength) => {
    let linkText = text
    if (truncateLength) {
      linkText = <TruncateText maxCharacters={truncateLength} text={linkText} />
    }
    const link = { id, text: linkText, href: URL }
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
          {msgs.get('ansible.credential.selection.title', locale)}
        </Title>
        <Select
          variant={SelectVariant.single}
          placeholderText={msgs.get('ansible.credential.selection.placeholder', locale)}
          aria-label={msgs.get('ansible.credential.selection.placeholder', locale)}
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
        {this.renderURL('createCredentialLink', msgs.get('ansible.launch.createCredential', locale), '/multicloud/credentials')}
        {credentialName && this.renderAnsibleJobTemplatesSelection(this.getAnsibleConnection(ansCredentials), locale)}
      </React.Fragment>}
      {!ansCredentialFlag &&
        <React.Fragment>
          <Text>
            {msgs.get('ansible.no.credential', locale)}
            {this.renderURL('createCredentialLink', msgs.get('ansible.launch.createCredential', locale), '/multicloud/credentials')}
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
                {msgs.get('ansible.jobTemplates.selection.title', locale)}
              </Title>
              <Select
                variant={SelectVariant.single}
                placeholderText={msgs.get('ansible.jobTemplates.selection.placeholder', locale)}
                aria-label={msgs.get('ansible.jobTemplates.selection.placeholder', locale)}
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
                {jobTemplateName && this.renderAnsibleJobTemplateEditor()}
                {jobTemplateName && this.renderAnsibleScheduleMode()}
              </React.Fragment>}
              {!ansJobTemplateFlag &&
                <AcmAlert
                  isInline={true}
                  noClose={true}
                  variant='info'
                  title={msgs.get('ansible.no.jobTemplates.info', locale)} />
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
      extraVars:newValue
    })
  }

  renderAnsibleJobTemplateEditor() {
    const { locale } = this.context
    const { extraVars } = this.state
    return (
      <div>
        <Title headingLevel="h2">
          {msgs.get('ansible.jobTemplates.editor.title', locale)}
        </Title>
        <MonacoEditor
          width="100%"
          height="100"
          language="yaml"
          theme="console"
          onChange={this.editorOnChange}
          value={extraVars}
        />
      </div>
    )
  }

  handleScheduleModeRadioChange = (update, event) => {
    const { value } = event.currentTarget
    this.setState({ansScheduleMode:value})
  };

  renderAnsibleScheduleMode() {
    const { locale } = this.context
    const {ansScheduleMode} = this.state
    return <React.Fragment>
      <Title headingLevel="h2">
        {msgs.get('ansible.scheduleMode.title', locale)}
      </Title>
      <Text>
        {msgs.get('ansible.scheduleMode.info', locale)}
      </Text>
      <React.Fragment>
        {this.renderAnsibleScheduleRadio((ansScheduleMode==='manual'), 'manualRadio', 'manualRadio', 'manual')}
        {this.renderAnsibleScheduleRadio((ansScheduleMode==='once'), 'onceRadio', 'onceRadio', 'once')}
        {this.renderAnsibleScheduleRadio((ansScheduleMode==='disabled'), 'disableRadio', 'disableRadio', 'disabled')}
      </React.Fragment>
    </React.Fragment>
  }

  renderAnsibleScheduleRadio(isChecked, name, id, value) {
    const { locale } = this.context
    return <Radio
      isChecked={isChecked}
      name={name}
      onChange={this.handleScheduleModeRadioChange}
      label={msgs.get(`ansible.scheduleMode.${value}.title`, locale)}
      id={id}
      value={value}
      description={msgs.get(`ansible.scheduleMode.${value}.info`, locale)}
    />
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

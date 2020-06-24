/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Notification, Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import StructuredListModule from './StructuredListModule'
import resources from '../../../lib/shared/resources'
import PolicyTemplates from './PolicyTemplates'
import ResourceTableModule from './ResourceTableModuleFromProps'
import { updateResourceToolbar} from '../../actions/common'
import _ from 'lodash'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/resource-overview.scss')
})

class PolicyClusterDetail extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.any,
    params: PropTypes.object,
    policies: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
      PropTypes.array
    ]),
    refreshControl: PropTypes.object,
    resourceType: PropTypes.object,
    staticResourceData: PropTypes.object,
    updateResourceToolbar: PropTypes.func,
  }

  static defaultProps = {
    resourceType: RESOURCE_TYPES.HCM_COMPLIANCES,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {refreshControl, policies, updateResourceToolbar:localUpdateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(policies, this.props.policies)) {
      localUpdateResourceToolbar(refreshControl, {})
    }
  }

  render() {
    const {staticResourceData, error, loading, resourceType, params, policies} = this.props
    const { locale } = this.context
    const modulesRight = [], modulesBottom = []
    if(error) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get(error, locale)}
        kind='error' />
    } else if ( loading || !policies || !Array.isArray(policies) ) {
      return (<Loading withOverlay={false} className='content-spinner' />)
    }
    const policy = policies[0]
    React.Children.map([
      <PolicyTemplates key='Policy Templates' headerKey='table.header.policyTemplate' right />,
      <ResourceTableModule key='roleTemplates' definitionsKey='policyRoleTemplates' />,
      <ResourceTableModule key='objectTemplates' definitionsKey='policyObjectTemplates' />,
      <ResourceTableModule key='policyTemplates' definitionsKey='policyPolicyTemplates' />,
      <ResourceTableModule key='rules' definitionsKey='policyRules' />,
      <ResourceTableModule key='violations' definitionsKey='policyViolations' />], module => {
      if (module.props.right) {
        modulesRight.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: policy, params }))
      } else {
        modulesBottom.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: policy, params }))
      }
    })
    return (
      <div className='page-content-container policy-cluster-detail' role='main'>
        <div className='overview-content'>
          <StructuredListModule
            title={staticResourceData.policyDetailKeys.title}
            headerRows={staticResourceData.policyDetailKeys.headerRows}
            rows={staticResourceData.policyDetailKeys.rows}
            data={policy} />
          {modulesRight.length > 0 &&
            <div className='overview-content-right'>
              {modulesRight}
            </div>}
          <div className='overview-content-bottom'>
            {modulesBottom}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return { activeFilters }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl) => dispatch(updateResourceToolbar(refreshControl, {})),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyClusterDetail))

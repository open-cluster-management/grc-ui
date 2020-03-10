/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import StructuredListModule from './StructuredListModule'
import resources from '../../../lib/shared/resources'
import PolicyTemplates from './PolicyTemplates'
// eslint-disable-next-line import/no-named-as-default
import ResourceTableModule from './ResourceTableModuleFromProps'
import { updateSecondaryHeader} from '../../actions/common'
import lodash from 'lodash'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import { Query } from 'react-apollo'
import { HCMPolicy } from '../../../lib/client/queries'
import getResourceDefinitions from '../../definitions'

resources(() => {
  require('../../../scss/resource-overview.scss')
})

class PolicyClusterDetail extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
    resourceType: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
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

  componentWillMount() {
    const { updateSecondaryHeader} = this.props
    updateSecondaryHeader(this.getPolicyName(true), null, this.getBreadcrumb())
  }

  getPolicyName(withParentNamespace) {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    if(withParentNamespace){
      return urlSegments[urlSegments.length - 1]
    }
    else{
      const nameSegments = urlSegments[urlSegments.length - 1].split('.')
      return nameSegments.slice(1).join('.')
    }
  }

  getClusterName() {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    return urlSegments[urlSegments.length - 2]
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const {  location, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/')

    // Push only one breadcrumb to overview page
    if (resourceType.name === RESOURCE_TYPES.HCM_COMPLIANCES.name) {
      breadcrumbItems.push({
        label: msgs.get('tabs.hcmcompliance', locale),
        noLocale: true,
        url: `${urlSegments.slice(0, 3).join('/')}/all`
      },
      {
        label: this.getPolicyName(false),
        noLocale: true,
        url: `${urlSegments.slice(0, 3).join('/')}/all/${this.getPolicyName(false)}`
      },
      {
        label: this.getClusterName(),
        noLocale: true,
        url: `${urlSegments.join('/')}`
      }
      )
    }
    return breadcrumbItems
  }

  render() {
    const url = lodash.get(this.props, 'location.pathname')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 1]
    const policyNamespace = urlSegments[urlSegments.length - 2]
    const {params, resourceType} = this.props
    const staticResourceData = getResourceDefinitions(resourceType)

    return (
      <Query query={HCMPolicy} variables={{name: policyName, clusterName: policyNamespace}}>
        {({ data, loading }) => {
          if (loading) {
            return (<Loading withOverlay={false} className='content-spinner' />)
          }
          const policy = data.policies[0], modulesRight = [], modulesBottom = []
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
            <div className='page-content-container' role='main'>
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
        }}
      </Query>

    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyClusterDetail))

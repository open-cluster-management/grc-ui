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

import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateSecondaryHeader } from '../actions/common'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import PolicyTemplatesView from '../components/common/PolicyTemplatesView'
import getResourceDefinitions from '../definitions'
import { HCMCompliance } from '../../lib/client/queries'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import {GRC_REFRESH_INTERVAL_COOKIE} from '../../lib/shared/constants'
import { Spinner } from '@patternfly/react-core'
import { DangerNotification } from '../components/common/DangerNotification'
import { setRefreshControl } from '../../lib/client/reactiveVars'
import { getTabs } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/policy-yaml-tab.scss')
})

class PolicyTemplateTab extends React.Component{
  constructor(props) {
    super(props)
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const { location } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/')
    const hubNamespace = urlSegments.length > 4 ? urlSegments.slice(4, 5) : ''
    const policyName = urlSegments.length > 5 ? urlSegments.slice(5, 6) : ''
    breadcrumbItems.push({
      label: msgs.get('tabs.hcmcompliance', locale),
      noLocale: true,
      url: `${urlSegments.slice(0, 3).join('/')}/all`
    },
    {
      label: policyName,
      noLocale: true,
      url: `${urlSegments.slice(0, 3).join('/')}/all/${hubNamespace}/${policyName}`
    },
    {
      label: msgs.get('table.header.yaml', locale),
      noLocale: true,
      url: `${urlSegments.slice(0, 3).join('/')}/all/${hubNamespace}/${policyName}/yaml`
    })
    return breadcrumbItems
  }

  componentDidMount() {
    const { locale } = this.context
    const { tabs, url, updateSecondaryHeader: localUpdateSecondaryHeader } = this.props
    localUpdateSecondaryHeader(
      msgs.get('panel.header.violation.history', locale),
      getTabs(tabs, (tab, index) => index === 0 ? url : `${url}/${tab}`),
      this.getBreadcrumb()
    )
  }


  render() {
    const {
      policyName,
      policyNamespace,
      resourceType,
    } = this.props
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    return <Query
      query={HCMCompliance}
      variables={{name: policyName, namespace: policyNamespace}}
      pollInterval={pollInterval}
      notifyOnNetworkStatusChange
    >
      {( result ) => {
        const {data={}, loading, startPolling, stopPolling, refetch} = result
        const { items } = data
        const error = items ? null : result.error
        const staticResourceData = getResourceDefinitions(resourceType)
        if (!loading) {
          this.timestamp = new Date().toString()
        }
        setRefreshControl(loading, this.timestamp, startPolling, stopPolling, refetch)
        if (error) {
          return (
            <DangerNotification error={error} />
          )
        } else if (loading && items === undefined) {
          return <Spinner className='patternfly-spinner' />
        } else{
          const item = items[0]
          return <PolicyTemplatesView
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            resourceData={item}
            className='compliance-templates'
            headerKey={'table.header.complianceTemplate'}
          />
        }
      }}
    </Query>
  }

}

PolicyTemplateTab.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplateTab.propTypes = {
  location: PropTypes.object,
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  resourceType: PropTypes.object,
  tabs: PropTypes.array,
  updateSecondaryHeader: PropTypes.func,
  url: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyTemplateTab))

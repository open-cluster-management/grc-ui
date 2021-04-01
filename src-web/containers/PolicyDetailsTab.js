/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// import resources from '../../lib/shared/resources'
import { getResourceData } from '../tableDefinitions'
// import { connect } from 'react-redux'
// import { updateSecondaryHeader } from '../actions/common'
import { SINGLE_POLICY } from '../../lib/client/queries'
import { Spinner } from '@patternfly/react-core'
import { DangerNotification } from '../components/common/DangerNotification'
// eslint-disable-next-line import/no-named-as-default
import PolicyDetailsOverview from '../components/modules/PolicyDetailsOverview'
import { setRefreshControl } from '../../lib/client/reactiveVars'
// import { getTabs } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import { LocaleContext } from '../components/common/LocaleContext'
import NoResource from '../components/common/NoResource'
import { AcmButton, AcmPage, AcmPageHeader, AcmAutoRefreshSelect, AcmRefreshTime, AcmSecondaryNav, AcmSecondaryNavItem } from '@open-cluster-management/ui-components'
import { INITIAL_REFRESH_TIME, REFRESH_INTERVALS, REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import config from '../../lib/shared/config'

class PolicyDetailsTab extends React.Component{
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  render() {
    const {
      tab,
      policyName,
      policyNamespace,
      resourceType,
      location,
      history,
    } = this.props
    const { locale } = this.context
    const pollInterval = localStorage.getItem(REFRESH_INTERVAL_COOKIE) || INITIAL_REFRESH_TIME*1000
    return <Query
      query={SINGLE_POLICY}
      variables={{name: policyName, namespace: policyNamespace}}
      pollInterval={pollInterval}
      notifyOnNetworkStatusChange
    >
      {( result ) => {
        const {data={}, loading, startPolling, stopPolling, refetch} = result
        const { items } = data
        const error = items ? null : result.error
        const staticResourceData = getResourceData(resourceType)
        if (!loading) {
          this.timestamp = new Date().toString()
        }
        setRefreshControl(loading, this.timestamp, startPolling, stopPolling, refetch)

        if (error) {
          return <DangerNotification error={error} />
        } else if (loading && items === undefined) {
          return <Spinner className='patternfly-spinner' />
        } else if (items.length === 0){
          return <NoResource
            title={msgs.get('error.not.found', locale)}
            svgName='EmptyPagePlanet-illus.png'>
          </NoResource>
        } else {
          const item = items[0]
          return (
            <AcmPage>
              <AcmPageHeader
                title={policyName}
                breadcrumb={[{ text: msgs.get('routes.policies', locale), to: config.contextPath }, { text: policyName, to: location.pathname}]}
                controls={
                  <React.Fragment>
                    <AcmAutoRefreshSelect refetch={refetch}
                      refreshIntervals={REFRESH_INTERVALS}
                      refreshIntervalCookie={REFRESH_INTERVAL_COOKIE}
                      initRefreshTime={INITIAL_REFRESH_TIME} />
                    <AcmRefreshTime timestamp={this.timestamp} reloading={loading} />
                    <AcmButton id='edit-policy' isDisabled={false}
                      tooltip={msgs.get('error.permission.disabled', locale)}
                      onClick={() => history.push(`${config.contextPath}/all/${policyNamespace}/${policyName}/edit`)}>
                      {msgs.get('routes.edit.policy', locale)}
                    </AcmButton>
                  </React.Fragment>
                }
                navigation={
                  <AcmSecondaryNav>
                    <AcmSecondaryNavItem
                      isActive={tab !== 'status'}
                      onClick={() => history.push(`${config.contextPath}/all/${policyNamespace}/${policyName}`)}>
                        {msgs.get('tabs.details', locale)}
                    </AcmSecondaryNavItem>
                    <AcmSecondaryNavItem
                      isActive={tab === 'status'}
                      onClick={() => history.push(`${config.contextPath}/all/${policyNamespace}/${policyName}/status`)}>
                        {msgs.get('tabs.status', locale)}
                    </AcmSecondaryNavItem>
                    {/* <AcmSecondaryNavItem
                      isActive={tab === 'yaml'}
                      onClick={() => history.push(`${config.contextPath}/all/${policyNamespace}/${policyName}/yaml`)}>
                        {msgs.get('tabs.yaml', locale)}
                    </AcmSecondaryNavItem> */}
                  </AcmSecondaryNav>
                }>
              </AcmPageHeader>
              <PolicyDetailsOverview
                loading={!items && loading}
                error={error}
                item={item}
                resourceType={resourceType}
                staticResourceData={staticResourceData}
              />
            </AcmPage>
          )
        }
      }}
    </Query>
  }

}

PolicyDetailsTab.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  resourceType: PropTypes.object,
  tab: PropTypes.string,
  // updateSecondaryHeader: PropTypes.func,
  // url: PropTypes.string,
}

export default withRouter(PolicyDetailsTab)

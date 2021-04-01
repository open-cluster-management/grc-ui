/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// import resources from '../../lib/shared/resources'
// import { getResourceData } from '../tableDefinitions'
// import { connect } from 'react-redux'
// import { updateSecondaryHeader } from '../actions/common'
import { POLICY_STATUS } from '../../lib/client/queries'
import { Spinner } from '@patternfly/react-core'
import { DangerNotification } from '../components/common/DangerNotification'
import PolicyStatusView from '../components/modules/PolicyStatusView'
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
      policyNamespace: hubNamespace,
      location,
      history,
    } = this.props
    const { locale } = this.context
    const pollInterval = localStorage.getItem(REFRESH_INTERVAL_COOKIE) || INITIAL_REFRESH_TIME*1000
    return (
      <Query
        query={POLICY_STATUS}
        variables={{policyName, hubNamespace}}
        pollInterval={pollInterval}
        notifyOnNetworkStatusChange
      >
      {(result) => {
        const {data={}, loading, startPolling, stopPolling, refetch} = result
        const { status } = data
        if (!loading) {
          this.timestamp = new Date().toString()
        }
        setRefreshControl(loading, this.timestamp, startPolling, stopPolling, refetch)
        const error = status ? null : result.error
        if (error) {
          return (
            <DangerNotification error={error} />
          )
        } else if (loading && status === undefined) {
          return <Spinner className='patternfly-spinner' />
        } else if (Array.isArray(status) && status.length === 0) {
          return <NoResource
            title={msgs.get('no-status.title', [msgs.get('routes.grc', locale)], locale)}
            svgName='EmptyPagePlanet-illus.png'>
          </NoResource>
        } else {
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
                        onClick={() => history.push(`${config.contextPath}/edit`)}>
                        {msgs.get('routes.edit.policy', locale)}
                      </AcmButton>
                    </React.Fragment>
                  }
                  navigation={
                    <AcmSecondaryNav>
                      <AcmSecondaryNavItem
                        isActive={tab !== 'status'}
                        onClick={() => history.push(`${config.contextPath}/all/${hubNamespace}/${policyName}`)}>
                          {msgs.get('tabs.details', locale)}
                      </AcmSecondaryNavItem>
                      <AcmSecondaryNavItem
                        isActive={tab === 'status'}
                        onClick={() => history.push(`${config.contextPath}/all/${hubNamespace}/${policyName}/status`)}>
                          {msgs.get('tabs.status', locale)}
                      </AcmSecondaryNavItem>
                      {/* <AcmSecondaryNavItem
                        isActive={tab === 'yaml'}
                        onClick={() => history.push(`${config.contextPath}/all/${hubNamespace}/${policyName}/yaml`)}>
                          {msgs.get('tabs.yaml', locale)}
                      </AcmSecondaryNavItem> */}
                    </AcmSecondaryNav>
                  }>
                </AcmPageHeader>
                <PolicyStatusView
                  status={status}
                />
              </AcmPage>
            )
          }
        }}
      </Query>
    )
  }

}

PolicyDetailsTab.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  tab: PropTypes.string,
}

export default withRouter(PolicyDetailsTab)

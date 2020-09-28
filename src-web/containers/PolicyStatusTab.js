/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import { Spinner } from '@patternfly/react-core'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { Query } from 'react-apollo'
import { PolicyStatus } from '../../lib/client/queries'
import { DangerNotification } from '../components/common/DangerNotification'
import PolicyStatusView from '../components/common/PolicyStatusView'
import { setRefreshControl } from '../../lib/client/reactiveVars'
import NoResource from '../components/common/NoResource'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/policy-status-tab.scss')
})

class PolicyStatusTab extends React.Component {
  static propTypes = {
    policyName: PropTypes.string,
    policyNamespace: PropTypes.string,
  }

  constructor (props) {
    super(props)
  }

  render() {
    const {
      policyName,
      policyNamespace:hubNamespace,
    } = this.props
    const { locale } = this.context
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    return (
      <Query
        query={PolicyStatus}
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
              <PolicyStatusView
                status={status}
              />
            )
          }
        }}
      </Query>
    )
  }
}

export default withRouter(PolicyStatusTab)

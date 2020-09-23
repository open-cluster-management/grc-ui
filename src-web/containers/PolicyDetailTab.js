/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import resources from '../../lib/shared/resources'
import getResourceDefinitions from '../definitions'
import { HCMCompliance } from '../../lib/client/queries'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import {GRC_REFRESH_INTERVAL_COOKIE} from '../../lib/shared/constants'
import { Spinner } from '@patternfly/react-core'
import { DangerNotification } from '../components/common/DangerNotification'
// eslint-disable-next-line import/no-named-as-default
import PolicyDetailsOverview from '../components/common/PolicyDetailsOverview'
import { reloadingVar, timestampVar, startPollingFunc, stopPollingFunc, refetchFunc } from '../../lib/client/reactiveVars'

resources(() => {
  require('../../scss/policy-yaml-tab.scss')
})

class PolicyDetailTab extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const {
      policyName,
      policyNamespace,
      resourceType
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
        const firstLoad = this.firstLoad
        this.firstLoad = false
        const reloading = !firstLoad && loading
        const staticResourceData = getResourceDefinitions(resourceType)
        if (!reloading) {
          this.timestamp = new Date().toString()
        }

        reloadingVar(reloading)
        timestampVar(this.timestamp)
        startPollingFunc(startPolling)
        stopPollingFunc(stopPolling)
        refetchFunc(refetch)

        if (error) {
          return (
            <DangerNotification error={error} />
          )
        } else if (loading && items === undefined) {
          return <Spinner className='patternfly-spinner' />
        } else {
          const item = items[0]
          return <PolicyDetailsOverview
            loading={!items && loading}
            error={error}
            item={item}
            resourceType={resourceType}
            staticResourceData={staticResourceData}
          />
        }
      }}
    </Query>
  }

}

PolicyDetailTab.contextTypes = {
  locale: PropTypes.string
}

PolicyDetailTab.propTypes = {
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  resourceType: PropTypes.object,
}

export default withRouter(PolicyDetailTab)


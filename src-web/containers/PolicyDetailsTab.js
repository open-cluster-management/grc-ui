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
import { setRefreshControl } from '../../lib/client/reactiveVars'

resources(() => {
  require('../../scss/policy-yaml-tab.scss')
})

class PolicyDetailsTab extends React.Component{
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

PolicyDetailsTab.contextTypes = {
  locale: PropTypes.string
}

PolicyDetailsTab.propTypes = {
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  resourceType: PropTypes.object,
}

export default withRouter(PolicyDetailsTab)


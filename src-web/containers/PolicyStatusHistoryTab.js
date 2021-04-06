/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Spinner } from '@patternfly/react-core'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { POLICY_STATUS_HISTORY } from '../../lib/client/queries'
import resources from '../../lib/shared/resources'
import { LocaleContext } from '../components/common/LocaleContext'
import PolicyStatusHistoryView from '../components/modules/PolicyStatusHistoryView'
import { DangerNotification } from '../components/common/DangerNotification'
import { INITIAL_REFRESH_TIME, REFRESH_INTERVALS, REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { AcmPage, AcmPageHeader, AcmAutoRefreshSelect, AcmRefreshTime } from '@open-cluster-management/ui-components'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/policy-status-history.scss')
})

class PolicyStatusHistoryTab extends React.Component {
  static propTypes = {
    match: PropTypes.object,
  }

  static contextType = LocaleContext

  constructor (props) {
    super(props)
  }

  render() {
    const { match: { params: { name, namespace, cluster, template }}} = this.props
    const { locale } = this.context
    return (
      <Query
        query={POLICY_STATUS_HISTORY}
        variables={{policyName:name, hubNamespace:namespace, cluster, template}}
        notifyOnNetworkStatusChange
      >
        {(result) => {
          const { data={}, loading, refetch, error } = result
          if (!loading) {
            this.timestamp = new Date().toString()
          }
          return (
            <AcmPage>
              <AcmPageHeader title={msgs.get('table.header.history', locale)}
                breadcrumb={[{ text: msgs.get('routes.policies', locale), to: config.contextPath },
                  { text: name, to: `${config.contextPath}/all/${namespace}/${name}`},
                  { text: msgs.get('table.header.status', locale), to: `${config.contextPath}/all/${namespace}/${name}/status`},
                  { text: msgs.get('table.header.history', locale)}]}
                controls={
                  <React.Fragment>
                    <AcmAutoRefreshSelect refetch={refetch}
                      refreshIntervals={REFRESH_INTERVALS}
                      refreshIntervalCookie={REFRESH_INTERVAL_COOKIE}
                      initRefreshTime={INITIAL_REFRESH_TIME} />
                    <AcmRefreshTime timestamp={this.timestamp} reloading={loading} />
                  </React.Fragment>
                }>
              </AcmPageHeader>
              {(() => {
                const { items } = data
                if (error) {
                  return (
                    <DangerNotification error={error} />
                  )
                } else if (items) {
                  return <PolicyStatusHistoryView
                      history={items}
                      template={template}
                      cluster={cluster}
                    />
                } else {
                  return (
                    <Spinner className='patternfly-spinner' />
                  )
                }
              })()}
            </AcmPage>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(PolicyStatusHistoryTab)

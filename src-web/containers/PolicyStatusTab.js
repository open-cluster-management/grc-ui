/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Spinner } from '@patternfly/react-core'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { Query } from 'react-apollo'
import { PolicyStatus } from '../../lib/client/queries'
import Page from '../components/common/Page'
import { LocaleContext } from '../components/common/LocaleContext'
import { DangerNotification } from '../components/common/DangerNotification'
import PolicyStatusView from '../components/common/PolicyStatusView'

// resources(() => {
//   require('../../scss/policy-status.scss')
// })

class PolicyStatusTab extends React.Component {
  static propTypes = {
    policyName: PropTypes.string,
    policyNamespace: PropTypes.string,
  }

  constructor (props) {
    super(props)
  }

  static contextType = LocaleContext

  render() {
    const {
      policyName,
      policyNamespace:hubNamespace,
    } = this.props
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    return (
      <Query
        query={PolicyStatus}
        variables={{policyName, hubNamespace}}
        pollInterval={pollInterval}
        notifyOnNetworkStatusChange
      >
        {(result) => {
          const { data={}, error } = result
          if (error) {
            return (
              <Page>
                <DangerNotification error={error} />
              </Page>
            )
          }
          const { status } = data
          if (status) {
            return (
              <Page>
                {<PolicyStatusView
                  status={status}
                />}
              </Page>
            )
          } else {
            return (
              <Spinner className='patternfly-spinner' />
            )
          }
        }}
      </Query>
    )
  }
}

export default withRouter(PolicyStatusTab)

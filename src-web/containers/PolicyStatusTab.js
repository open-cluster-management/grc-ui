/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Spinner } from '@patternfly/react-core'
// import { updateSecondaryHeader } from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
// import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { PolicyStatus } from '../../lib/client/queries'
import Page from '../components/common/Page'
// import resources from '../../lib/shared/resources'
import { LocaleContext } from '../components/common/LocaleContext'
import PolicyStatusView from '../components/common/PolicyStatusView'
import { DangerNotification } from '../components/common/DangerNotification'
// import { getTabs } from '../../lib/client/resource-helper'

// resources(() => {
//   require('../../scss/policy-status.scss')
// })

class PolicyStatusTab extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    // match: PropTypes.object,
    // tabs: PropTypes.array,
    // updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
  }

  static contextType = LocaleContext

  // getBreadcrumb(urlPrefix, policyName, hubNamespace) {
  //   const breadcrumbItems = []
  //   const { locale } = this.context
  //   breadcrumbItems.push({
  //     label: msgs.get('tabs.hcmcompliance', locale),
  //     noLocale: true,
  //     url: `${urlPrefix}/all`
  //   },
  //   {
  //     label: policyName,
  //     noLocale: true,
  //     url: `${urlPrefix}/all/${hubNamespace}/${policyName}`
  //   },
  //   {
  //     label: msgs.get('table.header.status', locale),
  //     noLocale: true,
  //     url: `${urlPrefix}/all/${hubNamespace}/${policyName}/status`
  //   })
  //   return breadcrumbItems
  // }

  // componentDidMount() {
  //   const { location, tabs, match, updateSecondaryHeader: localUpdateSecondaryHeader } = this.props
  //   const urlSegments = (typeof location.pathname === 'string') ? location.pathname.split('/') : []
  //   let urlPrefix = '', policyName = '', hubNamespace = ''
  //   if (urlSegments.length > 3) {
  //     urlPrefix = urlSegments.slice(0, 3).join('/')
  //     policyName = urlSegments[urlSegments.length-2]
  //     hubNamespace = urlSegments[urlSegments.length-3]
  //   }
  //   localUpdateSecondaryHeader(policyName, getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(urlPrefix, policyName, hubNamespace))
  // }

  render() {
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    const { location } = this.props
    const urlSegments = (typeof location.pathname === 'string') ? location.pathname.split('/') : []
    let policyName = ''
    let hubNamespace = ''
    if (urlSegments.length > 3) {
      policyName = urlSegments[urlSegments.length-2]
      hubNamespace = urlSegments[urlSegments.length-3]
    }
    console.log(JSON.stringify(policyName))
    console.log(JSON.stringify(hubNamespace))
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
//   }
// }

export default withRouter(PolicyStatusTab)

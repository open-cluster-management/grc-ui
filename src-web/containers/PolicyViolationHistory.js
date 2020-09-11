/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NotificationDrawer, NotificationDrawerBody,
  NotificationDrawerList, NotificationDrawerListItem,
  NotificationDrawerListItemHeader, Spinner } from '@patternfly/react-core'
import { updateSecondaryHeader } from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { PolicyViolationHistory } from '../../lib/client/queries'
import Page from '../components/common/Page'
import resources from '../../lib/shared/resources'
import { LocaleContext } from '../components/common/LocaleContext'

resources(() => {
  //TODO change scss
  // require('../../scss/policy-template-details.scss')
})

class PolicyTemplateDetails extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    // resourceType: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  static contextType = LocaleContext

  constructor (props) {
    super(props)
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const { location } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/')
    const { match: { params: { policyName, hubNamespace, cluster }} } = this.props
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
      label: cluster,
      noLocale: true,
      url: `${urlSegments.join('/')}`
    })
    return breadcrumbItems
  }

  componentDidMount() {
    const { updateSecondaryHeader: localUpdateSecondaryHeader, match: { params: { name }} } = this.props
    localUpdateSecondaryHeader(name, null, this.getBreadcrumb())
  }

  render() {
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    const { match: { params: { policyName, hubNamespace, cluster, template }}} = this.props
    return (
      <Query query={PolicyViolationHistory} variables={{policyName, hubNamespace, cluster, template}} pollInterval={pollInterval} notifyOnNetworkStatusChange >
        {(result) => {
          const { data={}, error } = result
          if (error) {
            return (
              <Page>
                <NotificationDrawer>
                  <NotificationDrawerBody>
                    <NotificationDrawerList>
                      <NotificationDrawerListItem variant="danger">
                        <NotificationDrawerListItemHeader
                          variant="danger"
                          title={error.message}
                          srTitle="Danger notification:"
                        />
                      </NotificationDrawerListItem>
                    </NotificationDrawerList>
                  </NotificationDrawerBody>
                </NotificationDrawer>
              </Page>
            )
          }
          const { items } = data
          if (items) {
            console.log(items)
            return (
              <Page>
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyTemplateDetails))

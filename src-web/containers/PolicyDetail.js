/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import {GRC_REFRESH_INTERVAL_COOKIE, RESOURCE_TYPES} from '../../lib/shared/constants'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import Page from '../components/common/Page'
import {updateSecondaryHeader} from '../actions/common'
import { HCMCompliance } from '../../lib/client/queries'
import { getTabs } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import getResourceDefinitions from '../definitions'
// eslint-disable-next-line import/no-named-as-default
import PolicyDetailsOverview from '../components/common/PolicyDetailsOverview'
import PolicyViolationTab from './PolicyViolationTab'
import PolicyTemplateTab from './PolicyTemplateTab'

class PolicyDetail extends React.Component {

  static propTypes = {
    launch_links: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.any,
    resourceType: PropTypes.any,
    tabs: PropTypes.array,
    updateSecondaryHeader: PropTypes.func,
  }

  static defaultProps = {
    tabs: ['detail','violation','yaml'],
    resourceType: RESOURCE_TYPES.HCM_COMPLIANCES
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  UNSAFE_componentWillMount() {
    const {
      updateSecondaryHeader:localUpdateSecondaryHeader,
      tabs,
      launch_links,
      match,
      location
    } = this.props
    localUpdateSecondaryHeader(this.getPolicyName(location), getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(), launch_links)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const {
        updateSecondaryHeader:localUpdateSecondaryHeader,
        tabs,
        launch_links,
        match
      } = this.props
      localUpdateSecondaryHeader(
        this.getPolicyName(nextProps.location),
        getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`),
        this.getBreadcrumb(nextProps.location), launch_links
      )
    }
  }

  render () {
    const { resourceType } = this.props
    const url = _.get(this.props, 'match.url')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 1]
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)

    return (
      <Page>
        <Query query={HCMCompliance} variables={{name: policyName}} pollInterval={pollInterval} notifyOnNetworkStatusChange >
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
            const refreshControl = {
              reloading,
              refreshCookie: GRC_REFRESH_INTERVAL_COOKIE,
              startPolling, stopPolling, refetch,
              timestamp: this.timestamp
            }

            return (
              <Switch>
                <Route path={`${url}/violation`} exact render={() => {
                  refreshControl.stopPolling()
                  return <PolicyViolationTab
                    staticResourceData={staticResourceData}
                    item={items}
                  />}}
                />
                <Route path={`${url}/yaml`} exact render={() => {
                  return <PolicyTemplateTab
                    resourceType={resourceType}
                    items={items}
                    staticResourceData={staticResourceData}
                    loading={loading}
                    error={error}
                  />}}
                />
                <Route path={url} exact render={() => (
                  <PolicyDetailsOverview
                    loading={!items && loading}
                    error={error}
                    item={items}
                    refreshControl={refreshControl}
                    resourceType={resourceType}
                    staticResourceData={staticResourceData}
                  /> )}
                />
              </Switch>
            )
          }}
        </Query>
      </Page>
    )
  }

  getBreadcrumb(location) {
    const breadcrumbItems = []
    location = location || this.props.location
    const { tabs } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The base path, calculated by the current location minus params
    const paramsLength = 1

    breadcrumbItems.push({
      label: msgs.get('tabs.grc.all', locale),
      noLocale: true,
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    breadcrumbItems.push({
      label: this.getPolicyName(location),
      noLocale: true,
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })

    return breadcrumbItems
  }

  getPolicyName(location) {
    const urlSegments = location.pathname.split('/')
    const lastSegment = urlSegments[urlSegments.length - 1]
    if( lastSegment === 'violation'|| lastSegment === 'yaml' ){
      return urlSegments[urlSegments.length - 2]
    }
    return lastSegment
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbs, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbs, undefined, information)),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyDetail))

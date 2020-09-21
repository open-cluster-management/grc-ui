/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import {RESOURCE_TYPES} from '../../lib/shared/constants'
import Page from '../components/common/Page'
import {updateSecondaryHeader} from '../actions/common'
import { getTabs } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import PolicyDetailTab from './PolicyDetailTab'
import PolicyStatusTab from './PolicyStatusTab'
import PolicyTemplateTab from './PolicyTemplateTab'

class PolicyDetailSubRouter extends React.Component {

  static propTypes = {
    launch_links: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.any,
    resourceType: PropTypes.any,
    tabs: PropTypes.array,
    updateSecondaryHeader: PropTypes.func,
  }

  static defaultProps = {
    tabs: ['detail','status','yaml'],
    resourceType: RESOURCE_TYPES.HCM_COMPLIANCES
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentDidMount() {
    const {
      updateSecondaryHeader:localUpdateSecondaryHeader,
      tabs,
      launch_links,
      match,
      location
    } = this.props
    localUpdateSecondaryHeader(
      this.getPolicyName(location),
      getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`),
      this.getBreadcrumb(location),
      launch_links
    )
  }

  render () {
    const { resourceType } = this.props
    const url = _.get(this.props, 'match.url')
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 1]
    const policyNamespace = this.getPolicyNamespace(location)

    return (
      <Page>
        <Switch>
          <Route path={`${url}/status`} exact render={() => {
            return <PolicyStatusTab
              policyName={policyName}
              policyNamespace={policyNamespace}
            />}}
          />
          <Route path={`${url}/yaml`} exact render={() => {
            return <PolicyTemplateTab
              policyName={policyName}
              policyNamespace={policyNamespace}
              resourceType={resourceType}
            />}}
          />
          <Route path={url} exact render={() => {
            return <PolicyDetailTab
              policyName={policyName}
              policyNamespace={policyNamespace}
              resourceType={resourceType}
            />}}
          />
        </Switch>
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
    const paramsLength = 2

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
    if( lastSegment === 'status'|| lastSegment === 'yaml' ){
      return urlSegments[urlSegments.length - 2]
    }
    return lastSegment
  }

  getPolicyNamespace(location) {
    const urlSegments = location.pathname.split('/')
    const lastSegment = urlSegments[urlSegments.length - 1]
    if( lastSegment === 'status'|| lastSegment === 'yaml' ){
      return urlSegments[urlSegments.length - 3]
    }
    return urlSegments[urlSegments.length - 2]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbs, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbs, undefined, information))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyDetailSubRouter))

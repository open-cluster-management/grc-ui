/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {RESOURCE_TYPES} from '../../lib/shared/constants'
import Page from '../components/common/Page'
import {updateSecondaryHeader} from '../actions/common'
import { getTabs } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import PolicyDetailsTab from './PolicyDetailsTab'
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
    resourceType: RESOURCE_TYPES.POLICIES_BY_POLICY
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentDidMount() {
    const {
      updateSecondaryHeader:localUpdateSecondaryHeader,
      match,
      tabs,
      launch_links,
      location
    } = this.props

    const baseUrl = this.getBaseUrl()
    localUpdateSecondaryHeader(
      match.params.name,
      getTabs(tabs, (tab, index) => index === 0 ? baseUrl : `${baseUrl}/${tab}`),
      this.getBreadcrumb(location),
      launch_links
    )
  }

  render () {
    const { resourceType, match, tabs } = this.props
    const url = this.getBaseUrl()
    const policyName = match.params.name
    const policyNamespace = match.params.namespace
    const tabName = match.params.tab
    let TabPage

    switch (tabName) {
      case 'status':
        TabPage = PolicyStatusTab
        break
      case 'yaml':
        TabPage = PolicyTemplateTab
        break
      default:
        TabPage = PolicyDetailsTab
    }

    return (
      <Page>
        <TabPage
          policyName={policyName}
          policyNamespace={policyNamespace}
          resourceType={resourceType}
          tabs={tabs}
          url={url}
        />
      </Page>
    )
  }

  getBaseUrl() {
    const { match } = this.props
    // If it exists, remove the tab from the URL path to find the base path
    return match.params.tab ? match.url.split('/').slice(0, -1).join('/') : match.url
  }

  getBreadcrumb(location) {
    const breadcrumbItems = []
    location = location || this.props.location
    const { match } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/'),
          currentTab = match.params.tab

    // The base path, calculated by the current location minus params
    const paramsLength = 2

    breadcrumbItems.push({
      label: msgs.get('tabs.grc.all', locale),
      noLocale: true,
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    breadcrumbItems.push({
      label: match.params.name,
      noLocale: true,
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })
    return breadcrumbItems
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbs, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbs, undefined, information))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyDetailSubRouter))

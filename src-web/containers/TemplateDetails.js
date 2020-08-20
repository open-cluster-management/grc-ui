/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSecondaryHeader } from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRC_REFRESH_INTERVAL_COOKIE, RESOURCE_TYPES } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { PolicyTemplateDetail } from '../../lib/client/queries'
import PolicyTemplateDetails from '../components/common/PolicyTemplateDetails'
import Page from '../components/common/Page'
import resources from '../../lib/shared/resources'

resources(() => {
  require('../../scss/policy-template-details.scss')
})

class TemplateDetails extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    resourceType: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  static defaultProps = {
    resourceType: RESOURCE_TYPES.HCM_COMPLIANCES,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    console.log(this.props)
    const { updateSecondaryHeader: localUpdateSecondaryHeader, match: { params: { name }} } = this.props
    localUpdateSecondaryHeader(name, null, this.getBreadcrumb())
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const {  location, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/')
    const { match: { params: { name, policyName, policyNamespace, clusterName, kind }} } = this.props
    console.log(this.props)

    // Push only one breadcrumb to overview page
    if (resourceType.name === RESOURCE_TYPES.HCM_COMPLIANCES.name) {
      breadcrumbItems.push({
        label: msgs.get('tabs.hcmcompliance', locale),
        noLocale: true,
        url: `${urlSegments.slice(0, 3).join('/')}/all`
      },
      {
        label: policyName,
        noLocale: true,
        url: `${urlSegments.slice(0, 3).join('/')}/all/${policyNamespace}/${policyName}`
      },
      {
        label: clusterName,
        noLocale: true,
        url: `${urlSegments.join('/')}`
      },
      {
        label: kind.toLowerCase(),
        noLocale: true,
        url: `${urlSegments.join('/')}`
      },
      {
        label: name,
        noLocale: true,
        url: `${urlSegments.join('/')}`
      })
    }
    return breadcrumbItems
  }

  render() {
    // const url = lodash.get(this.props, 'location.pathname')
    // const urlSegments = url.split('/')
    // const policyName = urlSegments[urlSegments.length - 1]
    // const policyNamespace = urlSegments[urlSegments.length - 2]
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    const { match: { params: { clusterName: cluster, apiGroup, version, kind, name }}} = this.props
    const selfLink = `/apis/${apiGroup}/${version}/namespaces/${cluster}/${kind}/${name}`
    console.log(selfLink)
    return (
      <Query query={PolicyTemplateDetail} variables={{name, cluster, kind, selfLink}} pollInterval={pollInterval} notifyOnNetworkStatusChange >
        {(result) => {
          const {data={}, loading} = result
          console.log(result)
          const { items } = data
          // const error = template ? null : result.error
          const firstLoad = this.firstLoad
          this.firstLoad = false
          const reloading = !firstLoad && loading
          if (!reloading) {
            this.timestamp = new Date().toString()
          }
          if (items) {
            items.status.relatedObject = [
              {
                object: {
                  kind: 'Pod',
                  apiVersion: 'v1',
                  metadata: {
                    name: 'sample-1',
                    namespace: 'default',
                    selfLink: '/api/v1/namespaces/default/pods/sample-nginx-pod'
                  }
                },
                compliant: 'NonCompliant',
                reason: 'ExistsButDoesNotMatch',
              },
              {
                object: {
                  kind: 'Pod',
                  apiVersion: 'v1',
                  metadata: {
                    name: 'sample-2',
                    namespace: 'default',
                    selfLink: '/api/v1/namespaces/default/pods/sample-nginx-pod'
                  }
                },
                compliant: 'Compliant',
                reason: 'ExistsAndMatches',
              },
            ]
            return (
              <Page>
                <PolicyTemplateDetails template={items} />
              </Page>
            )
          } else {
            return <Page />
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

export default withRouter(connect(null, mapDispatchToProps)(TemplateDetails))

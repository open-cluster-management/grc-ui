/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Spinner } from '@patternfly/react-core'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { POLICY_TEMPLATE_DETAILS } from '../../lib/client/queries'
import PolicyTemplateDetailsView from '../components/modules/PolicyTemplateDetailsView'
import resources from '../../lib/shared/resources'
import { LocaleContext } from '../components/common/LocaleContext'
import { DangerNotification } from '../components/common/DangerNotification'
import { INITIAL_REFRESH_TIME, REFRESH_INTERVALS, REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { AcmPage, AcmPageHeader, AcmAutoRefreshSelect, AcmRefreshTime } from '@open-cluster-management/ui-components'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/policy-template-details.scss')
})

class PolicyTemplateDetails extends React.Component {
  static propTypes = {
    match: PropTypes.object,
  }

  static contextType = LocaleContext

  constructor (props) {
    super(props)
  }

  render() {
    const { match: { params: { name, namespace, cluster, apiGroup, version, kind, template }}} = this.props
    const { locale } = this.context
    const selfLink = `/apis/${apiGroup}/${version}/namespaces/${cluster}/${kind}/${template}`
    return (
      <Query query={POLICY_TEMPLATE_DETAILS} variables={{name:template, cluster, kind, selfLink}} notifyOnNetworkStatusChange >
        {(result) => {
          const { data={}, loading, refetch, error } = result
          if (!loading) {
            this.timestamp = new Date().toString()
          }
          if (error) {
            return (
              <DangerNotification error={error} />
            )
          }
          const { items } = data
          if (items) {
            return (
              <AcmPage>
                <AcmPageHeader title= {template}
                  breadcrumb={[{ text: msgs.get('routes.policies', locale), to: config.contextPath },
                    { text: name, to: `${config.contextPath}/all/${namespace}/${name}`},
                    { text: msgs.get('table.header.status', locale), to: `${config.contextPath}/all/${namespace}/${name}/status`},
                    { text: template}]}
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
                <PolicyTemplateDetailsView template={items} selfLink={selfLink} />
            </AcmPage>
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

export default withRouter(PolicyTemplateDetails)

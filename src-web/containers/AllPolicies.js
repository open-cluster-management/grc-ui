/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { AcmButton, AcmPage, AcmPageHeader, AcmAutoRefreshSelect, AcmRefreshTime } from '@open-cluster-management/ui-components'
import { ALL_POLICIES } from '../../lib/client/queries'
import { LocaleContext } from '../components/common/LocaleContext'
import { INITIAL_REFRESH_TIME, REFRESH_INTERVALS, REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'
import Page from '../components/common/Page'
// eslint-disable-next-line import/no-named-as-default
import GrcView from '../components/modules/GrcView'
import checkCreatePermission from '../components/common/CheckCreatePermission'


class AllPolicies extends React.Component {

  static contextType = LocaleContext

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  render () {
    const { locale } = this.context
    const { history, userAccess } = this.props
    const pollInterval = localStorage.getItem(REFRESH_INTERVAL_COOKIE) || INITIAL_REFRESH_TIME
    return (
      <Page>
        <Query query={ALL_POLICIES} pollInterval={pollInterval*1000} notifyOnNetworkStatusChange >
          {( complianceResult ) => {
            const {data={}, loading, refetch} = complianceResult
            const { items } = data
            const error = items ? null : complianceResult.error
            if (error) {
              const errorName = complianceResult.error.graphQLErrors[0].name ? complianceResult.error.graphQLErrors[0].name : error.name
              error.name = errorName
            }
            if (!loading) {
              this.timestamp = new Date().toString()
            }
            const isDisabled = checkCreatePermission(userAccess)===0
            return (
              <AcmPage>
                <AcmPageHeader title= {msgs.get('routes.grc', locale)} controls={
                  <React.Fragment>
                    <AcmAutoRefreshSelect refetch={refetch}
                      refreshIntervals={REFRESH_INTERVALS}
                      refreshIntervalCookie={REFRESH_INTERVAL_COOKIE}
                      initRefreshTime={INITIAL_REFRESH_TIME} />
                    <AcmRefreshTime timestamp={this.timestamp} reloading={loading} />
                    <AcmButton id='create-policy' isDisabled={isDisabled}
                      tooltip={msgs.get('error.permission.disabled', locale)}
                      onClick={() => history.push(`${config.contextPath}/create`)}>
                      {msgs.get('routes.create.policy', locale)}
                    </AcmButton>
                  </React.Fragment>
                }>
                </AcmPageHeader>
                <GrcView
                  loading={!items && loading}
                  error={error}
                  grcItems={items}
                />
              </AcmPage>
            )
          }}
        </Query>
      </Page>
    )
  }
}
AllPolicies.propTypes = {
  history: PropTypes.object.isRequired,
  userAccess: PropTypes.array,
}


const mapStateToProps = (state) => {
  const userAccess = state.userAccess && state.userAccess.access
    ? state.userAccess.access
    : []
  return {
    userAccess: userAccess,
  }
}

export default withRouter(connect(mapStateToProps)(AllPolicies))

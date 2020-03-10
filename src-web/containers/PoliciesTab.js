/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import apolloClient from '../../lib/client/apollo-client'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { getPollInterval } from '../components/common/RefreshTimeSelect'
import Page from '../components/common/Page'
// without curly braces means component with redux
// eslint-disable-next-line import/no-named-as-default
import GrcView from '../components/GrcView'
import { updateSecondaryHeader } from '../actions/common'
import { HCMComplianceList, HCMApplicationList } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'

class PoliciesTab extends React.Component {

  static propTypes = {
    secondaryHeaderProps: PropTypes.object,
    showApplications: PropTypes.bool,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, links, information } = secondaryHeaderProps
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
  }

  render () {
    const { secondaryHeaderProps } = this.props
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    const showApplications = this.props.showApplications === undefined ? config['feature_applications'] : this.props.showApplications
    return (
      <Page>
        <Query query={HCMComplianceList} pollInterval={pollInterval} notifyOnNetworkStatusChange >
          {( result ) => {
            const {data={}, loading, startPolling, stopPolling, refetch} = result
            const { items } = data
            const error = items ? null : result.error
            const firstLoad = this.firstLoad
            this.firstLoad = false
            const reloading = !firstLoad && loading
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
              showApplications ?
                <Query query={HCMApplicationList} pollInterval={pollInterval} client={apolloClient.getSearchClient()} notifyOnNetworkStatusChange >
                  {( result ) => {
                    const {data={}} = result
                    const { applications } = data
                    const searchError = applications ? null : result.error
                    return (
                      <GrcView
                        showApplications={showApplications}
                        loading={!items && loading}
                        error={error}
                        searchError={searchError}
                        grcItems={items}
                        applications = {applications}
                        refreshControl={refreshControl}
                        secondaryHeaderProps={secondaryHeaderProps}
                      />
                    )
                  }
                  }
                </Query>
                :
                <GrcView
                  showApplications={showApplications}
                  loading={!items && loading}
                  error={error}
                  grcItems={items}
                  refreshControl={refreshControl}
                  secondaryHeaderProps={secondaryHeaderProps}
                />
            )
          }
          }
        </Query>
      </Page>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PoliciesTab))


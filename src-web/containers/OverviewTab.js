/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import GrcApolloClient from '../../lib/client/apollo-client'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Page from '../components/common/Page'
// without curly braces means component with redux
// eslint-disable-next-line import/no-named-as-default
import OverviewView from '../components/OverviewView'
import { GRC_REFRESH_INTERVAL_COOKIE}  from '../../lib/shared/constants'
import { updateModal, updateSecondaryHeader } from '../actions/common'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import { GRCList, HCMApplicationList, GRCListNoSA } from '../../lib/client/queries'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'

class OverviewTab extends React.Component {

  static propTypes = {
    openDesModal: PropTypes.func,
    secondaryHeaderProps: PropTypes.object,
    showApplications: PropTypes.bool,
    updateSecondaryHeader: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentWillMount() {
    const { updateSecondaryHeader:localUpdateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, links, information } = secondaryHeaderProps
    localUpdateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
  }

  handleDescription = (title, content = 'placeholder') => () => {
    const {openDesModal} = this.props
    openDesModal(content, title)
  }

  render () {
    const { userpreferences } = this.props
    const showFindings = config['feature_security-findings']
    const activeAccountId = (userpreferences && userpreferences.userPreferences) ? userpreferences.userPreferences.activeAccountId : ''
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    const showApplications = this.props.showApplications === undefined ? config['feature_applications'] : this.props.showApplications
    return (
      <Page>
        <Query
          query={showFindings ? GRCList : GRCListNoSA}
          variables={showFindings ? {userAccountID: activeAccountId} : null}
          pollInterval={pollInterval}
          notifyOnNetworkStatusChange
        >
          {( result ) => {
            const {loading, startPolling, stopPolling, refetch} = result
            const {data={}} = result
            const { policies, findings } = data
            const error = policies ? null : result.error
            if (error) {
              const errorName = result.error.graphQLErrors[0].name ? result.error.graphQLErrors[0].name : error.name
              error.name = errorName
            }
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
                <Query query={HCMApplicationList} pollInterval={pollInterval} client={GrcApolloClient.getSearchClient()} notifyOnNetworkStatusChange >
                  {( result ) => {
                    const {applicationsData={}} = result
                    const { applications } = applicationsData
                    const searchError = applications ? null : result.error
                    return (
                      <OverviewView
                        showApplications={showApplications}
                        loading={!policies && loading}
                        error={error}
                        searchError={searchError}
                        applications = {applications}
                        policies={policies}
                        findings={findings}
                        refreshControl={refreshControl}
                      />
                    )
                  }
                  }
                </Query>
                :
                <OverviewView
                  showApplications={showApplications}
                  loading={!policies && loading}
                  error={error}
                  policies={policies}
                  findings={findings}
                  refreshControl={refreshControl}
                />
            )
          }
          }
        </Query>
      </Page>
    )
  }
}

OverviewTab.propTypes = {
  userpreferences: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    userpreferences: state.userpreferences
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
    openDesModal: (content, title) => dispatch(updateModal({ open: true, type: 'description', content: content, title: title})),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewTab))

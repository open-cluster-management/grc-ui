/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import resources from '../../lib/shared/resources'
import _ from 'lodash'
import { updateResourceToolbar } from '../actions/common'
import PolicyTemplatesView from '../components/common/PolicyTemplatesView'
import getResourceDefinitions from '../definitions'
import { HCMCompliance } from '../../lib/client/queries'
import {getPollInterval} from '../components/common/RefreshTimeSelect'
import {GRC_REFRESH_INTERVAL_COOKIE} from '../../lib/shared/constants'
import { Spinner } from '@patternfly/react-core'
import { DangerNotification } from '../components/common/DangerNotification'

resources(() => {
  require('../../scss/policy-yaml-tab.scss')
})

class PolicyTemplateTab extends React.Component{
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.refreshControl, this.props.refreshControl)) {
      this.props.updateResourceToolbar(this.props.refreshControl, {})
    }
  }

  render() {
    const {
      policyName,
      policyNamespace,
      resourceType
    } = this.props
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    return <Query
      query={HCMCompliance}
      variables={{name: policyName, namespace: policyNamespace}}
      pollInterval={pollInterval}
      notifyOnNetworkStatusChange
    >
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
        if (error) {
          return (
            <DangerNotification error={error} />
          )
        } else if (loading && items === undefined) {
          return <Spinner className='patternfly-spinner' />
        } else{
          if (pollInterval) {
            refreshControl.startPolling(pollInterval)
          }
          const item = items[0]
          return <PolicyTemplatesView
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            resourceData={item}
            className='compliance-templates'
            headerKey={'table.header.complianceTemplate'}
          />
        }
      }}
    </Query>
  }

}

PolicyTemplateTab.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplateTab.propTypes = {
  policyName: PropTypes.string,
  policyNamespace: PropTypes.string,
  refreshControl: PropTypes.object,
  resourceType: PropTypes.object,
  updateResourceToolbar: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl) => dispatch(updateResourceToolbar(refreshControl, {}))
  }
}

export default withRouter( connect(null, mapDispatchToProps) (PolicyTemplateTab))


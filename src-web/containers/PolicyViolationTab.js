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

// seems to be an issue with this rule and redux connect method in SecondaryHeader
/* eslint-disable import/no-named-as-default */

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateResourceToolbar } from '../actions/common'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../../lib/shared/constants'
import { getPollInterval } from '../components/common/RefreshTimeSelect'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'
import {  Loading } from 'carbon-components-react'
import _ from 'lodash'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { HCMPolicyViolations } from '../../lib/client/queries'
import NoResource from '../components/common/NoResource'
import { LocaleContext } from '../components/common/LocaleContext'

resources(() => {
  require('../../scss/policy-violation-tab.scss')
})

class PolicyViolationTab extends React.Component{
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.refreshControl, this.props.refreshControl)) {
      this.props.updateResourceToolbar(this.props.refreshControl, {})
    }
  }

  render() {
    const url = _.get(this.props, 'match.url')
    const item = _.get(this.props, 'item',[])
    const namespace = _.get(item[0], 'metadata.namespace', null)
    const urlSegments = url.split('/')
    const policyName = urlSegments[urlSegments.length - 2]
    const {staticResourceData} = this.props
    const pollInterval = getPollInterval(GRC_REFRESH_INTERVAL_COOKIE)
    if(namespace === null){
      return (<Loading withOverlay={false} className='content-spinner' />)
    }

    return (
      <Query query={HCMPolicyViolations} pollInterval={pollInterval} variables={{policyName: policyName, policyNamespace: namespace}}>
        {({ data, loading }) => {
          if (loading || !data || !data.violations) {
            return (<Loading withOverlay={false} className='content-spinner' />)
          } else {
            if (data.violations.length > 0) {
              return (<div className='policy-violation-tab'>
                <h5 className='section-title'>Violations</h5>
                <ResourceTableModule
                  definitionsKey='policyViolations'
                  staticResourceData={staticResourceData}
                  resourceData={data}
                  showModuleHeader={false}
                  showSearch={false}
                  showPagination={false}
                />
              </div>)
            } else {
              return <NoResource title={msgs.get('table.title.no.violation', this.context.locale)} />
            }
          }
        }}
      </Query>
    )
  }
}

PolicyViolationTab.propTypes = {
  refreshControl: PropTypes.object,
  staticResourceData: PropTypes.object,
  updateResourceToolbar: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl) => dispatch(updateResourceToolbar(refreshControl, {}))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PolicyViolationTab))

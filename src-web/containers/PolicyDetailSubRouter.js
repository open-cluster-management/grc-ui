/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
// import msgs from '../../nls/platform.properties'
import PolicyDetailsTab from './PolicyDetailsTab'
import PolicyStatusTab from './PolicyStatusTab'
// import PolicyTemplateTab from './PolicyTemplateTab'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

class PolicyDetailSubRouter extends React.Component {

  static propTypes = {
    match: PropTypes.any,
    resourceType: PropTypes.any,
    // tabs: PropTypes.array,
  }

  static defaultProps = {
    tabs: ['detail','status','yaml'],
    resourceType: RESOURCE_TYPES.POLICIES_BY_POLICY
  }

  constructor (props) {
    super(props)
  }

  render () {
    const { resourceType, match } = this.props
    // const url = this.getBaseUrl()
    const policyName = match.params.name
    const policyNamespace = match.params.namespace
    const tabName = match.params.tab
    let TabPage

    switch (tabName) {
      case 'status':
        TabPage = PolicyStatusTab
        break
      // case 'yaml':
      //   TabPage = PolicyTemplateTab
      //   break
      default:
        TabPage = PolicyDetailsTab
    }

    return (
      <TabPage
        policyName={policyName}
        policyNamespace={policyNamespace}
        resourceType={resourceType}
        tab={tabName}
      />
    )
  }

}


export default withRouter(PolicyDetailSubRouter)

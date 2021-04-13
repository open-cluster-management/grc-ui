/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import DetailsModule from '../common/DetailsModule'
import PatternFlyTable from '../common/PatternFlyTable'
import NoResource from '../../components/common/NoResource'
import { getResourceData } from '../../tableDefinitions'
import { transform } from '../../tableDefinitions/utils'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'


resources(() => {
  require('../../../scss/policy-details-overview.scss')
})

export class PolicyDetailsOverview extends React.PureComponent{
  constructor(props) {
    super(props)
  }

  static propTypes = {
    items: PropTypes.array,
    location: PropTypes.object,
    resourceType: PropTypes.object,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  static defaultProps = {
    resourceType: RESOURCE_TYPES.POLICIES_BY_POLICY,
  }

  render() {
    const {items, resourceType} = this.props
    if (items.length === 0) {
      return <NoResource
        title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
        svgName='EmptyPagePlanet-illus.png'>
      </NoResource>
    } else if (items.length > 1) {
      console.error(`Only one policy was expected but ${items.length} were received. The other policies will be ignored.`)
    }
    const localItem = items[0]
    const staticResourceData = getResourceData(resourceType)
    const { locale } = this.context
    const clusterList = transform([localItem], staticResourceData.placementClusterKeys, locale)

    const modulesSecond = [
      <PatternFlyTable
        key='cluster-list'
        className={'cluster-list'}
        {...clusterList}
        pagination={false}
        searchable={false}
      />
    ]
    let itemPR = null, itemPB = null
    if (localItem && localItem.placementPolicies && Array.isArray(localItem.placementPolicies)) {
      if (localItem.placementPolicies.length > 0) {
        itemPR = true
      }
    }
    if (localItem && localItem.placementBindings && Array.isArray(localItem.placementBindings)) {
      if (localItem.placementBindings.length > 0) {
        itemPB = true
      }
    }
    return (
      <div className='overview-content'>
        <div className='vertical-expend'>
          <DetailsModule
            listData = {localItem}
            listItem = {staticResourceData.detailKeys.rows}
            title = {staticResourceData.detailKeys.title}
            showHeader={false}
          />
        </div>
        <div className='vertical-expend'>
          <h5 className='section-title'>{msgs.get('table.header.placement', locale)}</h5>
          {itemPR && itemPB
            ? modulesSecond
            : <Alert title={msgs.get('error.no.placement', locale)} isInline='true' />}
        </div>
      </div>
    )
  }

  // handleClusterClick(cluster) {

  // }
}

export default withRouter(PolicyDetailsOverview)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { StructuredListWrapper, StructuredListRow, StructuredListCell, StructuredListBody, OverflowMenu, OverflowMenuItem, StructuredListSkeleton, Button } from 'carbon-components-react'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import _ from 'lodash'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { transform } from '../../../lib/client/resource-helper'
import { Link } from 'react-router-dom'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import { connect } from 'react-redux'
import StatusField from '../../components/common/StatusField'
import _uniqueId from 'lodash/uniqueId'

resources(() => {
  require('../../../scss/structured-list-with-actions.scss')
})

const StructuredListModule = ({
  title,
  rows,
  data,
  id,
  actions,
  location,
  textEditButton,
  getResourceAction,
  clusterStatus,
}, context) =>{
  if(!data){
    return <Module className='structured-list-module'><StructuredListSkeleton className='content-spinner' /></Module>
  }
  else{
    return <Module className='structured-list-module' id={id}>
      <div className='bx--module__header' style={{justifyContent: 'space-between'}} >
        <h1 className='bx--module__title'>{msgs.get(title, context.locale)}</h1>
        {actions && actions.length > 0 &&
        (actions.length === 1 && actions[0] === 'table.actions.edit' && textEditButton) ?
          (<Button small className='text-edit-button' onClick={() => getResourceAction(actions[0], data, null, history, context.locale)}>{msgs.get('table.actions.edit', context.locale)}</Button>) :
          (<OverflowMenu floatingMenu flipped iconDescription={msgs.get('svg.description.overflowMenu', context.locale)}>
            {actions.map((action) => (
              <OverflowMenuItem
                data-table-action={action}
                isDelete={action ==='table.actions.remove' || action ==='table.actions.policy.remove' || action ==='table.actions.applications.remove' || action ==='table.actions.compliance.remove' || action ==='table.actions.finding.remove'}
                onClick={() => getResourceAction(action, data, null, history, context.locale)}
                key={action}
                itemText={msgs.get(action, context.locale)}
              />
            ))}
          </OverflowMenu>)}
      </div>
      <ModuleBody>
        <StructuredListWrapper className='bx--structured-list--condensed' ariaLabel={msgs.get(title, context.locale)}>
          <StructuredListBody>
            {rows.map(row =>{
              if(row.cells[0].resourceKey === 'policy.pp.details.decisions'){
                const formatDecisions = StructuredListModule.formatDecisionsWithLinkAndIcon(row.cells[1].resourceKey, data, clusterStatus, location)
                return (<StructuredListRow>
                  <StructuredListCell key={_uniqueId('key')}><p>{msgs.get('policy.pp.details.decisions', context.locale)}</p></StructuredListCell>
                  <StructuredListCell key={_uniqueId('key')}>{formatDecisions}</StructuredListCell>
                </StructuredListRow>)
              }
              else{
                return (<StructuredListRow>
                  {row.cells.map((cell, index) =>
                    <StructuredListCell key={_uniqueId('key')}>
                      { index === 0 ? <p>{transform(data, cell, context.locale)}</p> : transform(data, cell, context.locale)}
                    </StructuredListCell>
                  )}
                </StructuredListRow>)
              }
            })}
          </StructuredListBody>
        </StructuredListWrapper>
      </ModuleBody>
    </Module>
  }
}

StructuredListModule.contextTypes = {
  locale: PropTypes.string
}

// eslint-disable-next-line react/display-name
StructuredListModule.formatDecisionsWithLinkAndIcon = (resourceKey, data, clusterStatus, location) => {
  const decisions = _.get(data[resourceKey], 'decisions')
  const hubNamespace = _.get(data,'metadata.namespace')
  const urlSegments = location.pathname.replace(/\/$/, '').split('/')
  const baseUrl = urlSegments.slice(0, urlSegments.length-2 ).join('/')
  const policyName = urlSegments[urlSegments.length-1]
  const links = []
  _.forEach(decisions, (item) => {
    const cluster = _.get(item, 'clusterName')
    const status = clusterStatus[cluster] ? clusterStatus[cluster].toLowerCase() : 'undefined'
    let statusIcon
    if(status === 'compliant'){
      statusIcon = <StatusField status='ok' />
    }
    else {
      statusIcon = <StatusField status='critical' />
    }
    links.push(<div className='one-cluster-status' key={`${cluster}-container`}>
      <Link to= {`${baseUrl}/policy/${cluster}/${hubNamespace}.${policyName}`} >{cluster}</Link>
      {statusIcon}
    </div>)
  })
  return <div className='cluster-status-container'>{links}</div>
}

const mapStateToProps = state => ({
  navRoutes: state.nav && state.nav.navItems
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getResourceAction: (action, resource, hasService) => resourceActions(action, dispatch, ownProps.resourceType, resource, hasService)
})

export default connect(mapStateToProps, mapDispatchToProps)(StructuredListModule)

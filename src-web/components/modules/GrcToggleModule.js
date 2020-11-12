/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ToggleGroup,
  ToggleGroupItem,
  Spinner
} from '@patternfly/react-core'
import PatternFlyTable from '../common/PatternFlyTable'
import { LocaleContext } from '../common/LocaleContext'
import grcPoliciesViewDef from '../../tableDefinitions/grcPoliciesViewDef'
import grcClustersViewDef from '../../tableDefinitions/grcClustersViewDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'
import { formatPoliciesToClustersTableData } from '../common/FormatTableData'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import _ from 'lodash'
import { resourceActions } from '../common/ResourceTableRowMenuItemActions'
import formatUserAccess from '../common/FormatUserAccess'
import filterUserAction from '../common/FilterUserAction'
import { REQUEST_STATUS } from '../../actions/index'
import { createDisableTooltip } from '../common/DisableTooltip'

resources(() => {
  require('../../../scss/grc-toggle-module.scss')
})

class GrcToggleModule extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  render() {
    const { grcItems, showGrcTabToggle, grcTabToggleIndex, handleToggleClick, status } = this.props
    const { locale } = this.context
    const tableDataByPolicies = transform(grcItems, grcPoliciesViewDef, locale)
    const tableDataByCLusters = transform(formatPoliciesToClustersTableData(grcItems), grcClustersViewDef, locale)
    if (status !== REQUEST_STATUS.INCEPTION && status !== REQUEST_STATUS.DONE){
      return <Spinner className='patternfly-spinner' />
    }
    return (
      <div className='grc-toggle'>
        {showGrcTabToggle && <ToggleGroup className='grc-toggle-button' variant='light'>
          <ToggleGroupItem
            buttonId={'grc-policies-view'}
            onChange={handleToggleClick}
            isSelected={grcTabToggleIndex===0}>
            {msgs.get('tabs.grc.toggle.allPolicies', locale)}
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'grc-cluster-view'}
            onChange={handleToggleClick}
            isSelected={grcTabToggleIndex===1}>
            {msgs.get('tabs.grc.toggle.clusterViolations', locale)}
          </ToggleGroupItem>
        </ToggleGroup>}
        <div className='resource-table'>
          {grcTabToggleIndex===0 && <div className='grc-view-by-policies-table'>
            <PatternFlyTable
              {...tableDataByPolicies}
              searchPlaceholder={msgs.get('tabs.grc.toggle.allPolicies.placeHolderText', locale)}
              noResultMsg={msgs.get('table.search.no.results', locale)}
              areActionsDisabled={false}
              dropdownPosition={'right'}
              dropdownDirection={'down'}
              tableActionResolver={this.tableActionResolver}
            />
          </div>}
          {grcTabToggleIndex===1 && <div className='grc-view-by-clusters-table'>
            <PatternFlyTable
              {...tableDataByCLusters}
              searchPlaceholder={msgs.get('tabs.grc.toggle.clusterViolations.placeHolderText', locale)}
              noResultMsg={msgs.get('table.search.no.results', locale)}
              areActionsDisabled={false}
              dropdownPosition={'right'}
              dropdownDirection={'down'}
              tableActionResolver={this.tableActionResolver}
            />
          </div>}
        </div>
      </div>
    )
  }

  tableActionResolver = (rowData) => {
    const { getResourceAction, userAccess, grcTabToggleIndex} = this.props
    let resourceType = RESOURCE_TYPES.POLICIES_BY_POLICY
    let tableActions = grcPoliciesViewDef.tableActions
    if (grcTabToggleIndex === 1) {
      resourceType = RESOURCE_TYPES.POLICIES_BY_CLUSTER
      tableActions = grcClustersViewDef.tableActions
    }
    const { locale } = this.context
    const userAccessHash = formatUserAccess(userAccess)
    const actionsList = []
    const rowName = typeof _.get(rowData, ['0', 'title', 'props', 'children']) === 'string'
      ? _.get(rowData, ['0', 'title', 'props', 'children'])
      : _.get(rowData, ['0', 'title', 'props', 'children', '0', 'props', 'children'])
    const rowArray = _.get(rowData, ['0', 'title', '_owner', 'stateNode', 'props', 'grcItems'])
      ? _.get(rowData, ['0', 'title', '_owner', 'stateNode', 'props', 'grcItems'])
      : _.get(rowData, ['0', 'title', 'props', 'children[0]', '_owner', 'stateNode', 'props', 'grcItems'])
    if (rowName && Array.isArray(rowArray) && rowArray.length > 0) {
      const row = rowArray.find(arrElement => _.get(arrElement, 'metadata.name') === rowName)
      const filteredActions = (Array.isArray(tableActions) && tableActions.length > 0)
        ? filterUserAction(row, tableActions, userAccessHash, resourceType)
        : []
      if (_.get(row, 'raw.spec.disabled', false)) {
        filteredActions[filteredActions.indexOf('table.actions.disable')] = 'table.actions.enable'
      } else {
        filteredActions[filteredActions.indexOf('table.actions.enable')] = 'table.actions.disable'
      }
      if (_.get(row, 'raw.spec.remediationAction', 'inform') === 'enforce') {
        filteredActions[filteredActions.indexOf('table.actions.enforce', locale)] = 'table.actions.inform'
      } else {
        filteredActions[filteredActions.indexOf('table.actions.inform')] = 'table.actions.enforce'
      }
      if (filteredActions.length > 0) {
        filteredActions.forEach((action) => {
          const disableFlag = action.includes('disabled.')
          if (disableFlag) {
            action = action.replace('disabled.', '')
          }
          if (action === 'table.actions.remove') {
            actionsList.push(
              {
                isSeparator: true
              }
            )
          }
          actionsList.push(
            {
              title: createDisableTooltip(disableFlag, action, locale, msgs.get(action, locale)),
              isDisabled: disableFlag ? true : false,
              onClick: () =>
                (disableFlag ? null : getResourceAction(action, row, resourceType))
            }
          )
        })
      }
    }
    return actionsList
  }
}

GrcToggleModule.propTypes = {
  getResourceAction: PropTypes.func,
  grcItems: PropTypes.array,
  grcTabToggleIndex: PropTypes.number,
  handleToggleClick: PropTypes.func,
  showGrcTabToggle: PropTypes.bool,
  status: PropTypes.string,
  userAccess: PropTypes.array,
}

const mapStateToProps = (state) => {
  const userAccess = state.userAccess ? state.userAccess.access : []

  return {
    status: state[RESOURCE_TYPES.POLICIES_BY_POLICY.query].status,
    userAccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getResourceAction: (action, resource, resourceType) =>
      resourceActions(action, dispatch, resourceType, resource)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GrcToggleModule)

/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ToggleGroup,
  ToggleGroupItem,
  Spinner
} from '@patternfly/react-core'
import {
  AcmTable
} from '@open-cluster-management/ui-components'
import { LocaleContext } from '../common/LocaleContext'
import grcPoliciesViewDef from '../../tableDefinitions/grcPoliciesViewDef'
import grcClustersViewDef from '../../tableDefinitions/grcClustersViewDef'
import { transform_new } from '../../tableDefinitions/utils'
import msgs from '../../nls/platform.properties'
import { formatPoliciesToClustersTableData } from '../../utils/FormatTableData'
import { RESOURCE_TYPES, GRC_SEARCH_STATE_COOKIE } from '../../utils/constants'
import _ from 'lodash'
import { resourceActions } from '../common/ResourceTableRowMenuItemActions'
import formatUserAccess from '../../utils/FormatUserAccess'
import filterUserAction from '../../utils/FilterUserAction'
import { REQUEST_STATUS } from '../../actions/index'
import { createDisableTooltip } from '../common/DisableTooltip'
import {
  getSessionState, replaceSessionPair
} from '../../utils/AccessStorage'

import '../../scss/grc-toggle-module.scss'

const componentName = 'GrcToggleModule'

class GrcToggleModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue : _.get(getSessionState(GRC_SEARCH_STATE_COOKIE), componentName, '')
    }
  }

  static contextType = LocaleContext

  render() {
    const { grcItems, grcTabToggleIndex, handleToggleClick, status } = this.props
    const { locale } = this.context
    const { searchValue } = this.state
    const tableType = grcTabToggleIndex == 0 ? 'policies' : 'clusters'
    const tableData = [
      transform_new(grcItems, grcPoliciesViewDef, locale),
      transform_new(formatPoliciesToClustersTableData(grcItems), grcClustersViewDef, locale),
    ]
    if (status !== REQUEST_STATUS.INCEPTION && status !== REQUEST_STATUS.DONE){
      return <Spinner className='patternfly-spinner' />
    }
    const extraToolbarControls = (
      <ToggleGroup className='grc-toggle-button'>
          <ToggleGroupItem
            buttonId={'grc-policies-view'}
            onChange={handleToggleClick}
            isSelected={grcTabToggleIndex===0}
            text={msgs.get('tabs.grc.toggle.allPolicies', locale)}
            >
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'grc-cluster-view'}
            onChange={handleToggleClick}
            isSelected={grcTabToggleIndex===1}
            text={msgs.get('tabs.grc.toggle.clusterViolations', locale)}
          >
          </ToggleGroupItem>
        </ToggleGroup>
    )
    return (
      <div className='grc-toggle'>
        <div className={`grc-view-by-${tableType}-table`}>
          <AcmTable
            items={tableData[grcTabToggleIndex].rows}
            columns={tableData[grcTabToggleIndex].columns}
            keyFn={(item) => item.uid.toString()}
            setSearch={searchValue}
            gridBreakPoint=''
            extraToolbarControls={extraToolbarControls}
            searchPlaceholder={msgs.get('tabs.grc.toggle.allPolicies.placeHolderText', locale)}
            paginationAtBottom
          />
        </div>
      </div>
    )
  }

  handleSearch = (value) => {
    const searchValue = (typeof value === 'string') ? value : ''
    replaceSessionPair(GRC_SEARCH_STATE_COOKIE, componentName, searchValue, true)
    this.setState({
      searchValue: searchValue
    })
  }

  tableActionResolver = (rowData) => {
    const { getResourceAction, userAccess, grcTabToggleIndex, history } = this.props
    const { locale } = this.context
    const userAccessHash = formatUserAccess(userAccess)
    const actionsList = []
    const rowName = typeof _.get(rowData, ['0', 'title', 'props', 'children']) === 'string'
      ? _.get(rowData, ['0', 'title', 'props', 'children'])
      : _.get(rowData, ['0', 'title', 'props', 'children', '0', 'props', 'children'])
    let rowArray = _.get(rowData, ['0', 'title', '_owner', 'stateNode', 'props', 'grcItems'])
      ? _.get(rowData, ['0', 'title', '_owner', 'stateNode', 'props', 'grcItems'])
      : _.get(rowData, ['0', 'title', 'props', 'children[0]', '_owner', 'stateNode', 'props', 'grcItems'])
      let resourceType, tableActions
      // Set table definitions and actions based on toggle position
      if (grcTabToggleIndex === 1) {
        resourceType = RESOURCE_TYPES.POLICIES_BY_CLUSTER
        tableActions = grcClustersViewDef.tableActions
        rowArray = formatPoliciesToClustersTableData(rowArray)
      } else {
        resourceType = RESOURCE_TYPES.POLICIES_BY_POLICY
        tableActions = grcPoliciesViewDef.tableActions
      }
    if (rowName && Array.isArray(rowArray) && rowArray.length > 0) {
      const row = rowArray.find(arrElement => {
        if (grcTabToggleIndex === 0) {
          return _.get(arrElement, 'metadata.name') === rowName
        } else {
          return _.get(arrElement, 'cluster') === rowName
        }
      })
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
          // if consoleURL is unavailable then don't show launch cluster button
          const removeLaunchCluster = (action.includes('launch.cluster')) && ((row && !row.consoleURL) || (row && row.consoleURL && row.consoleURL === '-'))
          if (!removeLaunchCluster) {
            actionsList.push(
              {
                title: createDisableTooltip(disableFlag, action, locale, msgs.get(action, locale)),
                isDisabled: disableFlag ? true : false,
                onClick: () =>
                  (disableFlag ? null : getResourceAction(action, row, resourceType, history))
              }
            )
          }
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
  history: PropTypes.object.isRequired,
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
    getResourceAction: (action, resource, resourceType, history) =>
      resourceActions(action, dispatch, resourceType, resource, history)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GrcToggleModule)

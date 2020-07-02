/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import resources from '../../../lib/shared/resources'
import { PAGE_SIZES } from '../../actions/index'
import { PaginationV2, DataTable, OverflowMenu, OverflowMenuItem, Icon, Checkbox, TooltipIcon } from 'carbon-components-react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import { transform } from '../../../lib/client/resource-helper'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import { connect } from 'react-redux'
import { getLink, getPrimaryKey, getSecondaryKey } from '../../definitions'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import ResourceTableRowExpandableContent from './ResourceTableRowExpandableContent'
import ResourceTableRowExpandableList from './ResourceTableRowExpandableList'
import constants from '../../../lib/shared/constants'
import { fliterTableAction } from '../../../lib/client/access-helper'


resources(() => {
  require('../../../scss/table.scss')
})

const translateWithId = (locale, id) => msgs.get(id, locale)

const {
  TableContainer,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow } = DataTable

export class ResourceTable extends React.Component {

  render() {
    const { locale } = this.context
    const {
      staticResourceData,
      page,
      pageSize,
      sortColumn,
      sortDirection,
      handleSort,
      totalFilteredItems,
      changeTablePage,
      handleSearch,
      searchValue,
      darkSearchBox,
      actions,
      items,
      itemIds,
      expandableTable,
      selectableTable,
      tableExpandRowAriaLabel,
      onSelect,
      onSelectAll,
      onSelectSubItem,
      listSubItems,
      placeHolderText,
      highLightRowName,
    } = this.props

    const showSearch = _.get(this.props, 'showSearch', true)
    const showPagination = _.get(this.props, 'showPagination', true)
    const id = (staticResourceData && staticResourceData.resourceKey) ? `${staticResourceData.resourceKey}-` : ''
    const firstResKeyStr = 'tableKeys[0].resourceKey'

    const PagenationComponent = showPagination ?
      (<PaginationV2
        key='pagination'
        id={`${id}resource-table-pagination`}
        onChange={changeTablePage}
        pageSize={pageSize || PAGE_SIZES.DEFAULT}
        pageSizes={PAGE_SIZES.VALUES}
        totalItems={totalFilteredItems}
        page={page}
        disabled={pageSize >= totalFilteredItems}
        isLastPage={pageSize >= totalFilteredItems}
        itemsPerPageText={msgs.get('pagination.itemsPerPage', this.context.locale)}
        pageRangeText={(current, total) => msgs.get('pagination.pageRange', [current, total], this.context.locale)}
        itemRangeText={(min, max, total) => {
          const itemRange = msgs.get('pagination.itemRange', [min, max], this.context.locale)
          const itemRangeDescription = msgs.get('pagination.itemRangeDescription', [total], this.context.locale)
          return `${itemRange} ${itemRangeDescription}`
        }
        }
        pageInputDisabled={pageSize >= totalFilteredItems} />) : null

    return [
      <DataTable
        key='data-table'
        rows={this.getRows()}
        headers={this.getHeaders()}
        translateWithId={translateWithId.bind(null, this.context.locale)}
        render={({ rows, headers, getRowProps }) => (
          <TableContainer id={`${id}table-container`}>
            {showSearch ?
              (<TableToolbar aria-label={`${id}search`} role='region'>
                <TableToolbarSearch
                  onChange={handleSearch}
                  value={searchValue}
                  aria-label={`${id}search`}
                  id={`${id}search`}
                  light={!darkSearchBox}
                  placeHolderText={placeHolderText} />
                <TableToolbarContent>
                  {actions}
                </TableToolbarContent>
              </TableToolbar>) : null
            }
            <Table className='resource-table'>
              <TableHead>
                <TableRow>
                  {expandableTable && <TableExpandHeader />}
                  {selectableTable &&
                    <th scope='col'>
                      <Checkbox
                        checked={itemIds && itemIds.filter(item => items[item] && items[item].selected).length === itemIds.length}
                        indeterminate={this.getIndeterminateStatus()}
                        id={'select-all'}
                        name={'select-all'}
                        onChange={onSelectAll}
                        data-selected={itemIds && itemIds.filter(item => items[item] && items[item].selected).length === itemIds.length}
                        labelText={''}
                        aria-label={msgs.get(itemIds.filter(item =>
                          items[item] &&
                          items[item].selected).length === itemIds.length
                          ? 'unselect'
                          : 'select', this.context.locale
                        )} />
                    </th>
                  }
                  {headers.map(header => {
                    if (header && header.header !== '') {
                      return (
                        <th scope={'col'} key={header.key}>
                          <div
                            role={'button'}
                            tabIndex={0}
                            title={msgs.get(`svg.description.${!sortColumn || sortDirection === 'desc' ? 'asc' : 'desc'}`, this.context.locale)}
                            onClick={handleSort}
                            onKeyPress={handleSort}
                            className={
                              `bx--table-sort-v2${sortDirection === 'asc'
                                ? ' bx--table-sort-v2--ascending'
                                : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`
                            }
                            data-key={header.key}
                            data-default-key={staticResourceData.defaultSortField}>
                            <span className='bx--table-header-label'>{header.header}</span>
                            { header.information &&
                            <TooltipIcon align='end' tooltipText={header.information}>
                              <svg className='info-icon'>
                                <use href={'#diagramIcons_info'} ></use>
                              </svg>
                            </TooltipIcon>
                            }
                            <Icon
                              className='bx--table-sort-v2__icon'
                              name='caret--down'
                              description={msgs.get(`svg.description.${!sortColumn || sortDirection === 'desc' ? 'asc' : 'desc'}`, this.context.locale)} />
                          </div>
                        </th>
                      )
                    } else {
                      return <th scope={'col'} key={header.key} />
                    }
                  }
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  return rows.map(row => {
                    if (expandableTable && row && row.id) {//check undefined row.id to avoid whole page crush
                      return (
                        <React.Fragment key={row.id}>
                          <TableExpandRow
                            {...getRowProps(
                              { row,
                                'data-row-name': _.get(items[row.id], _.get(staticResourceData, firstResKeyStr)),
                                'aria-hidden': expandableTable && (items[row.id] && !items[row.id].subItems || items[row.id] && items[row.id].subItems.length === 0),
                                className:
                                  (_.get(items[row.id], _.get(staticResourceData, firstResKeyStr)) === highLightRowName)
                                    ? 'high-light'
                                    : expandableTable && (items[row.id] && !items[row.id].subItems || items[row.id] && items[row.id].subItems.length === 0)
                                      ? 'row-not-expanded'
                                      : ''
                              })} ariaLabel={tableExpandRowAriaLabel ? tableExpandRowAriaLabel : 'TableExpandRow'
                            }>
                            {selectableTable &&
                              <TableCell key={`select-checkbox-${row.id}`}>
                                <Checkbox
                                  checked={items[row.id] && !!items[row.id].selected}
                                  indeterminate={
                                    items[row.id] && items[row.id].subItems && items[row.id].subItems.length > 1
                                    && items[row.id].subItems.filter(subItem => subItem.selected).length < items[row.id].subItems.length
                                    && items[row.id].subItems.filter(subItem => subItem.selected).length !== 0}
                                  id={row.id}
                                  name={`select-checkbox-row-${row.id}`}
                                  onChange={onSelect}
                                  labelText={''}
                                  aria-label={msgs.get(items[row.id] && items[row.id].selected ? 'unselect' : 'select', this.context.locale)} />
                              </TableCell>
                            }
                            {row.cells.map(cell => {
                              if (cell.id.split(':')[1] === 'metadata.name' && row.disabled) {
                                return <TableCell key={cell.id} className='policy-table-name-ctr'>
                                  <div className='policy-table-name-link'>{cell.value}</div>
                                  <div className='disabled-label'>{msgs.get('policy.disabled.label', locale)}</div>
                                </TableCell>
                              }
                              else {
                                return <TableCell key={cell.id}>{cell.value}</TableCell>
                              }
                            })}
                          </TableExpandRow>
                          {row.isExpanded && listSubItems && (
                            <TableExpandedRow>
                              <TableCell colSpan={1} />
                              <TableCell colSpan={8}>
                                <ResourceTableRowExpandableList
                                  items={items[row.id].subItems}
                                  type='name' />
                              </TableCell>
                            </TableExpandedRow>
                          )}
                          {row.isExpanded && !listSubItems && (
                            <TableExpandedRow>
                              <TableCell colSpan={selectableTable ? 2 : 1} />
                              <TableCell colSpan={1}>
                                <ResourceTableRowExpandableContent
                                  items={items[row.id].subItems}
                                  type='name'
                                  selectableTable={selectableTable}
                                  onSelectSubItem={onSelectSubItem} />
                              </TableCell>
                              <TableCell colSpan={2}>
                                <ResourceTableRowExpandableContent
                                  type='type'
                                  selectableTable={selectableTable}
                                  items={items[row.id].subItems} />
                              </TableCell>
                            </TableExpandedRow>
                          )}
                        </React.Fragment>
                      )
                    } else {
                      if(row && row.id){
                        return (
                          <TableRow
                            key={row.id}
                            data-row-name={_.get(items[row.id], _.get(staticResourceData, firstResKeyStr))}
                            className={
                              _.get(items[row.id], _.get(staticResourceData, firstResKeyStr)) === highLightRowName
                                ? 'high-light'
                                : ''
                            }
                          >
                            {row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
                          </TableRow>
                        )
                      }
                    }
                    return undefined
                  })
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />,
      PagenationComponent
    ]
  }

  getHeaders() {
    const { locale } = this.context
    const { staticResourceData, tableActions, items, itemIds } = this.props
    let headers = staticResourceData.tableKeys.filter(tableKey => {
      return tableKey.disabled
        ? typeof tableKey.disabled === 'function'
          ? tableKey.disabled(itemIds && itemIds.map(id => items[id]))
          : !tableKey.disabled
        : tableKey
    })
    headers = headers.map(tableKey => ({
      key: tableKey.resourceKey,
      header: tableKey.dropdown ? '' : msgs.get(tableKey.msgKey, locale),
      information: tableKey.information ? msgs.get(tableKey.information, locale) : ''
    }))
    tableActions && !_.isEmpty(tableActions) && headers.push({ key: 'action', header: ''})
    return headers
  }

  showTableToobar() {
    const { userRole } = this.props
    return userRole !== constants.ROLES.VIEWER
  }

  checkPolicyDisabled(data) {
    return _.get(data, 'raw.spec.disabled', false)
  }

  getRows() {
    const { history, items, itemIds, tableActions, resourceType, staticResourceData, match,
      getResourceAction, userRole, highLightRowName, autoAction, showSidePanel } = this.props
    const { locale } = this.context
    const { normalizedKey } = staticResourceData
    const localResources = itemIds &&
      itemIds.map(
        id => items[id] || (Array.isArray(items)
        && items.find(target =>  (normalizedKey && _.get(target, normalizedKey) === id) || (target.name === id)))
      )
    if (localResources && localResources.length > 0) {
      return localResources.map((item, index) => {
        const row = {}
        if (normalizedKey) {
          row.id = `${_.get(item, normalizedKey)}${_.get(item, 'cluster', '')}`
        } else {
          row.id = getSecondaryKey(resourceType)
            ? `${_.get(item, getPrimaryKey(resourceType))}-${_.get(item, getSecondaryKey(resourceType))}`
            : _.get(item, getPrimaryKey(resourceType)) || `table-row-${index}`
        }
        const menuActions = item.metadata && tableActions && tableActions[item.metadata.namespace] || tableActions

        const fliteredActions = menuActions ? fliterTableAction(menuActions,userRole,resourceType).slice(0) : null

        //This is for grc policy page highlight item auto open side panel
        if(showSidePanel && highLightRowName && autoAction
          && (item.metadata && item.metadata.name && item.metadata.name === highLightRowName)
          || (item.cluster && item.cluster === highLightRowName)){
          getResourceAction(autoAction, item, null, history, locale)
        }

        if (item.consoleURL && item.consoleURL === '-' && Array.isArray(fliteredActions)){
          const removeIndex = fliteredActions.indexOf('table.actions.launch.cluster')
          if (removeIndex > -1) {
            fliteredActions.splice(removeIndex, 1)
          }
        }

        //changes menu item based on whether policy is enabled or disabled
        row.disabled = false
        if (fliteredActions !== null && fliteredActions.length === 4 && this.checkPolicyDisabled(item)) {
          fliteredActions[fliteredActions.indexOf('table.actions.disable')] = 'table.actions.enable'
          row.disabled = true
        }

        if (fliteredActions && fliteredActions.length > 0 && this.showTableToobar()) {
          row.action = (
            <OverflowMenu floatingMenu flipped iconDescription={msgs.get('svg.description.overflowMenu', locale)} ariaLabel='Overflow-menu' tabIndex={0}>
              {fliteredActions.map((action) =>
                <OverflowMenuItem
                  data-table-action={action}
                  isDelete={
                    action ==='table.actions.remove' ||
                    action ==='table.actions.policy.remove' ||
                    action ==='table.actions.applications.remove' ||
                    action ==='table.actions.compliance.remove' ||
                    action ==='table.actions.finding.remove'
                  }
                  onClick={() => getResourceAction(action, item, null, history, locale)}
                  primaryFocus={true}
                  key={action}
                  itemText={msgs.get(action, locale)}
                />
              )}
            </OverflowMenu>
          )
        }
        staticResourceData.tableKeys.forEach(key => {
          row[key.resourceKey] = (key.link) ?
            <Link to={`${match.url}${getLink(key.link, item)}`}>{transform(item, key, locale)}</Link> :
            transform(item, key, locale)
          if (key.resourceKey === 'metadata.name' && row.disabled) {
            row[key.resourceKey] = _.get(item, key.resourceKey)
          }
          if (key.resourceKey === 'objectDefinition.metadata.name' && row[key.resourceKey] === '-') {
            row[key.resourceKey] = _.get(item, 'objectDefinition.kind')
          }
          if (key.resourceKey === 'remediation') {
            row[key.resourceKey] = msgs.get('policy.remediation.' + row[key.resourceKey], locale)
          }
        })
        return row
      })
    }
    return []
  }

  getIndeterminateStatus() {
    const { itemIds, items } = this.props
    const selectedItems = itemIds.filter(item => items[item] && items[item].selected)
    let indeterminateStatus = itemIds && selectedItems.length !== itemIds.length && selectedItems.length > 0
    selectedItems.forEach(selectedItem => {
      if (items[selectedItem].subItems && items[selectedItem].subItems.length > 0) {
        const selectedSubItems = items[selectedItem].subItems.filter(subItem => subItem.selected)
        if (selectedSubItems.length < items[selectedItem].subItems.length) {
          indeterminateStatus = true
          return indeterminateStatus
        }
      }
      return undefined
    })
    return indeterminateStatus
  }

}

ResourceTable.contextTypes = {
  locale: PropTypes.string
}

ResourceTable.propTypes = {
  actions: PropTypes.array,
  addResource: PropTypes.func,
  autoAction: PropTypes.string,
  changeTablePage: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  clientSideFilters: PropTypes.string,
  darkSearchBox: PropTypes.bool,
  deleteResource: PropTypes.func,
  err: PropTypes.object,
  expandableTable: PropTypes.bool,
  fetchResources: PropTypes.func,
  getResourceAction: PropTypes.func,
  handleCreatePolicy: PropTypes.func,
  handleSearch: PropTypes.func,
  handleSort: PropTypes.func,
  highLightRowName: PropTypes.string,
  history: PropTypes.object.isRequired,
  information: PropTypes.string,
  itemIds: PropTypes.array,
  items: PropTypes.object,
  links: PropTypes.array,
  listData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  listSubItems: PropTypes.bool,
  match: PropTypes.object,
  modifyResource: PropTypes.func,
  mutateErrorMsg: PropTypes.string,
  mutateStatus: PropTypes.string,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectSubItem: PropTypes.func,
  onSelectedFilterChange: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  placeHolderText: PropTypes.string,
  resourceFilters: PropTypes.object,
  resourceType: PropTypes.object,
  searchTable: PropTypes.func,
  searchValue: PropTypes.string,
  selectableTable: PropTypes.bool,
  selectedFilters: PropTypes.object,
  showSidePanel: PropTypes.bool,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  sortTable: PropTypes.func,
  staticResourceData: PropTypes.object,
  status: PropTypes.string,
  tableActions: PropTypes.array,
  tableExpandRowAriaLabel: PropTypes.string,
  tabs: PropTypes.array,
  title: PropTypes.string,
  topButton: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  totalFilteredItems: PropTypes.number,
  updateBrowserURL: PropTypes.func,
  updateSecondaryHeader: PropTypes.func,
  userRole: PropTypes.string,
}

const mapStateToProps = (state) => {
  const navRoutes = state.nav? (state.nav && state.nav.navItems) : state.nav
  const userRole = state.role ? state.role.role : state.role

  return { navRoutes, userRole }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const resourceType = ownProps.subResourceType || ownProps.resourceType
  return {
    getResourceAction: (action, resource, hasService, history, locale) => resourceActions(action, dispatch, resourceType, resource, hasService, history, locale)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTable))

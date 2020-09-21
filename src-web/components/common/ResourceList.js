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
import lodash from 'lodash'
// eslint-disable-next-line import/no-named-as-default
import ResourceTable from './ResourceTable'
import { REQUEST_STATUS } from '../../actions/index'
import NoResource from './NoResource'
import { connect } from 'react-redux'
import { changeTablePage, searchTable, sortTable, receiveResourceSuccess, updateSecondaryHeader } from '../../actions/common'
import { updateResourceFilters } from '../../actions/filters'
import TableHelper from '../../util/table-helper'
import { Loading, Notification } from 'carbon-components-react'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { createDocLink } from '../../components/common/CreateDocLink'
import PropTypes from 'prop-types'

const noResourceStr = 'no-resource.title'
const routesGrcStr = 'routes.grc'
const routesCreatePolicy = 'routes.create.policy'

class ResourceList extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  UNSAFE_componentWillMount() {
    const {
      updateSecondaryHeader:localUpdateSecondaryHeader,
      tabs,
      title,
      links,
      information,
      fetchResources,
      listData,
    } = this.props
    localUpdateSecondaryHeader(msgs.get(title, this.context.locale), tabs, links, msgs.get(information, this.context.locale))
    fetchResources(listData)
  }

  componentWillUnmount() {
    const { searchTable:localSearchTable } = this.props
    //clean up current page search text before leaving
    localSearchTable('', false)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((!lodash.isEqual(this.props.listData, nextProps.listData)) ||(!lodash.isEqual(this.props.resourceType, nextProps.resourceType))) {
      this.props.fetchResources(nextProps.listData, nextProps.resourceType)
    }
  }

  render() {
    const {
      items,
      itemIds,
      mutateStatus,
      mutateErrorMsg,
      page,
      pageSize,
      sortDirection,
      totalFilteredItems,
      status,
      sortTable:localSortTable,
      sortColumn,
      changeTablePage:localChangeTablePage,
      searchTable:localSearchTable,
      staticResourceData,
      searchValue,
      resourceType,
      err,
      children,
      clientSideFilters,
      placeHolderText,
      autoAction,
      highLightRowName,
      showSidePanel,
      handleCreatePolicy,
      topButton,
      filterToEmpty
    } = this.props
    const { locale } = this.context
    if (status === REQUEST_STATUS.ERROR) {
      if (err && err.data && err.data.Code === 1) {
        return (
          <NoResource
            title={msgs.get('no-cluster.title', locale)}
            detail={msgs.get('no-cluster.detail', locale)}>
            {actions}
          </NoResource>
        )
      }
      //eslint-disable-next-line no-console
      console.error(err)
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('error.default.description', locale)}
        kind='error' />
    }

    if (status !== REQUEST_STATUS.DONE){
      return <Loading withOverlay={false} className='content-spinner' />
    }

    const actions = React.Children.map(children, action => {
      //resolve console warning, seems resourceType isn't used here
      return React.cloneElement(action/*, { resourceType }*/)
    })
    if (items || searchValue || clientSideFilters) {
      if (searchValue !== clientSideFilters && clientSideFilters) {
        localSearchTable(clientSideFilters, false)
      }
      return <div>
        { mutateStatus === REQUEST_STATUS.ERROR &&
          <Notification
            title=''
            subtitle={mutateErrorMsg || msgs.get('error.default.description', locale)}
            kind='error' />
        }
        <ResourceTable
          actions={actions}
          staticResourceData={staticResourceData}
          page={page}
          pageSize={pageSize}
          itemIds={itemIds}
          sortDirection={sortDirection}
          sortColumn={sortColumn}
          status={status}
          items={items}
          expandableTable={resourceType.name === RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name}
          totalFilteredItems={totalFilteredItems}
          resourceType={resourceType}
          changeTablePage={localChangeTablePage}
          handleSort={TableHelper.handleSort.bind(this, sortDirection, sortColumn, localSortTable)}
          handleSearch={TableHelper.handleInputValue.bind(this, localSearchTable)}
          searchValue={searchValue}
          defaultSearchValue={clientSideFilters}
          tableActions={staticResourceData.tableActions}
          listSubItems={resourceType.name === RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name}
          placeHolderText={placeHolderText}
          autoAction={autoAction}
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
        />
      </div>
    }
    if (filterToEmpty) {
      return (
        <NoResource
          detail={msgs.get('no-resource.filter', locale)}
          svgName={'emptymoon.svg'}
        >
        </NoResource>
      )
    }
    switch(resourceType.name) {
    case RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION.name:
      return <NoResource
        title={msgs.get(noResourceStr, [msgs.get(routesGrcStr, locale)], locale)}
        detail={msgs.get('no-resource.detail.application', locale)}
        topButton={topButton}>
        {createDocLink(locale, handleCreatePolicy, msgs.get(routesCreatePolicy, locale), false)}
      </NoResource>
    case RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name:
      return (
        <NoResource
          title={msgs.get(noResourceStr, [msgs.get(routesGrcStr, locale)], locale)}
          detail={msgs.get('no-resource.detail.policy', locale)}>
          {createDocLink(locale, handleCreatePolicy, msgs.get(routesCreatePolicy, locale))}
        </NoResource>
      )
    case RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER.name:
      return <NoResource
        title={msgs.get(noResourceStr, [msgs.get(routesGrcStr, locale)], locale)}
        detail={msgs.get('no-resource.detail.item', locale)}
        topButton={topButton}>
        {createDocLink(locale, handleCreatePolicy, msgs.get(routesCreatePolicy, locale), false)}
      </NoResource>
    }
    const resourceName = msgs.get('no-resource.' + resourceType.name.toLowerCase(), locale)
    return (
      <NoResource
        title={msgs.get(noResourceStr, [resourceName], locale)}
        detail={msgs.get('no-resource.detail', [resourceName], locale)}>
        {actions}
      </NoResource>
    )
  }

  handleResourceAddedEvent(event) {
    this.props.addResource(event)
  }

  handleResourceModifiedEvent(event) {
    this.props.modifyResource(event)
  }

  handleResourceDeletedEvent(event) {
    this.props.deleteResource(event)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName, name: resourceName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {'storeRoot': typeListName})

  const pendingActions = state[typeListName].pendingActions
  const items = visibleResources.normalizedItems
  if (items && pendingActions){
    Object.keys(items).forEach((key) => {
      if (pendingActions.find(pending => pending.name === items[key].Name)) {
        items[key].hasPendingActions = true
      }
    })
  }

  return {
    items,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: state[typeListName].status,
    page: state[typeListName].page,
    pageSize: state[typeListName].itemsPerPage,
    sortDirection: state[typeListName].sortDirection,
    sortColumn: state[typeListName].sortColumn,
    searchValue: state[typeListName].search,
    err: state[typeListName].err,
    mutateStatus: state[typeListName].mutateStatus,
    mutateErrorMsg: state[typeListName].mutateErrorMsg,
    resourceFilters: state['resourceFilters'].filters,
    selectedFilters: state['resourceFilters'].selectedFilters && state['resourceFilters'].selectedFilters[resourceName],
  }
}

ResourceList.propTypes = {
  addResource: PropTypes.func,
  autoAction: PropTypes.string,
  changeTablePage: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  clientSideFilters: PropTypes.string,
  deleteResource: PropTypes.func,
  err: PropTypes.object,
  fetchResources: PropTypes.func,
  filterToEmpty: PropTypes.bool,
  handleCreatePolicy: PropTypes.func,
  highLightRowName: PropTypes.string,
  information: PropTypes.string,
  itemIds: PropTypes.array,
  items: PropTypes.object,
  links: PropTypes.array,
  listData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  modifyResource: PropTypes.func,
  mutateErrorMsg: PropTypes.string,
  mutateStatus: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  placeHolderText: PropTypes.string,
  resourceType: PropTypes.object,
  searchTable: PropTypes.func,
  searchValue: PropTypes.string,
  showSidePanel: PropTypes.bool,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  sortTable: PropTypes.func,
  staticResourceData: PropTypes.object,
  status: PropTypes.string,
  tabs: PropTypes.array,
  title: PropTypes.string,
  topButton: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  totalFilteredItems: PropTypes.number,
  updateSecondaryHeader: PropTypes.func,
}

//diff than original updateBrowserURL in console-ui pageWithUrlQuery
//this modified updateBrowserURL will keep flags other than text input filters
const mapDispatchToProps = (dispatch, ownProps) => {
  const { updateBrowserURL, resourceType } = ownProps
  return {
    fetchResources: (listData, nextPropsResourceType) => {
      if(nextPropsResourceType === undefined){
        nextPropsResourceType = resourceType
      }
      dispatch(receiveResourceSuccess({items: lodash.cloneDeep(listData)}, nextPropsResourceType))
    },
    changeTablePage: page => dispatch(changeTablePage(page, resourceType)),
    searchTable: (search, updateURL) => {
      if (updateURL !== false) {
        updateBrowserURL && updateBrowserURL(search)
      }
      dispatch(searchTable(search, resourceType))
    },
    sortTable: (sortDirection, sortColumn) => dispatch(sortTable(sortDirection, sortColumn, resourceType)),
    updateSecondaryHeader: (title, tabs, links, information) => dispatch(updateSecondaryHeader(title, tabs, undefined, links, '', information)),
    onSelectedFilterChange: (selectedFilters) => {
      updateBrowserURL && updateBrowserURL(selectedFilters)
      dispatch(updateResourceFilters(resourceType, selectedFilters))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))

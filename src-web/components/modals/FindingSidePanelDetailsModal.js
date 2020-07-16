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

import React from 'react'
import PropTypes from 'prop-types'
import { updateModal } from '../../actions/common'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import resources from '../../../lib/shared/resources'
import _ from 'lodash'
import { Modal, InlineNotification } from 'carbon-components-react'
import ResourceOverviewModule from '../modules/SubResourceListModule'
import getResourceDefinitions from '../../definitions'
import msgs from '../../../nls/platform.properties'
import queryString from 'query-string'
import { filterFindings } from '../../../lib/client/filter-helper'

resources(() => {
  require('../../../scss/side-panel-modal.scss')
})

function getHeader(data) {
  const kind = _.get(data, 'kind', '')
  let header = '', descr = ''
  if (kind === 'HCMSecurityFindings') {
    header = _.get(data, 'shortDescription', '')
    descr = _.get(data, '', '')
  } else if (kind === 'HCMClusterFindings') {
    header = _.get(data, 'cluster', '')
    descr = _.get(data, '', '')
  }
  return {kind, header, descr}
}

class FindingSidePanelDetailsModal extends React.PureComponent {

  constructor (props) {
    super(props)
    const { activeFilters } = props
    const showFilterInfo = Object.keys(activeFilters).length > 0
    this.state = {
      showFilterInfo : showFilterInfo,
    }
  }

  handleModalClose = () => {
    const { updateModal:localUpdateModal, location, history } = this.props
    localUpdateModal()

    //update url and refresh finding page after closing sidepanel
    //text search input filter will not be removed, which is controled by itself
    const paraURL = {}
    let op = ''
    const curentURL = queryString.parse(location.search)
    if(curentURL.index) {
      paraURL.index = curentURL.index
      op = '?'
    }
    if(curentURL.filters) {
      paraURL.filters = curentURL.filters
      op = '?'
    }
    history.push(`${location.pathname}${op}${queryString.stringify(paraURL)}`)
  }

  render(){
    const { title, data, resourceType, locale, activeFilters } = this.props
    const { kind, header, descr } = getHeader(data)
    const inapplicable = msgs.get('table.actions.inapplicable', locale)
    const showFilterInfo = this.state.showFilterInfo
    return (
      <div className={'side-panel-modal'}>
        <Modal
          passiveModal
          open={this.props.open}
          onRequestClose={this.handleModalClose}
          modalHeading={title}
          primaryButtonDisabled={true}
        >
          <div>
            <div className={'bx--modal-header special-header'}>
              {header}
              <div className={'bx--modal-content-header-content'}>
                {descr}
              </div>
            </div>
            {showFilterInfo && this.renderFilterWarning(kind, locale)}
            {this.renderTable(activeFilters, showFilterInfo, kind, data, resourceType, inapplicable, locale)}
          </div>
        </Modal>
      </div>
    )
  }

  renderTable = (activeFilters, showFilterInfo, kind, data, resourceType, inapplicable, locale) => {
    switch (kind.toLowerCase()) {
    case 'hcmsecurityfindings':
    default: {
      if (showFilterInfo) {
        //filterFindings need array type so wrap and unwrap here
        data = filterFindings([data], activeFilters, locale)
        if (Array.isArray(data) && data.length > 0) {
          data = data[0]
        }
      }
      return (
        <div className={'bx--modal-content-body'}>
          <SecurityFindingsTable singleFinding={data} type={resourceType} inapplicable={inapplicable} locale={locale} />
        </div>
      )
    }
    case 'hcmclusterfindings': {
      if (showFilterInfo && data.findingsUnderCluster) {
        data.findingsUnderCluster = filterFindings(data.findingsUnderCluster, activeFilters, locale)}
      return (
        <div className={'bx--modal-content-body'}>
          <ClusterFindingsTable items={data} type={resourceType} inapplicable={inapplicable} locale={locale} />
        </div>
      )
    }}
  }

  onClose = () => {
    this.setState(()=>{
      return {showFilterInfo: false}
    })
  }

  renderFilterWarning(kind, locale){
    return <InlineNotification
      className={`${kind}-filterInfo`}
      kind={'info'}
      title={msgs.get('tabs.sidepanel.filterWarning.title', locale)}
      subtitle={msgs.get('tabs.sidepanel.filterWarning.subtitle', locale)}
      onCloseButtonClick={this.onClose}
      iconDescription={`${kind}-filterInfo`}
      hideCloseButton={true}
    />
  }
}

const SecurityFindingsTable = ({singleFinding, type, inapplicable, locale}) => {
  //S_F_S_P = SecurityFindingsSidePanel abbreviation
  const items = _.without([
    {
      id: 'S_F_S_P_updateTime',
      key: msgs.get('table.header.update.time', locale),
      value: _.get(singleFinding, 'updateTime', inapplicable),
    },
    {
      id: 'S_F_S_P_clusterName',
      key: msgs.get('table.header.cluster.name', locale),
      value: _.get(singleFinding, 'context.clusterName', inapplicable),
    },
    {
      id: 'S_F_S_P_namespaceName',
      key: msgs.get('string.namespace', locale),
      value: _.get(singleFinding, 'context.namespaceName', inapplicable),
    },
    {
      id: 'S_F_S_P_resourceId',
      key: msgs.get('table.header.resources.id', locale),
      value: _.get(singleFinding, 'context.resourceId', inapplicable),
    },
    {
      id: 'S_F_S_P_resourceName',
      key: msgs.get('table.header.resources.name', locale),
      value: _.get(singleFinding, 'context.resourceName', inapplicable),
    },
    {
      id: 'S_F_S_P_resourceType',
      key: msgs.get('table.header.resources.type', locale),
      value: _.get(singleFinding, 'context.resourceType', inapplicable),
    },
    {
      id: 'S_F_S_P_serviceName',
      key: msgs.get('table.header.serviceName', locale),
      value: _.get(singleFinding, 'context.serviceName', inapplicable),
    },
    {
      id: 'S_F_S_P_longDescription',
      key: msgs.get('table.header.longDescription', locale),
      value: _.get(singleFinding, 'longDescription', inapplicable),
    },
    {
      id: 'S_F_S_P_providerId',
      key: msgs.get('table.header.providerId', locale),
      value: _.get(singleFinding, 'providerId', inapplicable),
    },
    {
      id: 'S_F_S_P_providerName',
      key: msgs.get('table.header.providerName', locale),
      value: _.get(singleFinding, 'providerName', inapplicable),
    },
    {
      id: 'S_F_S_P_reportedById',
      key: msgs.get('table.header.reportedById', locale),
      value: _.get(singleFinding, 'reportedBy.id', inapplicable),
    },
    {
      id: 'S_F_S_P_reportedByTitle',
      key: msgs.get('table.header.reportedByTitle', locale),
      value: _.get(singleFinding, 'reportedBy.title', inapplicable),
    },
    {
      id: 'S_F_S_P_remediation',
      key: msgs.get('table.header.remediation', locale),
      value: _.get(singleFinding, 'remediation', inapplicable),
    },
  ], undefined, null)

  const staticResourceData = getResourceDefinitions(type)
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.securityFindingSidePanel}
        items={_.compact(items)}
        listSubItems={false}
      />
    </div>
  )
}

const ClusterFindingsTable = ({items, type, inapplicable, locale}) => {
  items = _.get(items, 'findingsUnderCluster', [])
  items = items.map((finding, index) => {
    const id = _.get(finding, 'context.resourceId', 'finding'+index)
    const subItems = _.without([
      id,
      {
        subRowsArray : [
          {
            id: id+'updateTime',
            cells: [ msgs.get('table.header.update.time', locale), _.get(finding, 'updateTime', inapplicable) ]
          },
          {
            id: id+'clusterName',
            cells: [ msgs.get('table.header.cluster.name', locale), _.get(finding, 'context.clusterName', inapplicable) ]
          },
          {
            id: id+'namespaceName',
            cells: [ msgs.get('string.namespace', locale),  _.get(finding, 'context.namespaceName', inapplicable) ]
          },
          {
            id: id+'resourceId',
            cells: [ msgs.get('table.header.resources.id', locale), _.get(finding, 'context.resourceId', inapplicable) ]
          },
          {
            id: id+'resourceName',
            cells: [ msgs.get('table.header.resources.name', locale), _.get(finding, 'context.resourceName', inapplicable) ]
          },
          {
            id: id+'resourceType',
            cells: [ msgs.get('table.header.resources.type', locale), _.get(finding, 'context.resourceType', inapplicable) ]
          },
          {
            id: id+'longDescription',
            cells: [ msgs.get('table.header.longDescription', locale), _.get(finding, 'longDescription', inapplicable) ]
          },
          {
            id: id+'providerId',
            cells: [ msgs.get('table.header.providerId', locale), _.get(finding, 'providerId', inapplicable) ]
          },
          {
            id: id+'providerName',
            cells: [ msgs.get('table.header.providerName', locale), _.get(finding, 'providerName', inapplicable) ]
          },
          {
            id: id+'reportedById',
            cells: [ msgs.get('table.header.reportedById', locale), _.get(finding, 'reportedBy.id', inapplicable) ]
          },
          {
            id: id+'reportedByTitle',
            cells: [ msgs.get('table.header.reportedByTitle', locale), _.get(finding, 'reportedBy.title', inapplicable) ]
          },
          {
            id: id+'remediation',
            cells: [ msgs.get('table.header.remediation', locale), _.get(finding, 'remediation', inapplicable) ]
          },
        ]
      }
    ], undefined, null)

    return {...finding, id, subItems}
  })

  const staticResourceData = getResourceDefinitions(type)
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData.clusterFindingSidePanel}
        items={_.compact(items)}
        listSubItems={true}
      />
    </div>
  )
}

SecurityFindingsTable.propTypes = {
  inapplicable: PropTypes.string,
  locale: PropTypes.string,
  singleFinding: PropTypes.object,
  type: PropTypes.object,
}

ClusterFindingsTable.propTypes = {
  inapplicable: PropTypes.string,
  items: PropTypes.object,
  locale: PropTypes.string,
  type: PropTypes.object,
}

FindingSidePanelDetailsModal.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
  locale: PropTypes.string,
  location: PropTypes.object,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  title: PropTypes.string,
  updateModal: PropTypes.func
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return {
    modal: state.modal,
    activeFilters: activeFilters,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateModal: () => dispatch(updateModal({ open: false }))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FindingSidePanelDetailsModal))

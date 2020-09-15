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
import {AllPoliciesInCluster, AllClustersInPolicy, AllPoliciesInApplication} from '../../../lib/client/queries'
import { Query } from 'react-apollo'
import { Modal, Loading, InlineNotification } from 'carbon-components-react'
import ResourceOverviewModule from '../modules/SubResourceListModule'
import getResourceDefinitions from '../../definitions'
import msgs from '../../../nls/platform.properties'
import queryString from 'query-string'
import {GRC_SIDE_PANEL_REFRESH_INTERVAL_COOKIE} from '../../../lib/shared/constants'
import {getPollInterval} from '../../components/common/RefreshTimeSelect'
import { filterPolicies } from '../../../lib/client/filter-helper'
import _uniqueId from 'lodash/uniqueId'
import { getAge } from '../../../lib/client/resource-helper'
import { getPolicyCompliantStatus } from '../../definitions/hcm-policies-policy'
import { getClusterCompliantStatus } from '../../definitions/hcm-policies-cluster'

resources(() => {
  require('../../../scss/side-panel-modal.scss')
})

function getHeader(data, locale) {
  const kind = _.get(data, 'kind', '')
  let header = '', descr = '', percent = 0, violation, query, queryPara, hubNamespace, subHeader,type
  switch (kind) {
  case 'HCMPolicyPolicy':
  default: {
    header = _.get(data, 'raw.metadata.name', '')
    descr = _.get(data, 'raw.metadata.description', '')
    hubNamespace = _.get(data, 'namespace')
    violation = _.get(data, 'clusterCompliant', '0/0/0')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    subHeader = getPolicyCompliantStatus({clusterCompliant: data.clusterCompliant})
    type = msgs.get('overview.top.informations.clusters', locale)
    queryPara = {policy:data.name, hubNamespace:hubNamespace}
    query = AllClustersInPolicy
    break
  }
  case 'HCMPolicyCluster': {
    header = _.get(data, 'cluster', '')
    descr = _.get(data, '', '')
    violation = _.get(data, 'violation', '0/0/0')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    subHeader = getClusterCompliantStatus({violation})
    type = msgs.get('overview.top.informations.policies', locale)
    queryPara = {cluster:data.cluster}
    query = AllPoliciesInCluster
    break
  }
  case 'HCMPolicyApplication': {
    header = _.get(data, 'name', '')
    descr = _.get(data, '', '')
    percent = 1
    subHeader = _.get(data, 'violations', '0')
    type = msgs.get('overview.top.informations.policies', locale)
    queryPara = {violatedPolicies:data.violatedPolicies}
    query = AllPoliciesInApplication
    break
  }}
  return {header, subHeader, type, kind, descr, percent, query, queryPara }
}
class PolicySidePanelDetailsModal extends React.PureComponent {

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

    //update url and refresh policy page after closing sidepanel
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
    const { header, subHeader, type, kind, descr, percent, query, queryPara } = getHeader(data, locale)
    const inapplicable = msgs.get('table.actions.inapplicable', locale)
    const pollInterval = getPollInterval(GRC_SIDE_PANEL_REFRESH_INTERVAL_COOKIE, 'sidePanel')
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
              <div className={'bx--modal-content-header-main'}>
                <ProcessBar percent={percent} />
                <div className={'bx-modal-content-sub-header'}>
                  {subHeader}
                  <div className='violationType'>{type}</div>
                </div>
              </div>
            </div>
            {showFilterInfo && this.renderFilterWarning(kind, locale)}
            <div className={'bx--modal-content-body'}>
              <Query query={query} variables={queryPara} pollInterval={pollInterval}>
                {( {data:PolicySidePanelData, loading, error} ) => {
                  if (loading) {
                    // spinner if loading
                    return <Loading withOverlay={false} />
                  }
                  if (error) {
                    // return inline error
                    return (
                      <InlineNotification key={`inline-notification-${error}`}
                        kind='error' title=''
                        subtitle={error.message}
                        iconDescription={'inline-error'} />
                    )
                  }
                  const { items } = PolicySidePanelData
                  let filterSidePanelItems = []
                  const staticResourceData = getResourceDefinitions(resourceType)
                  switch (kind) {
                  case 'HCMPolicyPolicy':
                  default: {
                    if (showFilterInfo) {
                      filterSidePanelItems = filterPolicies(items, activeFilters, locale, 'metadata.annotation')}
                    else { filterSidePanelItems = items }
                    return (
                      <PoliciesTable items={filterSidePanelItems} staticResourceData={staticResourceData.policyViolatedSidePanel} inapplicable={inapplicable} />
                    )
                  }
                  case 'HCMPolicyCluster': {
                    if (showFilterInfo) {
                      filterSidePanelItems = filterPolicies(items, activeFilters, locale, 'metadata.annotations')}
                    else { filterSidePanelItems = items }
                    return (
                      <ClustersOrApplicationsTable items={filterSidePanelItems} staticResourceData={staticResourceData.clusterViolatedSidePanel} inapplicable={inapplicable} />
                    )
                  }
                  case 'HCMPolicyApplication': {
                    // current no filter for both application card and its side panel, may add future
                    return (
                      <ClustersOrApplicationsTable items={items} staticResourceData={staticResourceData.applicationViolatedSidePanel} inapplicable={inapplicable} />
                    )
                  }}
                }
                }
              </Query>
            </div>
          </div>
        </Modal>
      </div>
    )
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

export const ClustersOrApplicationsTable = ({items, staticResourceData, inapplicable}) => {
  items = items.map((item) => {
    let violatedNum = 0
    const id = _.get(items, 'metadata.name', _uniqueId('items'))
    const policiesStatusDetails = _.get(item, 'policiesStatusDetails')
    if (Array.isArray(policiesStatusDetails) && policiesStatusDetails.length > 0) {
      policiesStatusDetails.forEach((detail) => {
        if (_.get(detail, 'compliant').trim().toLowerCase() !== 'compliant') {
          violatedNum += 1
        }
      })
    }

    if(violatedNum > 0) {
      const templateStatus = policiesStatusDetails.map(detail => {
        return {
          id: _.get(detail, 'name', '-'),
          cells: [_.get(detail, 'name', '-'), _.get(detail, 'message', '-'), getAge(detail, '', 'lastTimestamp')]
        }
      })
      const subItems = [id, ...templateStatus]
      return {...item, id, violatedNum, subItems}
    }
    else {
      const subItems = [{ id: _uniqueId('inapplicable'), cells: [inapplicable, `${inapplicable} `, `${inapplicable} `] }]
      return {...item, id, violatedNum, subItems}
    }
  })

  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData}
        items={_.compact(items)}
        listSubItems={true}
      />
    </div>
  )
}

export const PoliciesTable = ({items, staticResourceData, inapplicable}) => {
  items = items.map((item) => {
    const violatedNum = _.get(item, 'violated', 0)
    const id = _.get(item, 'metadata.name', _uniqueId('item'))

    if(violatedNum > 0) {
      const policyListStatuses = _.get(item, 'policyListStatuses', [])
      const subItems = _.without([
        id,
        ...policyListStatuses.map(status => {
          if (_.get(status, 'compliant','').trim().toLowerCase() !== 'compliant') {
            const name = _.get(status, 'name', _uniqueId('name'))
            return {
              id: name,
              cells: [name, _.get(status, 'message', '-'), getAge(status, '', 'lastTimestamp')]
            }}
          return undefined
        })
      ], undefined, null)

      return {...item, id, subItems}
    }
    else {
      const subItems = [{ id: _uniqueId('inapplicable'), cells: [inapplicable, inapplicable+' ', inapplicable+'  '] }]
      return {...item, id, subItems}
    }
  })

  //Link columns with fixed title name and target direction
  const linkFixedName = {2 : {fixedName:'table.actions.launch.cluster', urlTarget:'_blank'}}
  return (
    <div className='overview-content'>
      <ResourceOverviewModule
        staticResourceData={staticResourceData}
        items={_.compact(items)}
        listSubItems={true}
        linkFixedName={linkFixedName}
      />
    </div>
  )
}

const ProcessBar = ({percent}) => {
  const width = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.4), height = 12, label = 'label', r = 6, w = width * percent
  return (
    <svg width={width} height={height} aria-label={label}>
      <rect className={'bx--modal-side-panel-process-bar-body'} width={width} height={height} rx={r} ry={r} />
      <rect className={'bx--modal-side-panel-process-bar-fill'} width={w} height={height} rx={r} ry={r} />
    </svg>
  )
}

ClustersOrApplicationsTable.propTypes = {
  inapplicable: PropTypes.string,
  items: PropTypes.array,
  staticResourceData: PropTypes.object,
}

PoliciesTable.propTypes = {
  inapplicable: PropTypes.string,
  items: PropTypes.array,
  staticResourceData: PropTypes.object,
}

ProcessBar.propTypes = {
  percent: PropTypes.number,
}

PolicySidePanelDetailsModal.propTypes = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicySidePanelDetailsModal))

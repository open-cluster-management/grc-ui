/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
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

resources(() => {
  require('../../../scss/side-panel-modal.scss')
})

const obNameStr = 'objectDefinition.metadata.name'
const sCompliantStr = 'status.Compliant'
const metaNameStr = 'metadata.name'
const sMessageStr = 'status.history[0].message'
const sReasonStr = 'status.conditions[0].reason'

function getHeader(data, locale) {
  const kind = _.get(data, 'kind', '')
  let header = '', descr = '', percent = 0, violation, query, queryPara, hubNamespace
  switch (kind) {
  case 'HCMPolicyPolicy':
  default: {
    header = _.get(data, 'raw.metadata.name', '')
    descr = _.get(data, 'raw.metadata.description', '')
    violation = _.get(data, 'clusterCompliant', '0/0')
    hubNamespace = _.get(data, 'namespace')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    violation += ' ' + msgs.get('overview.top.informations.clusters', locale)
    queryPara = {policy:data.name, hubNamespace:hubNamespace}
    query = AllClustersInPolicy
    break
  }
  case 'HCMPolicyCluster': {
    header = _.get(data, 'cluster', '')
    descr = _.get(data, '', '')
    violation = _.get(data, 'violation', '0/0')
    const [vioNum, totalNum] = violation.split('/')
    if (!isNaN(vioNum) && !isNaN(totalNum)) {
      percent = +vioNum / +totalNum
    }
    violation += ' ' + msgs.get('overview.top.informations.policies', locale)
    queryPara = {cluster:data.cluster}
    query = AllPoliciesInCluster
    break
  }
  case 'HCMPolicyApplication': {
    header = _.get(data, 'name', '')
    descr = _.get(data, '', '')
    violation = _.get(data, 'violations', '0')
    percent = 1
    violation += ' ' + msgs.get('overview.top.informations.policies', locale)
    queryPara = {violatedPolicies:data.violatedPolicies}
    query = AllPoliciesInApplication
    break
  }}
  return {header, kind, descr, percent, violation, query, queryPara}
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
    const { header, kind, descr, percent, violation, query, queryPara } = getHeader(data, locale)
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
                <div className={'bx-modal-content-sub-header'}>{`${violation}`}</div>
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
                      filterSidePanelItems = filterPolicies(items, activeFilters, locale, 'policy.metadata.annotations')}
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

const getFirstMatch = (item, targetList) => {
  //find first not null item in target list and return
  const target = targetList.find(eachTarget => _.get(item, eachTarget))
  return target ? _.get(item, target) : '-'
}

export const ClustersOrApplicationsTable = ({items, staticResourceData, inapplicable}) => {
  items = items.map((policy, index) => {
    let violatedNum = 0
    const id = _.get(policy, metaNameStr, `policy${index}`)
    const details = _.get(policy, 'raw.status.details', '')
    if (Array.isArray(details) && details.length > 0) {
      details.forEach((detail) => {
        if (_.get(detail, 'compliant','').toLowerCase() !== 'compliant') {
          violatedNum += 1
        }
      })
    }

    if(violatedNum > 0) {
      const templateStatus = details.map(detail => {
        return {
          id: _.get(detail, 'templateMeta.name', '-'),
          cells: [_.get(detail, 'templateMeta.name', '-'), _.get(detail, 'history[0].message', '-'), _.get(detail, 'history[0].lastTimestamp', '-'),]
        }
      })
      //add id and remove null/undefined
      const subItems = _.without([id, ...templateStatus], undefined, null)
      return {...policy, id, violatedNum, subItems}
    }
    else {
      const subItems = [{ id: `inapplicable${index}`, cells: [inapplicable, `${inapplicable} `, `${inapplicable} `] }]
      return {...policy, id, violatedNum, subItems}
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
  items = items.map((cluster, index) => {
    const policy = _.get(cluster, 'policy', [])
    const violatedNum = _.get(cluster, 'violated', 0)
    const id = _.get(cluster, metaNameStr, `cluster${index}`)

    if(violatedNum > 0) {
      const spec = _.get(policy, 'spec', '')
      const objectTemplates = _.get(spec, 'object-templates', [])
      const roleTemplates = _.get(spec, 'role-templates', [])
      const policyTemplates = _.get(spec, 'policy-templates', [])
      const targetList = [obNameStr, 'objectDefinition.kind', metaNameStr]
      const subItems = _.without([
        id,
        ...objectTemplates.map(item => {
          if (_.get(item, sCompliantStr,'').toLowerCase() !== 'compliant') {
            const name = getFirstMatch(item, targetList)
            return {
              id: _.get(item, obNameStr),
              cells: [name, _.get(item, sMessageStr, '-'), _.get(item, sReasonStr, '-')]
            }}
          return undefined
        }
        ),
        ...roleTemplates.map(item => {
          if (_.get(item, sCompliantStr,'').toLowerCase() !== 'compliant') {
            const name = getFirstMatch(item, targetList)
            return {
              id: _.get(item, obNameStr),
              cells: [name, _.get(item, sMessageStr, '-'), _.get(item, sReasonStr, '-')]
            }}
          return undefined
        }
        ),
        ...policyTemplates.map(item => {
          if (_.get(item, sCompliantStr,'').toLowerCase() !== 'compliant') {
            const name = getFirstMatch(item, targetList)
            return {
              id: _.get(item, obNameStr),
              cells: [name, _.get(item, sMessageStr, '-'), _.get(item, sReasonStr, '-')]
            }}
          return undefined
        }
        )
      ], undefined, null)

      return {...cluster, id, subItems}
    }
    else {
      const subItems = [{ id: `inapplicable${index}`, cells: [inapplicable, inapplicable+' ', inapplicable+'  '] }]
      return {...cluster, id, subItems}
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

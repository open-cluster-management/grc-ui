/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import { ContentSwitcher, Switch } from 'carbon-components-react'
import getResourceDefinitions from '../../definitions'
import { makeGetVisibleTableItemsSelector } from '../../reducers/common'
import ResourceList from '../common/ResourceList'
import { formatPoliciesToClustersTableData, formatFindingsToClustersTableData, formatExpandablePolicies, formatApplicationTableData } from '../common/FormatTableData'
import pageWithUrlQuery from '../common/withUrlQuery'
import queryString from 'query-string'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/module-grc-toggle.scss')
})

export class GrcToggleModule extends React.Component {

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.toggleClick = this.toggleClick.bind(this)
  }

  render() {
    const { locale } = this.context
    const { displayType, grcItems, applications, secondaryHeaderProps, showGrcTabToggle, grcTabToggleIndex, highLightRowName, showSidePanel, handleCreatePolicy, filterToEmpty } = this.props
    const grcTabSwitcher = showGrcTabToggle ? this.renderTabSwitcher(displayType, grcTabToggleIndex) : []
    let detailsTabs, resourceType, listData, staticResourceData, getVisibleResources, placeHolderText, autoAction
    switch (displayType) {
    case 'all':
    default:
      switch (grcTabToggleIndex){
      case 0:
      default:
        detailsTabs = ['policies']
        resourceType = RESOURCE_TYPES.HCM_POLICIES_PER_POLICY
        listData = formatExpandablePolicies(grcItems)
        staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_POLICIES_PER_POLICY)
        getVisibleResources = makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_POLICIES_PER_POLICY)
        placeHolderText = msgs.get('tabs.grc.toggle.allPolicies.placeHolderText', locale)
        autoAction = 'table.actions.policy.sidepanel'
        break
      case 1:
        detailsTabs = ['clusters']
        resourceType = RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER
        listData = formatPoliciesToClustersTableData(grcItems)
        staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER)
        getVisibleResources = makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER)
        placeHolderText = msgs.get('tabs.grc.toggle.clusterViolations.placeHolderText', locale)
        autoAction = 'table.actions.policy.sidepanel'
        break
      case 2:
        detailsTabs = ['applications']
        resourceType = RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION
        listData = formatApplicationTableData(applications)
        staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION)
        getVisibleResources = makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION)
        placeHolderText = msgs.get('tabs.grc.toggle.applications.placeHolderText', locale)
        autoAction = 'table.actions.policy.sidepanel'
        break
      }
      break
    case 'findings':
      switch (grcTabToggleIndex){
      case 0:
      default:
        detailsTabs = ['findings']
        resourceType = RESOURCE_TYPES.HCM_SECURITY_FINDINGS
        listData = grcItems
        staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_SECURITY_FINDINGS)
        getVisibleResources = makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_SECURITY_FINDINGS)
        placeHolderText = msgs.get('tabs.grc.toggle.securityFindings.placeHolderText', locale)
        autoAction = 'table.actions.finding.sidepanel'
        break
      case 1:
        detailsTabs = ['cluster-findings']
        resourceType = RESOURCE_TYPES.HCM_CLUSTER_FINDINGS
        listData = formatFindingsToClustersTableData(grcItems)
        staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_CLUSTER_FINDINGS)
        getVisibleResources = makeGetVisibleTableItemsSelector(RESOURCE_TYPES.HCM_CLUSTER_FINDINGS)
        placeHolderText = msgs.get('tabs.grc.toggle.clusterFindings.placeHolderText', locale)
        autoAction = 'table.actions.finding.sidepanel'
        break
      }
      break
    }

    return (
      <div className='module-toggle-tab'>
        <ResourceList
          {...this.props}
          detailsTabs={detailsTabs}
          filterToEmpty={filterToEmpty}
          resourceType={resourceType}
          listData={listData}
          staticResourceData={staticResourceData}
          getVisibleResources={getVisibleResources}
          tabs={secondaryHeaderProps.tabs}
          links={secondaryHeaderProps.links}
          title={secondaryHeaderProps.title}
          information={secondaryHeaderProps.information}
          placeHolderText={placeHolderText}
          autoAction={autoAction}
          highLightRowName={highLightRowName}
          showSidePanel={showSidePanel}
          handleCreatePolicy={handleCreatePolicy}
          topButton={grcTabSwitcher}>
          {grcTabSwitcher}
        </ResourceList>
      </div>
    )
  }

  renderTabSwitcher(displayType, grcTabToggleIndex) {
    const { locale } = this.context
    const { showApplications } = this.props
    let toggleText1, toggleText2, toggleText3
    switch(displayType) {
    case 'all':
    default:
      toggleText1 = msgs.get('tabs.grc.toggle.allPolicies', locale)
      toggleText2 = msgs.get('tabs.grc.toggle.clusterViolations', locale)
      toggleText3 = msgs.get('tabs.grc.toggle.policiesApplications', locale)
      break
    case 'findings':
      toggleText1 = msgs.get('tabs.grc.toggle.securityFindings', locale)
      toggleText2 = msgs.get('tabs.grc.toggle.clusterFindings', locale)
      break
    }
    return (
      <div className='module-toggle-tab-switch-strip'>
        <div className='module-toggle-tab-switch-makeup'>
        </div>
        <div className='module-toggle-tab-switch'>
          {displayType==='all' && showApplications && <ContentSwitcher onChange={this.onChange} selectedIndex={grcTabToggleIndex}>
            <Switch text={toggleText1} onClick={this.toggleClick} />
            <Switch text={toggleText2} onClick={this.toggleClick} />
            <Switch text={toggleText3} onClick={this.toggleClick} />
          </ContentSwitcher>}
          {displayType==='all' && !showApplications && <ContentSwitcher onChange={this.onChange} selectedIndex={grcTabToggleIndex}>
            <Switch text={toggleText1} onClick={this.toggleClick} />
            <Switch text={toggleText2} onClick={this.toggleClick} />
          </ContentSwitcher>}
          {displayType==='findings' && <ContentSwitcher onChange={this.onChange} selectedIndex={grcTabToggleIndex}>
            <Switch text={toggleText1} onClick={this.toggleClick} />
            <Switch text={toggleText2} onClick={this.toggleClick} />
          </ContentSwitcher>}
        </div>
      </div>
    )
  }

  onChange() {
    //current do nothing, just required by carbon ContentSwitcher otherwise error
  }

  toggleClick({...props}) {
    const {history, location} = this.props
    const paraURL = queryString.parse(location.search)
    paraURL.index = props.index
    const paraURLString = queryString.stringify(paraURL)
    const op = paraURLString && paraURLString.length > 0 ? '?' : ''
    history.push(`${location.pathname}${op}${paraURLString}`)
    return `${location.pathname}${op}${paraURLString}`
  }
}

GrcToggleModule.propTypes = {
  applications: PropTypes.array,
  displayType: PropTypes.string,
  filterToEmpty: PropTypes.bool,
  grcItems: PropTypes.array,
  grcTabToggleIndex: PropTypes.number,
  handleCreatePolicy: PropTypes.func,
  highLightRowName: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object,
  secondaryHeaderProps: PropTypes.object,
  showApplications: PropTypes.bool,
  showGrcTabToggle: PropTypes.bool,
  showSidePanel: PropTypes.bool,
}

export default withRouter(pageWithUrlQuery(GrcToggleModule))

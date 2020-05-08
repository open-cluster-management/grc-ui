/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 /* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateResourceToolbar, updateActiveFilters } from '../actions/common'
import { Loading, Notification } from 'carbon-components-react'
import { filterPolicies, filterFindings, getAvailableGrcFilters, getSavedGrcState, saveGrcState, combineResourceFilters,replaceGrcState } from '../../lib/client/filter-helper'
import { showResourceToolbar, hideResourceToolbar } from '../../lib/client/resource-helper'
import { GRC_VIEW_STATE_COOKIE, GRC_FILTER_STATE_COOKIE } from '../../lib/shared/constants'
import RecentActivityModule from './modules/RecentActivityModule'
import RecentActivityModuleWithoutFindings from './modules/RecentActivityModuleWithoutFindings'
import ImpactedControlsModule from './modules/ImpactedControlsModule'
import PolicySummaryModule from './modules/PolicySummaryModule'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'
import NoResource from '../components/common/NoResource'
import ResourceFilterBar from '../components/common/ResourceFilterBar'
import createDocLink from '../components/common/CreateDocLink'
import queryString from 'query-string'

export class OverviewView extends React.Component {

  constructor (props) {
    super(props)
    this.state= {
      viewState: getSavedGrcState(GRC_VIEW_STATE_COOKIE)
    }
    this.scroll = _.debounce(()=>{
      this.scrollView()
    }, 50)
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.updateViewState = this.updateViewState.bind(this)
    this.handleCreatePolicy = this.handleCreatePolicy.bind(this)
    this.handleDrillDownClickOverview = this.handleDrillDownClickOverview.bind(this)
  }

  componentWillMount() {
    const { activeFilters={} } = this.props
    //get (activeFilters ∪ storedFilters) only since availableGrcFilters is uninitialized at this stage
    //later when availableGrcFilters initialized, will do further filtering in componentWillReceiveProps
    const combinedFilters = combineResourceFilters(activeFilters, getSavedGrcState(GRC_FILTER_STATE_COOKIE))
    delete combinedFilters.severity//remove severity filter set during first time render
    //update sessionStorage
    replaceGrcState(GRC_FILTER_STATE_COOKIE, combinedFilters)
    //update active filters
    updateActiveFilters(combinedFilters)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scroll)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
    window.removeEventListener('scroll', this.scroll)
    this.onUnload()
  }

  componentWillReceiveProps(nextProps) {
    const {refreshControl, policies, findings, updateActiveFilters, updateResourceToolbar} = nextProps
    if (!_.isEqual(refreshControl, this.props.refreshControl) ||
        !_.isEqual(policies, this.props.policies)) {
      const { locale } = this.context
      const availableGrcFilters = getAvailableGrcFilters(policies, findings, locale)
      updateResourceToolbar(refreshControl, availableGrcFilters)
      const activeFilters = _.cloneDeep(nextProps.activeFilters||{})
      //get (activeFilters ∪ storedFilters) ∩ availableGrcFilters
      const combinedFilters = combineResourceFilters(activeFilters, getSavedGrcState(GRC_FILTER_STATE_COOKIE), availableGrcFilters)
      //update sessionStorage
      replaceGrcState(GRC_FILTER_STATE_COOKIE, combinedFilters)
      //update active filters
      updateActiveFilters(combinedFilters)
    }
  }

  render() {
    const { locale } = this.context
    const showFindings = config['feature_security-findings']
    const { loading, error, policies, findings, applications, activeFilters={} } = this.props
    hideResourceToolbar()

    if (loading) {
      return <Loading withOverlay={false} className='content-spinner' />
    }

    if (error) {
      if (error.name === 'PermissionError') {
        return <Notification title='' className='overview-notification' kind='error'
          subtitle={msgs.get('error.permission.denied', locale)} />
      }
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />
    }

    if ((!policies || policies.length === 0) && !loading) {
      return (
        <NoResource
          title={msgs.get('no-resource.title', [msgs.get('routes.grc', locale)], locale)}
          detail={msgs.get('no-resource.detail.policy', locale)}>
          {createDocLink(locale, this.handleCreatePolicy, msgs.get('routes.create.policy', locale))}
        </NoResource>
      )
    }
    showResourceToolbar()
    const { viewState } = this.state
    const showApplications = this.props.showApplications
    const availableFilters =  getAvailableGrcFilters(policies, findings, locale)
    const filteredPolicies = filterPolicies(policies, activeFilters, locale, 'metadata.annotations')
    const filteredFindings = filterFindings(findings, activeFilters, locale)
    //need to filteredapplications later?
    if(showFindings === false) {
      return (
        <div className='overview-view'>
          <ResourceFilterBar />
          <RecentActivityModuleWithoutFindings
            showApplications={showApplications}
            policies={filteredPolicies}
            showFindings={showFindings}
            findings={filteredFindings}
            applications={applications}
            handleDrillDownClick={this.handleDrillDownClickOverview}
            viewState={viewState}
            updateViewState={this.updateViewState} />
          <ImpactedControlsModule
            viewState={viewState}
            updateViewState={this.updateViewState}
            policies={filteredPolicies}
            showFindings={showFindings}
            findings={filteredFindings}
            activeFilters={activeFilters}
            availableFilters={availableFilters}
            handleDrillDownClick={this.handleDrillDownClickOverview} />
          <PolicySummaryModule
            policies={filteredPolicies}
            findings={filteredFindings} />
        </div>
      )
    }
    else {
      return (
        <div className='overview-view'>
          <ResourceFilterBar />
          <RecentActivityModule
            showApplications={showApplications}
            policies={filteredPolicies}
            showFindings={showFindings}
            findings={filteredFindings}
            applications={applications}
            handleDrillDownClick={this.handleDrillDownClickOverview}
            viewState={viewState}
            updateViewState={this.updateViewState} />
          <ImpactedControlsModule
            viewState={viewState}
            updateViewState={this.updateViewState}
            policies={filteredPolicies}
            showFindings={showFindings}
            findings={filteredFindings}
            activeFilters={activeFilters}
            availableFilters={availableFilters}
            handleDrillDownClick={this.handleDrillDownClickOverview} />
          <PolicySummaryModule
            policies={filteredPolicies}
            findings={filteredFindings} />
        </div>
      )
    }
  }

  updateViewState(states) {
    this.setState(prevState=>{
      return {viewState:  Object.assign(prevState.viewState, states)}
    })
  }

  onUnload() {//saved overview ui setting
    saveGrcState(GRC_VIEW_STATE_COOKIE, this.state.viewState)
  }

  scrollView () {
    const headerRef = document.getElementsByClassName('secondary-header')[0]
    const contentRef = document.getElementsByClassName('overview-view')[0]
    if (headerRef && contentRef) {
      const contentRect = contentRef.getBoundingClientRect()
      headerRef.classList.toggle('bottom-border', contentRect.top<180)
    }
  }

  handleCreatePolicy(){
    this.props.history.push(`${config.contextPath}/create`)
  }

  handleDrillDownClickOverview(parentType, parentName){
    if(parentType){
      let page = 'all'
      const paraURL = {}
      switch(parentType.toLowerCase()){
      case 'policy violations'://RecentActivityModule to policies page, all policy violations
        paraURL.index = 0
        paraURL.autoFocus = 'module-toggle-tab'
        break
      case 'cluster violations'://RecentActivityModule to policies page, all cluster violations
        paraURL.index = 1
        paraURL.autoFocus = 'module-toggle-tab'
        break
      case 'high'://RecentActivityModule to security findings page, all high severity findings
      case 'medium'://all medium severity findings
      case 'low'://all low severity findings
        page = 'findings'
        paraURL.index = 0
        paraURL.autoFocus = 'module-toggle-tab'
        paraURL.severity = _.startCase(parentType.toLowerCase())
        break
      case 'policies'://TopInformationModule to policies page with specific policy violation name
        paraURL.index = 0
        paraURL.autoFocus = 'module-toggle-tab'
        if(parentName){
          // paraURL.name = parentName //highlight this policy violation name
          // paraURL.side = true //auto open side panel under this highlight name
          paraURL.filters = `{"textsearch":["${parentName}"]}`
        }
        break
      case 'clusters'://TopInformationModule to policies page with specific cluster violation name
        paraURL.index = 1
        paraURL.autoFocus = 'module-toggle-tab'
        if(parentName){
          // paraURL.name = parentName //highlight this cluster violation name
          // paraURL.side = true //auto open side panel under this highlight name
          paraURL.filters = `{"textsearch":["${parentName}"]}`
        }
        break
      case 'applications':
        paraURL.index = 2
        paraURL.autoFocus = 'module-toggle-tab'
        if(parentName){
          paraURL.filters = `{"textsearch":["${parentName}"]}`
        }
        break
      case 'security findings'://TopInformationModule to security findings page with specific security finding name
        page = 'findings'
        paraURL.index = 0
        paraURL.autoFocus = 'module-toggle-tab'
        if(parentName){
          paraURL.filters = `{"textsearch":["${parentName}"]}` //current no highlight and side panel for security findings page, just filter name
        }
        break
      case 'finding clusters'://TopInformationModule to security findings page with specific finding cluster name
        page = 'findings'
        paraURL.index = 1
        paraURL.autoFocus = 'module-toggle-tab'
        if(parentName){
          paraURL.filters = `{"textsearch":["${parentName}"]}` //current no highlight and side panel for finding clusters page, just filter name
        }
        break
      default:
        break
      }
      const slash = this.props.location.pathname.trim().substr(-1) === '/' ? '' : '/'
      if (this.props.history) {
        this.props.history.push(`${this.props.location.pathname}${slash}${page}?${queryString.stringify(paraURL)}`)
      }
      return `${slash}${page}?${queryString.stringify(paraURL)}`
    }
  }
}

OverviewView.propTypes = {
  activeFilters: PropTypes.object,
  applications: PropTypes.array,
  error: PropTypes.object,
  findings: PropTypes.array,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  location: PropTypes.object,
  policies: PropTypes.array,
  refreshControl: PropTypes.object,
  showApplications: PropTypes.bool,
  updateActiveFilters: PropTypes.func,
  updateResourceToolbar: PropTypes.func,
}

const mapStateToProps = (state) => {
  const {resourceToolbar: {activeFilters}} = state
  return { activeFilters }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateResourceToolbar: (refreshControl, availableFilters) => dispatch(updateResourceToolbar(refreshControl, availableFilters)),
    updateActiveFilters: (activeFilters) => dispatch(updateActiveFilters(activeFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewView))

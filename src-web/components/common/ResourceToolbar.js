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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import resources from '../../../lib/shared/resources'
import { updateActiveFilters } from '../../actions/common'
import RefreshTimeSelect from './RefreshTimeSelect'
import ResourceFilterView from './ResourceFilterView'
import { CSSTransition } from 'react-transition-group'
import { Loading } from 'carbon-components-react'
import { REFRESH_TIMES, GRC_FILTER_STATE_COOKIE } from '../../../lib/shared/constants'
import '../../../graphics/diagramIcons.svg'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { replaceGrcState } from '../../../lib/client/filter-helper'

resources(() => {
  require('../../../scss/resource-toolbar.scss')
})

const RefreshTime = ({ reloading, timestamp, locale }) => {
  const time = new Date(timestamp).toLocaleTimeString(locale)
  const lastUpdate = msgs.get('overview.menu.last.update', [time], locale)
  return (
    <div className='refresh-time-container'>
      {reloading ?<Loading withOverlay={false} small /> : null }
      <div>{lastUpdate}</div>
    </div>
  )
}

RefreshTime.propTypes = {
  locale: PropTypes.string,
  reloading: PropTypes.bool,
  timestamp: PropTypes.string,
}

export class ResourceToolbar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      filterViewOpen: props.filterViewOpen,
    }
    this.handleFilterClose = this.handleFilterClose.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.toggleFilterModel = this.toggleFilterModel.bind(this)
    this.toggleFilterModelPress = this.toggleFilterModelPress.bind(this)
  }

  render() {
    const { locale } = this.context
    const { availableFilters={}, activeFilters={}, refreshControl={}, location } = this.props
    if (Object.keys(refreshControl).length===0) {
      return null
    }
    const { reloading, timestamp } = refreshControl
    const { filterViewOpen } = this.state
    return (
      <div id='resource-toolbar' className='resource-toolbar'>
        <div className='resource-toolbar-container' >
          <div className='resource-toolbar-buttons' >
            {/* refresh time button */}
            <RefreshTimeSelect
              locale = {locale}
              refreshValues = {REFRESH_TIMES}
              refreshControl = {refreshControl}
            />
            {/* filter results button, not dispalyed in details page */}
            {
              (location.pathname.startsWith('/multicloud/policies/all/') || location.pathname.startsWith('/multicloud/policies/policy/'))
                ? null
                : <div className='resource-filter-button' tabIndex={0} role={'button'}
                  onClick={this.toggleFilterModel} onKeyPress={this.toggleFilterModelPress}>
                  <svg className='button-icon'>
                    <use href={'#diagramIcons_filter'} ></use>
                  </svg>
                  <div className='button-label'>
                    {msgs.get('overview.menu.filter', locale)}
                  </div>
                </div>
            }
          </div>
          {timestamp&&<RefreshTime timestamp={timestamp} reloading={reloading} />}
        </div>
        <CSSTransition
          in={filterViewOpen}
          timeout={300}
          classNames="transition"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <ResourceFilterView
            updateFilters={this.updateFilters}
            onClose={this.handleFilterClose}
            activeFilters={activeFilters}
            availableFilters={availableFilters}
          />
        </CSSTransition>
      </div>)
  }

  toggleFilterModel() {
    this.setState(({filterViewOpen})=>{
      return { filterViewOpen: !filterViewOpen }
    })
  }

  toggleFilterModelPress(e) {
    if ( e.key === 'Enter') {
      this.toggleFilterModel()
    }
  }

  handleFilterClose = () => {
    this.setState({ filterViewOpen: false })
  }

  updateFilters = (key, value, checked) => {
    this.updateActiveFilter(key, value, checked)
  }

  updateActiveFilter = (key, value, checked) => {
    const {updateActiveFilters} = this.props
    const activeFilters = _.cloneDeep(this.props.activeFilters||{})
    let activeSet = activeFilters[key]
    if (!activeSet) {
      activeSet = activeFilters[key] = new Set()
    }
    if (value==='all') {
      activeSet.clear()
    } else {
      if (checked) {
        activeSet.add(value)
      } else {
        activeSet.delete(value)
      }
    }
    replaceGrcState(GRC_FILTER_STATE_COOKIE, activeFilters)
    updateActiveFilters(activeFilters)
  }
}

ResourceToolbar.propTypes = {
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.object,
  filterViewOpen: PropTypes.bool,
  location: PropTypes.object,
  refreshControl: PropTypes.object,
  updateActiveFilters: PropTypes.func,
}


const mapStateToProps = (state) => {
  const {resourceToolbar: {availableFilters, activeFilters, refreshControl}} = state
  return { availableFilters, activeFilters, refreshControl }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActiveFilters: (activeFilters) => dispatch(updateActiveFilters(activeFilters))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceToolbar))

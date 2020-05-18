/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import { DropdownV2, Loading } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import { DEFAULT_REFRESH_TIME, DEFAULT_SIDE_PANEL_REFRESH_TIME } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'


resources(() => {
  require('../../../scss/refresh-time-select.scss')
})

export default class RefreshTimeSelect extends React.Component {

  static propTypes = {
    refreshControl: PropTypes.object,
    refreshValues: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { refreshControl: {refreshCookie} } = props
    this.state = {
      pollInterval: getPollInterval(refreshCookie),
    }
    this.setRefresh = this.setRefresh.bind(this)
    this.handleChange = this.handleChange.bind(this)
    const { locale } = this.context
    const { refreshValues=[] } = this.props
    this.autoRefreshChoices = refreshValues.map(pollInterval=>{
      let label
      if (pollInterval>=60) {
        label = msgs.get('refresh.interval.minutes', [pollInterval/60], locale)
      } else if (pollInterval!==0) {
        label = msgs.get('refresh.interval.seconds', [pollInterval], locale)
      } else {
        label = msgs.get('refresh.interval.never', locale)
      }
      pollInterval*=1000
      return {label, pollInterval}
    })
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState((prevState, props) => {
      const {refreshControl: {refreshCookie}} = props
      return {pollInterval: getPollInterval(refreshCookie)}
    })
  }

  handleClick = () => {
    const {refreshControl: {refetch}} = this.props
    refetch()
  }

  handleKeyPress(e) {
    if ( e.key === 'Enter') {
      const {refreshControl: {refetch}} = this.props
      refetch()
    }
  }


  handleChange = (e) => {
    const {selectedItem: {pollInterval}} = e
    const {refreshControl: {refreshCookie, startPolling, stopPolling}} = this.props
    if (pollInterval===0) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
    savePollInterval(refreshCookie, pollInterval)
    this.setState({ pollInterval })
  }

  render() {
    const { locale } = this.context
    const { pollInterval } = this.state
    if (pollInterval!==undefined) {
      const refresh = msgs.get('refresh', this.context.locale)
      const {refreshControl: {reloading}} = this.props
      const label = msgs.get('choose.refresh', locale)
      const idx = Math.max(0, this.autoRefreshChoices.findIndex(({pollInterval:pi})=>{
        return pollInterval===pi
      }))

      return (
        <div className='refresh-time-selection' ref={this.setRefresh}>
          {reloading?
            <Loading withOverlay={false} small /> :
            <div className='button' tabIndex={0} role={'button'}
              title={refresh} aria-label={refresh}
              onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
              <svg className='button-icon'>
                <use href={'#diagramIcons_autoRefresh'} ></use>
              </svg>
            </div>}
          <DropdownV2 className='selection'
            label={label}
            ariaLabel={label}
            onChange={this.handleChange}
            inline={true}
            initialSelectedItem={this.autoRefreshChoices[idx]}
            items={this.autoRefreshChoices} />
        </div>
      )
    }
    return null
  }

  setRefresh = ref => {
    this.refreshRef = ref
    this.fixTooltip()
  }

  componentDidUpdate() {
    this.fixTooltip()
  }

  // tooltip on dropdown is hardcoded
  fixTooltip = () => {
    if (this.refreshRef) {
      const title = this.refreshRef.querySelector('title')
      if (title) {
        title.innerHTML = msgs.get('choose.refresh', this.context.locale)
      }
    }
  }
}

export const getPollInterval = (cookieKey, displayType) => {
  let pollInterval = (displayType && displayType === 'sidePanel') ? DEFAULT_SIDE_PANEL_REFRESH_TIME*1000 : DEFAULT_REFRESH_TIME*1000
  if (cookieKey) {
    const savedInterval = localStorage.getItem(cookieKey)
    if (savedInterval) {
      try {
        const saved = JSON.parse(savedInterval)
        if (saved.pollInterval !== undefined) {
          pollInterval = saved.pollInterval
        }
      } catch (e) {
        //
      }
    } else {
      savePollInterval(cookieKey, pollInterval)
    }
  }
  return pollInterval
}

export const savePollInterval = (cookieKey, pollInterval) => {
  localStorage.setItem(cookieKey, JSON.stringify({pollInterval}))
}

export const getTimeAgoMsg = (msgKey, startTime, endTime, locale) => {
  let ago = ''
  const seconds = Math.abs(moment(new Date(startTime)).diff(new Date(endTime))) / 1000
  let interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    ago = msgs.get('time.days.ago', [interval], locale)
  } else {
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      ago = msgs.get('time.hours.ago', [interval], locale)
    } else {
      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        ago = msgs.get('time.minutes.ago', [interval], locale)
      } else if (seconds>1) {
        ago = msgs.get('time.seconds.ago', [seconds], locale)
      } else {
        ago = msgs.get('time.just.now', locale)
      }
    }
  }
  return msgs.get(msgKey, [ago], locale)
}


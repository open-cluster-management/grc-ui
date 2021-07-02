/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */


'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class TableTimestamp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      now: Date.now()
    }
  }
  componentDidMount() {
    // refresh the timestamp calculation every 30 seconds
    this.interval = setInterval(() => this.setState({ now: Date.now()}), 30000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    const { timestamp } = this.props
    const { now } = this.state
    let fromNow = 'unknown'
    if (timestamp && timestamp.includes('T')) {
      fromNow = moment(timestamp, 'YYYY-MM-DDTHH:mm:ssZ').from(now)
    } else if (timestamp) {
      fromNow = moment(timestamp, 'YYYY-MM-DD HH:mm:ss').from(now)
    }
    return <span>{fromNow}</span>
  }
}

TableTimestamp.propTypes = {
  timestamp: PropTypes.string,
}

export default TableTimestamp

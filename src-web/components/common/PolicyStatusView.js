/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
// import {
//   Title,
// } from '@patternfly/react-core'
import PatternFlyTable from './PatternFlyTable'
import { LocaleContext } from './LocaleContext'
import statusDef from '../../tableDefinitions/statusDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'

class PolicyStatusView extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  render() {
    const { status } = this.props
    const { locale } = this.context
    const tableData = transform(status, statusDef, locale)
    return (
      <div className='policy-status-view'>
        <div className='table'>
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
        </div>
      </div>
    )
  }
}

PolicyStatusView.propTypes = {
  status: PropTypes.array,
}

export default PolicyStatusView

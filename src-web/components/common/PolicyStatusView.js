/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
} from '@patternfly/react-core'
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
    const { history, cluster, template } = this.props
    const { locale } = this.context

    const tableData = transform(history, statusDef, locale)

    return (
      <div className='policy-status-view'>
        <div className='table'>
          <Title className='title' headingLevel="h3">{cluster}</Title>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${template}`}</Title>
          <br></br>
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
        </div>
      </div>
    )
  }
}

PolicyStatusView.propTypes = {
  cluster: PropTypes.string,
  history: PropTypes.array,
  template: PropTypes.string
}

export default PolicyStatusView

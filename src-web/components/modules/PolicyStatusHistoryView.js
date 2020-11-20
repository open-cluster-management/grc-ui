/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
} from '@patternfly/react-core'
import PatternFlyTable from '../common/PatternFlyTable'
import { LocaleContext } from '../common/LocaleContext'
import statusHistoryDef from '../../tableDefinitions/statusHistoryDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { GRC_SEARCH_STATE_COOKIE } from '../../../lib/shared/constants'
import {
  getSavedGrcState, saveGrcStatePair
} from '../../../lib/client/filter-helper'

const componentName = 'PolicyStatusHistoryView'
class PolicyStatusHistoryView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue : _.get(getSavedGrcState(GRC_SEARCH_STATE_COOKIE), componentName, '')
    }
  }

  static contextType = LocaleContext

  render() {
    const { history, cluster, template } = this.props
    const { locale } = this.context
    const { searchValue } = this.state
    const tableData = transform(history, statusHistoryDef, locale)

    return (
      <div className='policy-status-history-view'>
        <div className='table'>
          <Title className='title' headingLevel="h3">{cluster}</Title>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${template}`}</Title>
          <br></br>
          <PatternFlyTable
            {...tableData}
            noResultMsg={msgs.get('table.search.no.results', locale)}
            handleSearch={this.handleSearch}
            searchValue={searchValue}
          />
        </div>
      </div>

    )
  }

  handleSearch = (value) => {
    if (typeof value === 'string') {
      saveGrcStatePair(GRC_SEARCH_STATE_COOKIE, componentName, value, true)
      this.setState({
        searchValue: value
      })
    }
  }
}

PolicyStatusHistoryView.propTypes = {
  cluster: PropTypes.string,
  history: PropTypes.array,
  template: PropTypes.string
}

export default PolicyStatusHistoryView

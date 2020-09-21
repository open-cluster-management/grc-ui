/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core'
import PatternFlyTable from './PatternFlyTable'
import { LocaleContext } from './LocaleContext'
import statusDef from '../../tableDefinitions/statusDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'

class PolicyStatusView extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      toggleIndex: 0
    }
    this.toggleClick = this.toggleClick.bind(this)
  }

  static contextType = LocaleContext

  render() {
    const { status } = this.props
    const { locale } = this.context
    const tableData = transform(status, statusDef, locale)
    const toggleIndex = this.state.toggleIndex
    return (
      <div className='policy-status-view'>
        <ToggleGroup variant='light'>
          <ToggleGroupItem
            buttonId={'policy-status-templates'} onChange={this.toggleClick} isSelected={toggleIndex===0}>
            {'templates'}
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'policy-status-clusters'} onChange={this.toggleClick} isSelected={toggleIndex===1}>
            {'clusters'}
          </ToggleGroupItem>
        </ToggleGroup>
        {toggleIndex===0 && <div className='policy-status-per-template-table'>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${'template'}`}</Title>
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
        </div>}
        {toggleIndex===1 && <div className='policy-status-per-template-table'>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${'template'}`}</Title>
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
          <PatternFlyTable {...tableData} noResultMsg={msgs.get('table.search.no.results', locale)} />
        </div>}
      </div>
    )
  }

  toggleClick(isSelected, event) {
    if (isSelected) {
      switch(event.currentTarget.id) {
      case 'policy-status-templates':
      default:
        this.setState({toggleIndex: 0})
        break
      case 'policy-status-clusters':
        this.setState({toggleIndex: 1})
      }
    }
  }
}

PolicyStatusView.propTypes = {
  status: PropTypes.array,
}

export default PolicyStatusView

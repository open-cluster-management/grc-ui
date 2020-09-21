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
import statusByTemplatesDef from '../../tableDefinitions/statusByTemplatesDef'
import statusByClustersDef from '../../tableDefinitions/statusByClustersDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'
import _uniqueId from 'lodash/uniqueId'

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
    const statusByTemplates = groupByTemplate(status)
    const tableDataByClusters = transform(status, statusByClustersDef, locale)
    const toggleIndex = this.state.toggleIndex
    return (
      <div className='policy-status-view'>
        <ToggleGroup className='policy-status-toggle' variant='light'>
          <ToggleGroupItem
            buttonId={'policy-status-templates'} onChange={this.toggleClick} isSelected={toggleIndex===0}>
            {msgs.get('tabs.policy.status.toggle.templates', locale)}
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'policy-status-clusters'} onChange={this.toggleClick} isSelected={toggleIndex===1}>
            {msgs.get('tabs.policy.status.toggle.clusters', locale)}
          </ToggleGroupItem>
        </ToggleGroup>
        <div className='policy-status-tab'>
          {toggleIndex===0 && Object.entries(statusByTemplates).map(([key, value])=> {
            const tableDataByTemplate = transform(value, statusByTemplatesDef, locale)
            return <div className='policy-status-by-templates-table' key={_uniqueId('template-index')}>
              <Title className='title' headingLevel="h4">{key}</Title>
              <PatternFlyTable {...tableDataByTemplate} noResultMsg={msgs.get('table.search.no.results', locale)} />
            </div>
          })}
          {toggleIndex===1 && <div className='policy-status-by-clusters-table'>
            <Title className='title' headingLevel="h4">{msgs.get('tabs.policy.status.toggle.clusters', locale)}</Title>
            <PatternFlyTable {...tableDataByClusters} noResultMsg={msgs.get('table.search.no.results', locale)} />
          </div>}
        </div>
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

function groupByTemplate(status) {
  const statusByTemplates = {}
  if (Array.isArray(status) && status.length > 0){
    status.forEach((singleStatus) => {
      const templateName = singleStatus.templateName
      if (templateName) {
        if (!Array.isArray(statusByTemplates[templateName])) {
          statusByTemplates[templateName] = []
        }
        statusByTemplates[templateName].push(singleStatus)
      }
    })
  }
  return statusByTemplates
}

PolicyStatusView.propTypes = {
  status: PropTypes.array,
}

export default PolicyStatusView

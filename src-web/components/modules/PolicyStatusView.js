/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core'
import PatternFlyTable from '../common/PatternFlyTable'
import { LocaleContext } from '../common/LocaleContext'
import statusByTemplatesDef from '../../tableDefinitions/statusByTemplatesDef'
import statusByClustersDef from '../../tableDefinitions/statusByClustersDef'
import NoResource from '../../components/common/NoResource'
import { transform } from '../../tableDefinitions/utils'
import { checkCreatePermission } from '../common/CheckUserPermission'
import msgs from '../../../nls/platform.properties'
import '../../../scss/policy-status-view.scss'

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
    const { items=[], userAccess } = this.props
    const searchValue = new URLSearchParams(location.search.substring(1)).get('searchFilter')
    const { locale } = this.context
    if (items.length === 0) {
      return <NoResource
        title={msgs.get('no-status.title', [msgs.get('routes.grc', locale)], locale)}
        svgName='EmptyPagePlanet-illus.png'>
      </NoResource>
    }
    // Check for "create" permissions in order to determine whether to enable
    // the "View Details" link, which requires creating a managedClusterView
    // (See https://github.com/open-cluster-management/backlog/issues/6135)
    const showDetailsLink = checkCreatePermission(userAccess)
    const statusAccess = items.map(item => ({...item, showDetailsLink: showDetailsLink}))
    const tableDataByTemplate = groupByTemplate(statusAccess, locale)
    const tableDataByClusters = transform(statusAccess, statusByClustersDef, locale)
    const toggleIndex = this.state.toggleIndex
    return (
      <div className='policy-status-view'>
        <ToggleGroup className='policy-status-toggle' variant='light'>
          <ToggleGroupItem
            buttonId={'policy-status-clusters'}
            onChange={this.toggleClick}
            isSelected={toggleIndex===0}
            text={msgs.get('tabs.policy.status.toggle.clusters', locale)}
            >
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'policy-status-templates'}
            onChange={this.toggleClick}
            isSelected={toggleIndex===1}
            text={msgs.get('tabs.policy.status.toggle.templates', locale)}
            >
          </ToggleGroupItem>
        </ToggleGroup>
        <div className='policy-status-tab'>
          {toggleIndex===0 && <div className='policy-status-by-clusters-table'>
            <Title
              className='title'
              headingLevel="h4">
              {msgs.get('tabs.policy.status.toggle.clusters', locale)}
            </Title>
            <PatternFlyTable
              {...tableDataByClusters}
              noResultMsg={msgs.get('table.search.no.results', locale)}
              searchValue={searchValue}
            />
          </div>}
          {toggleIndex===1 && tableDataByTemplate.map((data)=> {
            const templateName = data[0].toString()
            return <div
              className='policy-status-by-templates-table'
              key={`template-index-${templateName}`}
            >
              <Title
                className='title'
                headingLevel="h4">
                {templateName}
              </Title>
              <PatternFlyTable
                {...data[1]}
                noResultMsg={msgs.get('table.search.no.results', locale)}
                searchValue={searchValue}
              />
            </div>
          })}
        </div>
      </div>
    )
  }

  toggleClick(isSelected, event) {
    if (isSelected) {
      switch(event.currentTarget.id) {
      case 'policy-status-templates':
        this.setState({toggleIndex: 1})
        break
      case 'policy-status-clusters':
      default:
        this.setState({toggleIndex: 0})
        break
      }
    }
  }
}

function groupByTemplate(status, locale) {
  const statusByTemplates = {}
  const tableDataByTemplate = []
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
    Object.entries(statusByTemplates).forEach(([key, value])=> {
      const templateName = key
      const tableData = transform(value, statusByTemplatesDef, locale)
      tableDataByTemplate.push([templateName, tableData])
    })
  }
  return tableDataByTemplate
}

PolicyStatusView.propTypes = {
  items: PropTypes.array,
  searchValue: PropTypes.string,
  userAccess: PropTypes.array,
}

const mapStateToProps = (state) => {
  const userAccess = state.userAccess && state.userAccess.access
    ? state.userAccess.access
    : []
  return {
    userAccess: userAccess
  }
}

export default connect(mapStateToProps)(PolicyStatusView)

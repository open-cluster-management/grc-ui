/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core'
import PatternFlyTable from '../common/PatternFlyTable'
import { LocaleContext } from '../common/LocaleContext'
import grcPoliciesViewDef from '../../tableDefinitions/grcPoliciesViewDef'
import grcClustersViewDef from '../../tableDefinitions/grcClustersViewDef'
import { transform } from '../../tableDefinitions/utils'
import msgs from '../../../nls/platform.properties'
import { formatPoliciesToClustersTableData } from '../common/FormatTableData'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

resources(() => {
  require('../../../scss/grc-toggle-module.scss')
})

class GrcToggleModule extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      toggleIndex: 0
    }
    this.toggleClick = this.toggleClick.bind(this)
  }

  static contextType = LocaleContext

  render() {
    const { grcItems, showGrcTabToggle } = this.props
    const { locale } = this.context
    const tableDataByPolicies = transform(grcItems, grcPoliciesViewDef, locale)
    const tableDataByCLusters = transform(formatPoliciesToClustersTableData(grcItems), grcClustersViewDef, locale)
    const toggleIndex = this.state.toggleIndex
    return (
      <div className='grc-toggle'>
        {showGrcTabToggle && <ToggleGroup className='grc-toggle-button' variant='light'>
          <ToggleGroupItem
            buttonId={'grc-policies-view'}
            onChange={this.toggleClick}
            isSelected={toggleIndex===0}>
            {msgs.get('tabs.grc.toggle.allPolicies', locale)}
          </ToggleGroupItem>
          <ToggleGroupItem
            buttonId={'grc-cluster-view'}
            onChange={this.toggleClick}
            isSelected={toggleIndex===1}>
            {msgs.get('tabs.grc.toggle.clusterViolations', locale)}
          </ToggleGroupItem>
        </ToggleGroup>}
        <div className='resource-table'>
          {toggleIndex===0 && <div className='grc-view-by-policies-table'>
            <PatternFlyTable
              {...tableDataByPolicies}
              searchPlaceholder={msgs.get('tabs.grc.toggle.allPolicies.placeHolderText', locale)}
              noResultMsg={msgs.get('table.search.no.results', locale)}
              areActionsDisabled={false}
              dropdownPosition={'right'}
              dropdownDirection={'up'}
              resourceType={RESOURCE_TYPES.HCM_POLICIES_PER_POLICY}
              tableActions={grcPoliciesViewDef.tableActions}
            />
          </div>}
          {toggleIndex===1 && <div className='grc-view-by-clusters-table'>
            <PatternFlyTable
              {...tableDataByCLusters}
              searchPlaceholder={msgs.get('tabs.grc.toggle.clusterViolations.placeHolderText', locale)}
              noResultMsg={msgs.get('table.search.no.results', locale)}
              areActionsDisabled={false}
              dropdownPosition={'right'}
              dropdownDirection={'up'}
              resourceType={RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER}
            />
          </div>}
        </div>
      </div>
    )
  }

  toggleClick(isSelected, event) {
    if (isSelected) {
      switch(event.currentTarget.id) {
      case 'grc-policies-view':
        this.setState({toggleIndex: 0})
        break
      case 'grc-cluster-view':
      default:
        this.setState({toggleIndex: 1})
        break
      }
    }
  }
}

GrcToggleModule.propTypes = {
  grcItems: PropTypes.array,
  showGrcTabToggle: PropTypes.bool,
  userAccess: PropTypes.array
}

const mapStateToProps = (state) => {
  const userAccess = state.userAccess && state.userAccess.access
    ? state.userAccess.access
    : []
  return {
    userAccess: userAccess
  }
}

export default connect(mapStateToProps)(GrcToggleModule)

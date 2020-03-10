/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { getAvailableGrcFilters } from '../../../lib/client/filter-helper'

resources(() => {
  require('../../../scss/module-policy-summary.scss')
})

export default class PolicySummaryModule extends React.Component {

  render() {
    const { locale } = this.context
    const title = msgs.get('overview.policy.summary.title', locale)
    const data = this.getModuleData()
    return (
      <div className='module-policy-summary'>
        <div className='card-container-container'>
          <div className='card-title'>
            {title}
          </div>
          <div className='card-container'>
            <div className='card-content'>
              <div className='card-inner-content'>
                {data.summary.map(({count, summaryType}) => {
                  return (
                    <div key={summaryType} className='card-count-type'>
                      <div className='card-count'>
                        {count}
                      </div>
                      <div className='card-type'>
                        <div>
                          {summaryType.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getModuleData = () => {
    const { locale } = this.context
    const { policies, findings } = this.props
    const filters = getAvailableGrcFilters(policies, findings, locale)
    const policySet = new Set()
    const standardsSet = filters.standards.availableSet
    const categorySet = filters.categories.availableSet
    const controlSet = filters.controls.availableSet

    policies.map(policy=>policySet.add(_.get(policy, 'metadata.name', 'unknown')))
    return {
      summary: [
        {count: standardsSet.size, summaryType: msgs.get('overview.policy.summary.standards', locale)},
        {count: categorySet.size, summaryType: msgs.get('overview.policy.summary.categories', locale)},
        {count: policySet.size, summaryType: msgs.get('overview.policy.summary.policies', locale)},
        {count: controlSet.size, summaryType: msgs.get('overview.policy.summary.controls', locale)},
      ],
    }
  }
}

PolicySummaryModule.propTypes = {
  findings: PropTypes.array,
  policies: PropTypes.array,
}


/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SECURITY_TYPES } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import TopInformationModule from './TopInformationModule'
import _ from 'lodash'


resources(() => {
  require('../../../scss/module-recent-activity.scss')
})


const MAX_INFORMATION_THRESHOLD = 4

export default class RecentActivityModule extends React.Component {
  constructor(props) {
    super(props)
  }

  setThreshold = () => {
    //if max(Top violations, Top security findings) < 4, set information_threshold to max
    const moduleData = this.getModuleData()
    const numPolicies = moduleData.violations[0].count
    const numClusters = moduleData.violations[1].count
    const newMax = Math.max(numPolicies, numClusters)
    if (newMax > MAX_INFORMATION_THRESHOLD) {
      return MAX_INFORMATION_THRESHOLD
    }
    return newMax
  }

  render() {
    const { locale } = this.context
    const title = msgs.get('overview.recent.activity.title.nofinding', locale)
    const { handleDrillDownClick, policies, applications, updateViewState } = this.props
    const moduleData = this.getModuleData()
    return  (
      <div className='module-recent-activity' >
        <div className='card-container-container'>
          <div className='card-title-container'>
            <div className='card-title'>
              {title}
            </div>
          </div>
          <div className='violation-container' style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: '20px'}}>
            <TopInformationModule
              hideFindings={true}
              hideTabs={true}
              type={'policies'}
              viewState={'policies'}
              count={moduleData.violations[0].count}
              updateViewState={updateViewState}
              items={policies}
              applications={applications}
              staticInfo={true}
              threshold={this.setThreshold()}
              handleDrillDownClick={handleDrillDownClick}
            />
            <TopInformationModule
              hideFindings={true}
              hideTabs={true}
              type={'policies'}
              viewState={'clusters'}
              count={moduleData.violations[1].count}
              updateViewState={updateViewState}
              items={policies}
              applications={applications}
              staticInfo={true}
              threshold={this.setThreshold()}
              handleDrillDownClick={handleDrillDownClick}
            />
          </div>
        </div>
      </div>

    )
  }

  getModuleData = () => {
    const { locale } = this.context
    const { policies, findings } = this.props
    const policySet = new Set()
    const clusterSet = new Set()
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          clusterSet.add(key)
          policySet.add(_.get(policy, 'metadata.name', 'unknown'))
        }
      })
    })
    let low = 0, medium = 0, high = 0
    const total = findings.length
    findings.map(item => {
      const severity = item.finding && item.finding.severity.toLowerCase()
      switch (severity) {
      case 'low':
        low++
        break
      case 'medium':
        medium++
        break
      default:
        high++
      }
    })
    return {
      violations: [
        {count: policySet.size, violationType: msgs.get('overview.top.informations.policy.violations', locale)},
        {count: clusterSet.size, violationType: msgs.get('overview.top.informations.cluster.violations', locale)},
      ],
      findings: [
        {count: high, total: total, findingType: SECURITY_TYPES.HIGH},
        {count: medium, total: total, findingType: SECURITY_TYPES.MEDIUM},
        {count: low, total: total, findingType: SECURITY_TYPES.LOW},
      ]
    }
  }
}

const Violations = ({moduleData: {violations}, handleDrillDownClick}) => {
  return (
    <React.Fragment>
      {violations.map(({count, violationType}) => {
        const onClick = () =>{
          handleDrillDownClick(violationType)
        }
        const onKeyPress = (e) =>{
          if ( e.key === 'Enter') {
            onClick()
          }
        }
        const cardClasses = classNames({
          'card-count-type': true,
        })
        const countClasses = classNames({
          'card-count': true,
          'alert': count>0,
        })
        if (count === 0) {
          //show dash if no violations
          return (
            <div key={violationType} className={cardClasses}>
              <div className={'no-result-dash'}>
                --------
              </div>
              <div className='card-type'>
                <div className='no-result'>
                  {violationType.toUpperCase()}
                </div>
              </div>
            </div>
          )
        }
        return (
          <div key={violationType} className={cardClasses} role={'button'}
            tabIndex={0} onClick={onClick} onKeyPress={onKeyPress}>
            <div className={countClasses}>
              {count}
            </div>
            <div className='card-type'>
              <div>
                {violationType.toUpperCase()}
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}

Violations.propTypes = {
  handleDrillDownClick: PropTypes.func,
  moduleData: PropTypes.object,
}

RecentActivityModule.propTypes = {
  applications: PropTypes.array,
  findings: PropTypes.array,
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
  updateViewState: PropTypes.func,
  // viewState: PropTypes.object,
}

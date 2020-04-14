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
import * as d3 from 'd3'
import _ from 'lodash'

const arcGenerator = d3.arc()

resources(() => {
  require('../../../scss/module-recent-activity.scss')
})

const $grc_color_finding_high = '#E62325'
const $grc_color_finding_medium = '#FEC233'
const $grc_color_finding_low = '#A0A0A0'
const $grc_color_finding_ring = '#DFE3E6'

const MAX_INFORMATION_THRESHOLD = 4

export default class RecentActivityModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      threshold: 4,
      topViolationsNum: 0,
      topFindingsNum: 0,
    }
  }

  setThreshold = (numFindings, numViolations) => {
    //if max(Top violations, Top security findings) < 4, set information_threshold to max
    const newMax = Math.max(numFindings, numViolations)
    if (newMax > MAX_INFORMATION_THRESHOLD) {
      return MAX_INFORMATION_THRESHOLD
    }
    return newMax
  }

  thresholdCallback = (cardsLength, cardType) => {
    //updates module lengths and changes threshold if needed
    if (cardType === 'policies' && cardsLength !== this.state.topViolationsNum) {
      this.setState(
        { topViolationsNum: cardsLength },
        () => {
          const findingsN = this.state.topFindingsNum
          const violationsN = this.state.topViolationsNum
          this.setState(
            // need at least one threshold for top violations empty card
            { threshold: Math.max(1, this.setThreshold(findingsN, violationsN)) },
            () => {
              return
            }
          )
        }
      )
    }
    else if (cardType === 'findings' && cardsLength !== this.state.topFindingsNum) {
      this.setState(
        { topFindingsNum: cardsLength },
        () => {
          const findingsN = this.state.topFindingsNum
          const violationsN = this.state.topViolationsNum
          this.setState(
            // need at least one threshold for top finding empty card
            { threshold: Math.max(1, this.setThreshold(findingsN, violationsN)) },
            () => {
              return
            }
          )
        }
      )
    }
  }

  render() {
    const { locale } = this.context
    const title = msgs.get('overview.recent.activity.title', locale)
    const { handleDrillDownClick, viewState, policies, showFindings, findings, applications, updateViewState, showApplications } = this.props
    const moduleData = this.getModuleData()
    return (
      <div className='module-recent-activity'>
        <div className='card-container-container'>
          <div className='card-title'>
            {title}
          </div>
          <div className='card-container'>
            <div className='card-content'>
              <div className='card-inner-content'>
                <Violations moduleData={moduleData} handleDrillDownClick={handleDrillDownClick} locale={locale} />
                {showFindings ? <Findings moduleData={moduleData} handleDrillDownClick={handleDrillDownClick} locale={locale} /> : null}
              </div>
            </div>
          </div>
          <div className='violation-container'>
            <TopInformationModule
              type={'policies'}
              viewState={viewState.topViolationsChoice ? viewState.topViolationsChoice : 'policies'}
              updateViewState={updateViewState}
              items={policies}
              applications={applications}
              threshold={this.state.threshold}
              updateThreshold={this.thresholdCallback}
              handleDrillDownClick={handleDrillDownClick}
              showApplications={showApplications}
            />
            {showFindings ? <TopInformationModule
              type={'findings'}
              viewState={viewState.topFindingChoice ? viewState.topFindingChoice : 'findings'}
              updateViewState={updateViewState}
              items={findings}
              threshold={this.state.threshold}
              updateThreshold={this.thresholdCallback}
              handleDrillDownClick={handleDrillDownClick}
            /> : null}
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
      {violations.map(({count, violationType}, idx) => {
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
          hasBorder: idx===1,
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

const Findings = ({moduleData: {findings}, handleDrillDownClick, locale}) => {
  return (
    <React.Fragment>
      {findings.map(({count, total, findingType}) => {
        const onClick = () =>{
          handleDrillDownClick(findingType)
        }
        const onKeyPress = (e) =>{
          if ( e.key === 'Enter') {
            onClick()
          }
        }

        // set label and color
        let label, color
        switch (findingType) {
        case SECURITY_TYPES.HIGH:
          label = msgs.get('overview.recent.activity.finding.severity.high', locale)
          color = $grc_color_finding_high
          break
        case SECURITY_TYPES.MEDIUM:
          label = msgs.get('overview.recent.activity.finding.severity.medium', locale)
          color = $grc_color_finding_medium
          break
        case SECURITY_TYPES.LOW:
          label = msgs.get('overview.recent.activity.finding.severity.low', locale)
          color = $grc_color_finding_low
          break
        }

        // Generate the arc strings
        const arcs = d3.pie().sort(null)([count, Math.max(total-count, 1)])
        const pathData1 = arcGenerator(Object.assign(arcs[0], {
          innerRadius: 9,
          outerRadius: 15
        }))
        const pathData2 = arcGenerator(Object.assign(arcs[1], {
          innerRadius: 11,
          outerRadius: 13
        }))

        const countClasses = classNames({
          'card-count': true,
          'alert': count>0 && findingType===SECURITY_TYPES.HIGH,
        })
        if (count === 0) {
          //show dash if no findings
          return (
            <div key={findingType} className={'card-count-type'}>
              <div className={'no-result-dash'}>
                --------
              </div>
              <div className='card-type card-findings'>
                <div className='no-result'>
                  {label.toUpperCase()}
                </div>
              </div>
            </div>
          )
        }
        return (
          <div key={findingType} className='card-count-type' role={'button'}
            tabIndex={0} onClick={onClick} onKeyPress={onKeyPress}>
            <div className='card-count-container'>
              <svg className='card-count-pie'>
                <g>
                  <path fill={color} d={pathData1} />
                  <path fill={$grc_color_finding_ring} d={pathData2} />
                </g>
              </svg>
              <div className={countClasses}>
                {count}
              </div>
            </div>
            <div className='card-type card-findings'>
              <div>
                {label.toUpperCase()}
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}

Findings.propTypes = {
  handleDrillDownClick: PropTypes.func,
  locale: PropTypes.string,
  moduleData: PropTypes.object,
}

RecentActivityModule.propTypes = {
  applications: PropTypes.array,
  findings: PropTypes.array,
  handleDrillDownClick: PropTypes.func,
  policies: PropTypes.array,
  showApplications: PropTypes.bool,
  showFindings: PropTypes.bool,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}

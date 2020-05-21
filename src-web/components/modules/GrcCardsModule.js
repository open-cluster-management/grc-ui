/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DropdownV2, Icon } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import NoResource from '../common/NoResource'
import TruncateText from '../common/TruncateText'
import config from '../../../lib/shared/config'

resources(() => {
  require('../../../scss/module-grc-cards.scss')
})

const GrcCardsSelections = Object.freeze({
  categories: 'categories',
  standards: 'standards',
  controls: 'controls',
})

export class GrcCardsModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {grcCardChoice=GrcCardsSelections.standards}} = props
    this.state = {
      grcCardChoice,
    }
    this.onChange = this.onChange.bind(this)
    this.collapseClick = this.collapseClick.bind(this)
  }

  render() {
    const { displayType, showGrcCard } = this.props
    let cardData
    switch(displayType) {
    case 'all':
    default:
      cardData = this.getPolicyCardData()
      break
    case 'findings':
      cardData = this.getFindingCardData()
      break
    }
    return (
      <div className='module-grc-cards'>
        {this.renderHeader()}
        {showGrcCard && this.renderCards(cardData, displayType)}
      </div>
    )
  }

  renderHeader() {
    const { locale } = this.context
    const collapseHintCollapse = msgs.get('overview.grc.cards.collapseHint.collapse', locale)
    const collapseHintExpand = msgs.get('overview.grc.cards.collapseHint.expand', locale)
    const collapseButtonCollapse = msgs.get('overview.grc.cards.collapseButton.collapse', locale)
    const collapseButtonExpand = msgs.get('overview.grc.cards.collapseButton.expand', locale)
    const { grcCardChoice } = this.state
    const { showGrcCard } = this.props
    const choices = this.getPolicyCardChoices(locale)
    const title = msgs.get('overview.grc.overview.title', locale)
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return grcCardChoice===value
    }))
    return (
      <div className={showGrcCard ? 'header-container' : 'header-container card-collapsed'}>
        {showGrcCard && <div className='header-title'>{title}</div>}
        {showGrcCard &&
        <div>
          <DropdownV2 className='selection'
            label={title}
            ariaLabel={title}
            onChange={this.onChange}
            inline={true}
            initialSelectedItem={choices[idx].label}
            items={choices} />
        </div>}
        <button className='collapse' onClick={this.collapseClick}>
          <span className='collapse-hint'>{showGrcCard?collapseHintCollapse:collapseHintExpand}</span>
          <span className='collapse-button'>{showGrcCard?collapseButtonCollapse:collapseButtonExpand}</span>
          {showGrcCard ? <Icon name='chevron--up' className='arrow-up' description='collapse' /> : <Icon name='chevron--down' className='arrow-down' description='expand' />}
        </button>
      </div>
    )
  }

  renderCards(cardData, displayType) {
    const { locale } = this.context
    const { handleDrillDownClick } = this.props
    return (
      <div className='card-container-container' >
        {cardData.map((data) => {
          let renderCard
          switch(displayType) {
          case 'findings':
            renderCard = <FindingCard key={data.name} data={data} locale={locale} handleClick={handleDrillDownClick} />
            break
          case 'all':
          default:
            renderCard = <PolicyCard key={data.name} data={data} locale={locale} handleClick={handleDrillDownClick} />
            break
          }
          return renderCard
        })}
      </div>
    )
  }

  getPolicyCardData = () => {
    const { locale } = this.context
    const { grcItems, activeFilters } = this.props
    const { grcCardChoice } = this.state
    const other = msgs.get('overview.grc.overview.other', locale)

    // loop thru grcItems under policies display
    const dataMap = {}
    const policyMap = {}
    const clusterMap = {}
    grcItems.map(policy => {
      // get a policy's standards/categories
      let types, key
      const annotations = _.get(policy, 'metadata.annotations', {}) || {}
      switch (grcCardChoice) {
      case GrcCardsSelections.categories:
      default:
        types = annotations[`${config.mcmPolicyPrefix}/categories`] || ''
        key = 'categories'
        break
      case GrcCardsSelections.standards:
        types = annotations[`${config.mcmPolicyPrefix}/standards`] || ''
        key = 'standards'
        break
      }
      // backward compatible and if user doesn't supply an annotation
      if (types && types.length===0) {
        types=other
      }
      //for policies, multi categories/standards is a string split with ','
      types.split(',').forEach(type=>{
        type = type.trim()
        if (type) {
          let name = type
          if (grcCardChoice===GrcCardsSelections.categories || grcCardChoice===GrcCardsSelections.standards || grcCardChoice===GrcCardsSelections.controls ) {
            name = _.startCase(name)
          }
          const filtered = activeFilters[key] &&  activeFilters[key].size>0 && !activeFilters[key].has(name)
          if (!filtered) {
            let data = dataMap[name]
            if (!data) {
              data = dataMap[name]= {
                name,
                rawName: type,
                choice: grcCardChoice,
                violations: 0,
                counts: {
                  cluster: {
                    violations:0,
                    total:0,
                  },
                  policy: {
                    violations:0,
                    total:0,
                  },
                }
              }
            }

            // if policy has violation
            policyMap[name] = policyMap[name] || {}
            clusterMap[name] = clusterMap[name] || {}
            const statuses = _.get(policy, 'raw.status.status', {})
            const policyName = _.get(policy, 'metadata.name')
            Object.keys(statuses).forEach(clusterName=>{
              const compliant = statuses[clusterName].compliant
              const noncompliant = !compliant || compliant.toLowerCase()==='noncompliant'
              policyMap[name][policyName] = policyMap[name][policyName] || noncompliant
              clusterMap[name][clusterName] = clusterMap[name][clusterName] || noncompliant
            })
          }
        }
      })
    })

    // tabulate for category or standard
    // by policies
    Object.keys(policyMap).forEach(name=>{
      const data = dataMap[name]
      const policies = policyMap[name]
      Object.keys(policies).forEach(policy=>{

        // this is a policy with this category/standard
        data.counts.policy.total++

        // this policy with this category/standard has a violation
        if (policies[policy]) {
          data.counts.policy.violations++
          data.violations++
        }
      })
    })

    // by clusters
    Object.keys(clusterMap).forEach(name=>{
      const data = dataMap[name]
      const clusters = clusterMap[name]
      Object.keys(clusters).forEach(cluster=>{

        // this is a cluster with this category/standard
        data.counts.cluster.total++

        // this cluster with this category/standard has a violation
        if (clusters[cluster]) {
          data.counts.cluster.violations++
          data.violations++
        }
      })
    })

    // convert to array and sort
    return Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({name:an, violations:av}, {name:bn, violations:bv})=>{
      const v = bv-av
      if (v===0) {
        if (an===other && bn!==other) {
          return 1
        } else  if (an!==other && bn===other) {
          return -1
        }
        return an.localeCompare(bn)
      }
      return v
    })
  }

  getFindingCardData = () => {
    const { locale } = this.context
    const { grcItems, activeFilters } = this.props
    const { grcCardChoice } = this.state
    const other = msgs.get('overview.grc.overview.other', locale)

    //total findings number
    const totalFindings = grcItems.length
    // loop thru grcItems under finding display
    const dataMap = {}
    //findingSeverityMap = {key:findingName, value:severityLevel}
    const findingSeverityMap = {}
    grcItems.map(finding => {
      // get a finding's standards/categories
      let types, key
      const securityClassification = _.get(finding, 'securityClassification', {}) || {}
      switch (grcCardChoice) {
      case GrcCardsSelections.standards:
        types = securityClassification['securityStandards'] || ''
        key = 'standards'
        break
      case GrcCardsSelections.categories:
      default:
        types = securityClassification['securityCategories'] || ''
        key = 'categories'
        break
      }
      // backward compatible and if user doesn't supply securityClassification
      if (types && types.length===0) {
        types=[other]
      }
      // if securityClassification isn't empty but contains empty categories/standards, replace them to 'other'
      else if (Array.isArray(types)) {
        types.forEach((type, index)=>{
          if(type.length===0) {
            types[index]=other
            return types[index]
          }
          return undefined
        })
      }
      //for findings, multi categories/standards is an array, rather than a string split with ','
      types.forEach(type=>{
        type = type.trim()
        if (type) {
          let name = type
          if (grcCardChoice===GrcCardsSelections.categories || grcCardChoice===GrcCardsSelections.standards || grcCardChoice===GrcCardsSelections.controls ) {
            name = _.startCase(name)
          }
          const filtered = activeFilters[key] &&  activeFilters[key].size>0 && !activeFilters[key].has(name)
          if (!filtered) {
            let data = dataMap[name]
            if (!data) {
              data = dataMap[name]= {
                name,
                rawName: type,
                choice: grcCardChoice,
                highSeverity:0,
                counts: {
                  finding: {
                    currentFindings:0,
                    totalFindings:totalFindings,
                  },
                  severity: {
                    highSeverity:0,
                    totalSeverity:0,
                  },
                }
              }
            }

            findingSeverityMap[name] = findingSeverityMap[name] || {}
            const severity = _.get(finding, 'finding.severity', {})
            const findingName = _.get(finding, 'name')
            findingSeverityMap[name][findingName] = severity
          }
        }
      })
    })

    // tabulate for category or standard by unique finding name
    Object.keys(findingSeverityMap).forEach(name=>{
      const data = dataMap[name]
      const findingSeverity = findingSeverityMap[name]
      Object.keys(findingSeverity).forEach(findingName=>{
        // this is a finding with this category/standard
        data.counts.finding.currentFindings++
        // this is a severity with this category/standard, no matter severity level
        data.counts.severity.totalSeverity++
        // this is a severity with this category/standard has high severity level
        if (findingSeverity[findingName].toLowerCase() === 'high') {
          data.counts.severity.highSeverity++
          data.highSeverity++
        }
      })
    })

    // convert to array and sort
    return Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({name:an, highSeverity:aH}, {name:bn, highSeverity:bH})=>{
      const v = bH-aH
      if (v===0) {
        if (an===other && bn!==other) {
          return 1
        } else  if (an!==other && bn===other) {
          return -1
        }
        return an.localeCompare(bn)
      }
      return v
    })
  }

  getPolicyCardChoices = (locale) => {
    if (!this.grcCardChoices) {
      this.grcCardChoices = [
        {
          value: GrcCardsSelections.categories,
          label: msgs.get('overview.grc.cards.categories', locale),
        },
        {
          value: GrcCardsSelections.standards,
          label: msgs.get('overview.grc.cards.standards', locale),
        },
      ]
    }
    return this.grcCardChoices
  }

  onChange = (e) => {
    const {selectedItem: {value}} = e
    this.props.updateViewState({grcCardChoice: value})
    this.setState(()=>{
      return {grcCardChoice: value}
    })
  }

  collapseClick() {
    const {history, location} = this.props
    const paraURL = queryString.parse(location.search)
    if(typeof paraURL.card === 'undefined'){//when no card flag means true
      paraURL.card = false}
    else{
      paraURL.card = paraURL.card === 'false' ? true : false}
    history.push(`${location.pathname}?${queryString.stringify(paraURL)}`)
    return queryString.stringify(paraURL)
  }
}

// functional policy card component
const PolicyCard = ({data, locale, handleClick}) => {
  const { counts, choice, name } = data
  //validItemsCount = 0 means there isn't any policy and cluster violation for single policy card
  //thus return policy empty state card, otherwise return normal policy card
  let validItemsCount = 0
  const countData = Object.keys(counts).map(type=>{
    validItemsCount += counts[type].violations ? counts[type].violations : 0
    return {
      ...counts[type],
      grcType: msgs.get(`overview.${type}.violations`, locale),
      choice,
      type,
    }
  })
  return (
    <div key={name}>
      <div className='card-container'>
        <div className='card-content'>
          <div className='card-name'>
            <TruncateText maxCharacters={50} text={name} />
          </div>
          <div className='card-count-content'>
            { //normal policy card with at least one policy or cluster violation
              validItemsCount > 0 && countData.map(({violations, total, grcType, choice:localChoice, type }) => {
                const violated = violations > 0
                const containerClasses = classNames({
                  'card-count-container': true,
                  violated,
                })
                const onClick = () =>{
                  if (violated) {
                    handleClick(localChoice, name, type)
                  }
                }
                const onKeyPress = (e) =>{
                  if ( e.key === 'Enter') {
                    onClick()
                  }
                }
                return (
                  <div key={grcType} className={containerClasses} role={'button'}
                    tabIndex={violated ? 0 : -1} onClick={onClick} onKeyPress={onKeyPress} >
                    <div className='card-count'>
                      <div className='card-count-informations'>
                        {violations}
                      </div>
                      <div className='card-count-total'>
                        {`/${total}`}
                      </div>
                    </div>
                    <div className='card-grc-type'>
                      {grcType}
                    </div>
                  </div>
                )
              })}
            { //policy empty state card without any policy and cluster violation
              validItemsCount === 0 &&
              <div className='empty-violations-strip'>
                <NoResource
                  className={'card-violations empty'}
                  imgClassName={'empty-violations-img'}
                  titleClassName={'no-card-violations'}
                  title={msgs.get('overview.violations.empty', locale)}
                  svgName={'no-other-violations.svg'}>
                </NoResource>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// functional finding card component
const FindingCard = ({data, locale, handleClick}) => {
  const { counts, choice, name } = data
  //validItemsCount = 0 means there isn't any finding or high severity for single finding card
  //thus return finding empty state card, otherwise return normal finding card
  let validItemsCount = 0
  const countData = Object.keys(counts).map(type=>{
    validItemsCount += counts[type].currentFindings ? counts[type].currentFindings : 0
    validItemsCount += counts[type].highSeverity ? counts[type].highSeverity : 0
    return {
      ...counts[type],
      grcType: msgs.get(`overview.${type}.findingCluster`, locale),
      choice,
      type,
    }
  })
  return (
    <div key={name}>
      <div className='card-container'>
        <div className='card-content'>
          <div className='card-name'>
            <TruncateText maxCharacters={50} text={name} />
          </div>
          <div className='card-count-content'>
            { //normal finding card with at least one finding or high severity
              validItemsCount > 0 &&
              countData.map(({currentFindings, totalFindings, highSeverity, totalSeverity, grcType, choice:localChoice, type }) => {
                const found = currentFindings > 0
                const high = highSeverity > 0
                const containerClasses = classNames({
                  'card-count-container': true,
                  found,
                  high,
                })
                const onClick = () =>{
                  if (found) {
                    handleClick(localChoice, name, type)
                  }
                  if (high) {
                    handleClick(localChoice, name, type, 'High')
                  }
                }
                const onKeyPress = (e) =>{
                  if ( e.key === 'Enter') {
                    onClick()
                  }
                }
                return (
                  <div key={grcType} className={containerClasses} role={'button'}
                    tabIndex={((type==='finding' && found)||(type==='severity' && high)) ? 0 : -1} onClick={onClick} onKeyPress={onKeyPress}>
                    {type==='finding' && <div className='finding-cluster'>
                      <div className='card-count'>
                        <div className='card-count-informations'>
                          {currentFindings}
                        </div>
                        <div className='card-count-total'>
                          {`/${totalFindings}`}
                        </div>
                      </div>
                      <div className='card-grc-type'>
                        {grcType}
                      </div>
                    </div>}
                    {type==='severity' && <div className='high-severity'>
                      <div className='card-count'>
                        <div className='card-count-informations'>
                          {highSeverity}
                        </div>
                        <div className='card-count-total'>
                          {`/${totalSeverity}`}
                        </div>
                      </div>
                      <div className='card-grc-type'>
                        {grcType}
                      </div>
                    </div>}
                  </div>
                )
              })}
            { //finding empty state card without any finding or high severity
              validItemsCount === 0 &&
              <div className='empty-violations-strip'>
                <NoResource
                  className={'card-violations empty'}
                  imgClassName={'empty-violations-img'}
                  titleClassName={'no-card-violations'}
                  title={msgs.get('overview.findings.empty', locale)}
                  svgName={'no-other-violations.svg'}>
                </NoResource>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

FindingCard.propTypes = {
  data: PropTypes.object,
  handleClick: PropTypes.func,
  locale: PropTypes.string
}

PolicyCard.propTypes = {
  data: PropTypes.object,
  handleClick: PropTypes.func,
  locale: PropTypes.string
}

GrcCardsModule.propTypes = {
  activeFilters: PropTypes.object,
  displayType: PropTypes.string,
  grcItems: PropTypes.array,
  handleDrillDownClick: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  showGrcCard: PropTypes.bool,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}

export default withRouter(GrcCardsModule)

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
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { Tabs, Tab } from 'carbon-components-react'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import NoResource from '../common/NoResource'


resources(() => {
  require('../../../scss/module-top-information.scss')
})

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

const EMPTY_CHOICE = 'EMPTY_CHOICE'

const TopInformationSelections = Object.freeze({
  clusters: 'clusters',
  policies: 'policies',
  findings: 'findings',
  applications: 'applications',
})

export default class TopInformationModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState=TopInformationSelections.clusters} = props
    // now only using one viewState topInfoChoice, type and topInfoChoice determine everthing
    this.state = {
      topInfoChoice: viewState,
      cardData: []
    }
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    //current items, type when page first loading
    const { items, applications, type } = this.props
    this.setCardData(items, applications, type)
  }

  componentWillReceiveProps(nextProps) {
    //next items, type when update filter on current page
    const { items, applications, type } = nextProps
    this.setCardData(items, applications, type)
  }

  render() {
    let cardData = this.state.cardData
    if (cardData.length > 0) {
      if (cardData.length > this.props.threshold) {
        cardData = cardData.slice(0,this.props.threshold)
      }
      if (cardData.length < this.props.threshold && !this.hasEmptyCard(cardData)) {
        cardData.push(this.getEmptyCardStatements())
      }
    } else {
      cardData.push(this.getEmptyCardStatements())
    }

    return (
      <div className='module-top-information'>
        {this.renderHeader()}
        {this.renderCards(cardData)}
      </div>
    )
  }

  getEmptyCardStatements() {
    const { locale } = this.context
    let emptyCardData = {}
    const { type='policies' } = this.props
    const choice = this.state.topInfoChoice
    switch(type) {
    case 'policies':
      switch (choice) {
      case 'policies':
      default :
        emptyCardData = {
          name: msgs.get('overview.top.informations.policies.empty', locale),
          choice: EMPTY_CHOICE,
          description: [msgs.get('overview.top.informations.policies.empty.desc', locale)],
        }
        break
      case 'applications':
        emptyCardData = {
          name: msgs.get('overview.top.informations.applications.empty', locale),
          choice: EMPTY_CHOICE,
          description: [msgs.get('overview.top.informations.applications.empty.desc', locale)],
        }
        break
      }
      break
    case 'findings':
      emptyCardData = {
        name: msgs.get('overview.top.informations.findings.empty', locale),
        choice: EMPTY_CHOICE,
        description: [msgs.get('overview.top.informations.findings.empty.desc', locale)],
      }
      break
    }

    return emptyCardData
  }

  hasEmptyCard(cards) {
    if (cards[cards.length - 1]['choice'] === EMPTY_CHOICE) {
      return true
    }
    return false
  }

  setCardData(items, applications, type) {
    this.setState({ cardData: this.getCardData(items, applications, type)})
  }

  renderHeader() {
    const { locale } = this.context
    const { type, showApplications } = this.props
    const choice = this.state.topInfoChoice
    let choices = []
    switch(type) {
    case 'policies':
      choices = this.getTopViolationChoices(locale)
      break
    case 'findings':
      choices = this.getTopFindingChoices(locale)
      break
    }
    const title = msgs.get(`overview.top.informations.title.${type}`, locale)
    const idx = Math.max(0, choices.findIndex(({value})=>{
      return choice===value
    }))
    return (
      <div className='header-container'>
        <div className={'header-title'}>{title}</div>
        <div className={'header-tab'}>
          <Tabs selected={idx} onSelectionChange={this.onChange} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
            <Tab label={msgs.get(`overview.top.informations.${type}`, locale)} />
            <Tab label={msgs.get('overview.top.informations.clusters', locale)} />
            {type==='policies' && showApplications && <Tab label={msgs.get('overview.top.informations.applications', locale)} />}
          </Tabs>
        </div>
      </div>
    )
  }

  renderCards(cardData) {
    const { locale } = this.state
    const { handleDrillDownClick } = this.props
    return <TopInformations key={cardData.name} cardData={cardData} handleClick={handleDrillDownClick} locale={locale} />
  }

  getPoliciesAndClustersDataMap(dataMap, items, topInfoChoice) {
    if(items && Array.isArray(items)) {
      items.forEach((item) =>{
        const statuses = _.get(item, 'raw.status.status', {})
        Object.keys(statuses).forEach(key=>{
          const compliant = statuses[key].compliant
          if (!compliant || compliant.toLowerCase()==='noncompliant') {
            let name, description, choice, nameSpace, itemName
            switch (topInfoChoice) {
            case TopInformationSelections.policies:
              name = _.get(item, 'metadata.name', 'unknown')
              description = key
              choice = msgs.get('overview.top.informations.policies').toLowerCase()
              nameSpace = _.get(item, 'metadata.namespace', 'unknown')
              itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
              break
            case TopInformationSelections.clusters:
              // case TopInformationSelections.applications:
              name = key
              description = _.get(item, 'metadata.name', 'unknown')
              choice = msgs.get('overview.top.informations.clusters').toLowerCase()
              nameSpace = _.get(item, 'metadata.namespace', 'unknown')
              itemName= _.get(item, 'raw.spec.runtime-rules[0].metadata.name', name)
              break
            }
            let data = dataMap[name]
            if (!data) {
              dataMap[name] = data = {
                name,
                description: [],
                count: 0,
                choice,
                nameSpace,
                itemName
              }
            }
            data.description.push(description)
            data.count++
          }
        })
      })
    }
  }

  getApplicationsDataMap(dataMap, applications) {
    if(applications && Array.isArray(applications)) {
      applications.forEach((application) =>{
        if (application.policies && application.policies.length > 0) {
          const name = _.get(application, 'name', 'unknown')
          const choice = msgs.get('overview.top.informations.applications').toLowerCase()
          const nameSpace = _.get(application, 'namespace', 'unknown')
          const itemName = name

          let data = dataMap[name]
          if (!data) {
            dataMap[name] = data = {
              name,
              description: [],
              count: 0,
              choice,
              nameSpace,
              itemName
            }
          }

          const violatedPolicies = application.policies
          if (violatedPolicies) {
            violatedPolicies.map(violatedPolicy=>{
              if (violatedPolicy.name) {
                data.description.push(violatedPolicy.name)
                data.count++
              }
            })
          }
        }
      })
    }
  }

  getCardData = (items, applications, type) => {
    const { topInfoChoice } = this.state
    const dataMap = {}
    switch (type) {
    case 'policies':
      switch (topInfoChoice) {
      case TopInformationSelections.policies:
      case TopInformationSelections.clusters:
      default:
        this.getPoliciesAndClustersDataMap(dataMap, items, topInfoChoice)
        break
      case TopInformationSelections.applications:
        this.getApplicationsDataMap(dataMap, applications)
        break
      }
      break
    case 'findings':
      items.map(item=>{
        let name, description, choice, nameSpace, itemName
        switch (topInfoChoice) {
        case TopInformationSelections.findings:
        default:
          name = _.get(item, 'shortDescription', 'unknown')
          description = _.get(item, 'context.clusterName', 'unknown')
          choice = msgs.get('overview.top.informations.findings').toLowerCase()
          nameSpace = _.get(item, 'context.namespaceName', 'unknown')
          break
        case TopInformationSelections.clusters:
          name = _.get(item, 'context.clusterName', 'unknown')
          description = _.get(item, 'shortDescription', 'unknown')
          choice = msgs.get('overview.top.informations.finding.clusters').toLowerCase()
          nameSpace = _.get(item, 'context.namespaceName', 'unknown')
          break
        }
        let data = dataMap[name]
        if (!data) {
          dataMap[name] = data = {
            name,
            description: [],
            count: 0,
            choice,
            nameSpace,
            itemName
          }
        }
        data.description.push(description)
        data.count++
      })
      break
    }
    const cards = Object.keys(dataMap).map(key=>{
      return {...dataMap[key]}
    }).sort(({count:a},{count:b})=>{
      return b-a
    })

    //send number of cards up to parent to calculate new card threshold
    this.props.updateThreshold(cards.length, type)

    // if less informations than threshold, add an empty card
    if (cards.length<this.props.threshold) {
      cards.push(this.getEmptyCardStatements())
    }
    return cards
  }

  getTopViolationChoices = (locale) => {
    if (!this.topViolationChoices) {
      this.topViolationChoices = [
        {
          value: TopInformationSelections.policies,
          label: msgs.get('overview.top.informations.policies', locale),
        },
        {
          value: TopInformationSelections.clusters,
          label: msgs.get('overview.top.informations.clusters', locale),
        },
        {
          value: TopInformationSelections.applications,
          label: msgs.get('overview.top.informations.applications', locale),
        },
      ]
    }
    return this.topViolationChoices
  }

  getTopFindingChoices = (locale) => {
    if (!this.topFindingChoices) {
      this.topFindingChoices = [
        {
          value: TopInformationSelections.findings,
          label: msgs.get('overview.top.informations.findings', locale),
        },
        {
          value: TopInformationSelections.clusters,
          label: msgs.get('overview.top.informations.clusters', locale),
        }
      ]
    }
    return this.topFindingChoices
  }

  onChange = (index) => {
    const { items, applications, type } = this.props
    let value = ''
    switch(type) {
    case 'policies':
    default:
      switch(index) {
      case 0:
      default:
        value = 'policies'
        break
      case 1:
        value = 'clusters'
        break
      case 2:
        value = 'applications'
        break
      }
      // here is updating OverviewView view states, we still need to keep two kinds of view states there
      this.props.updateViewState({topViolationChoice: value})
      this.setState(()=>{
        // here is updating local TopInformationModule view states
        return {topInfoChoice: value}
      }, () => {
        this.setCardData(items, applications, type)
      })
      break
    case 'findings':
      switch(index) {
      case 0:
      default:
        value = 'findings'
        break
      case 1:
        value = 'clusters'
        break
      }
      // here is updating OverviewView view states, we still need to keep two kinds of view states there
      this.props.updateViewState({topFindingChoice: value})
      this.setState(()=>{
        // here is updating local TopInformationModule view states
        return {topInfoChoice: value}
      }, () => {
        this.setCardData(items, null, type)
      })
      break
    }
    return this.state.cardData
  }
}

const TopInformations = ({cardData, handleClick}) => {
  return (
    <div key={name}>
      <div className='information-card-container' >
        {cardData.map(({name, description, count, choice, type}) => {
          const violated = count > 0
          const onClick = () =>{
            if (violated) {
              handleClick(choice, name, type, description.toString())
            }
          }
          const onKeyPress = (e) =>{
            if ( e.key === 'Enter') {
              onClick()
            }
          }

          const renderCount = () => {
            if (choice !== EMPTY_CHOICE) {
              return (
                <React.Fragment>
                  <div className='card-informations'>
                    <div className={classes}>
                      {count}
                    </div>
                  </div>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment>
                  <NoResource
                    className={'card-informations empty'}
                    imgClassName={'empty-icon'}
                    svgName={'no-other-violations.svg'}>
                  </NoResource>
                </React.Fragment>
              )
            }
          }

          const renderName = () => {
            return (
              <React.Fragment>
                {name}
              </React.Fragment>
            )
          }

          const renderDescription  = () => {
            if (choice !== EMPTY_CHOICE) {
              const descDict = {}
              for (let i = 0; i < description.length; i++) {
                if (descDict[description[i]]) {
                  descDict[description[i]] += 1
                }
                else {
                  descDict[description[i]] = 1
                }
              }
              var sortedKeys = []
              for(var key in descDict) {
                sortedKeys.push([ key, descDict[key] ])
              }
              sortedKeys.sort((kv1, kv2) => {
                return kv2[1] - kv1[1]
              })
              const newDesc = []
              for (let i = 0; i < sortedKeys.length; i++) {
                const skey = sortedKeys[i][0]
                newDesc.push((descDict[skey] > 1) ? skey + ' (' + descDict[skey] + ')' : skey)
              }
              const descText = newDesc.length > 0 ? newDesc.map((singleDescription) => {
                return singleDescription
              }).reduce((prev, curr) => (prev + ', ' + curr)) : ''
              return (
                <ResponsiveEllipsis
                  text={descText}
                  maxLine={2}
                  trimRight={true}
                  basedOn='letters'
                />
              )
            } else {
              return (
                <ResponsiveEllipsis
                  text={description[0]}
                  maxLine={2}
                  trimRight={true}
                  basedOn='letters'
                />
              )
            }
          }

          const renderWholeStrip = () => {
            return (
              <div className='information-card-content'>
                <div className='card-inner-content'>
                  {renderCount()}
                  <div className='card-name-description'>
                    <div className={choice !== EMPTY_CHOICE ? 'card-name name-clickable' : 'card-name name-empty'}>
                      {renderName()}
                    </div>
                    <div className={choice !== EMPTY_CHOICE ? 'card-description description-clickable' : 'card-description description-empty'}>
                      {renderDescription()}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          const classes = classNames({
            'card-information-count': true,
            //'alert': count>0,
          })
          return (
            <div key={name}>
              <React.Fragment>
                {choice !== EMPTY_CHOICE ?
                  <div className='information-card-container single-strip' role={'button'} onClick={onClick} onKeyPress={onKeyPress} tabIndex={0}>
                    {renderWholeStrip()}
                  </div>
                  :
                  <div className='information-card-container single-strip empty-strip'>
                    {renderWholeStrip()}
                  </div>}
              </React.Fragment>
            </div>
          )
        })}
      </div>
    </div>
  )
}

TopInformations.propTypes = {
  cardData: PropTypes.array,
  handleClick: PropTypes.func,
}

TopInformationModule.propTypes = {
  applications: PropTypes.array,
  handleDrillDownClick: PropTypes.func,
  items: PropTypes.array,
  showApplications: PropTypes.bool,
  threshold: PropTypes.number,
  type: PropTypes.string,
  updateThreshold: PropTypes.func,
  updateViewState: PropTypes.func,
  viewState: PropTypes.string,
}

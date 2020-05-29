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
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import { DropdownV2, Slider, TooltipIcon } from 'carbon-components-react'
import Radar from 'react-d3-radar'
import { select } from 'd3'
import 'd3-selection-multi'
import { SECURITY_TYPES } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import NoResource from '../common/NoResource'

resources(() => {
  require('../../../scss/module-impacted-controls.scss')
})

const $grcColorRadarBlue = '#0082C1'
const $grcColorRadarGreen = '#13B9B9'
const $grcColorRadarRing = '#979797'

const tooltip = select('body').append('div')
  .attr('class', 'tooltip')
  .attr('tabindex', '-1') //tooltip only accessible when keyboard focused and press enter key
  .styles(()=>{
    return {
      'display': 'none',
      'opacity': 0
    }
  })

class ImpactedControlsModule extends React.Component {

  constructor (props) {
    super(props)
    const {viewState: {showControls=6}} = props
    this.state = {
      showControls,
      tooltipKeyFocus: false, //true means tooltip is open and keyboard focused
    }
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.openTooltip = this.openTooltip.bind(this)
    this.closeTooltip = this.closeTooltip.bind(this)
    this.fixRadar = this.fixRadar.bind(this)
    this.setDropdown = this.setDropdown.bind(this)
    this.openTooltipLink = this.openTooltipLink.bind(this)
    this.fixTooltipDrilldown = this.fixTooltipDrilldown.bind(this)
  }

  componentDidUpdate() {
    this.dotMap=null
    this.fixRadar(this.radarRef)
    this.fixDropdown()
  }

  componentWillUnmount() {
    tooltip.style('display', 'none')
  }

  render() {
    this.cardData = this.getCardData()
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.title', locale)
    const localTooltip = msgs.get('overview.impacted.controls.tooltip', locale)
    return (
      <div className='module-impacted-controls'>
        <div className='card-container-container'>
          <div className='card-title-container'>
            <div className='card-title'>{title}</div>
            <TooltipIcon direction='top' align='end' tooltipText={localTooltip}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
          <div className='card-container'>
            <div className='card-content'>
              {this.renderControls(this.cardData)}
              {this.renderRadar(this.cardData)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderControls(cardData) {
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.title', locale)
    return (
      <div className='card-controls'>
        {this.renderLegend()}
        <div className='card-control-panel'>
          {this.renderSelection(title, cardData)}
          {this.renderSlider({max: cardData.radarData.variables.length})}
        </div>
      </div>
    )
  }

  renderSelection(title, {selectionData, standardsChoice}) {
    const { locale } = this.context
    let idx = 0
    const choices = selectionData.sort().map((standard, ix)=>{
      if (standardsChoice===standard) {
        idx = ix
      }
      return {
        value: standard,
        label: this.getSelectionLabel(standard)
      }
    })
    this.currentChoice = choices[idx]
    return (
      <div className='card-selection' ref={this.setDropdown}
        key={this.getSelectionLabel('ALL')}>
        <div className='card-selection-title'>
          {msgs.get('overview.impacted.controls.standard', locale)}
        </div>
        <DropdownV2 className='selection'
          label={title}
          ariaLabel={title}
          onChange={this.onSelectionChange}
          inline={true}
          initialSelectedItem={choices[idx].label}
          items={choices} />
      </div>
    )
  }

  renderLegend() {
    const { locale } = this.context
    const { showFindings } = this.props
    const legend = showFindings ? [
      {title: msgs.get('overview.impacted.controls.legend.policies', locale), className: 'policies'},
      {title: msgs.get('overview.impacted.controls.legend.findings', locale), className: 'findings'},
    ] : [
      {title: msgs.get('overview.impacted.controls.legend.policies', locale), className: 'policies'},
    ]

    return (
      <div className='card-legend'>
        <div key={'key'} className='key' >{msgs.get('overview.impacted.controls.legend.key', locale)}</div>
        {legend.map(({title, className}) => (
          <div key={title} className='legend-container' >
            <div className={`legend ${className}`} />
            {title}
          </div>
        ))}
      </div>
    )
  }

  renderSlider({max}) {
    const { locale } = this.context
    const title = msgs.get('overview.impacted.controls.slider', locale)
    return (
      <div className='card-slider' >
        <Slider
          id={'slider'}
          name={title}
          ariaLabelInput={title}
          value={max}
          labelText={title}
          min={1}
          max={max}
          onChange={this.onSliderChange}
          hideTextInput
        />
      </div>
    )
  }

  renderRadar({radarData}) {
    const { locale } = this.context
    const { showControls } = this.state
    if (radarData.variables.length>showControls) {
      radarData.variables = radarData.variables.slice(0, showControls)
    }
    let domainMax = 0
    const variableMap = _.keyBy(radarData.variables, 'key')
    radarData.sets.forEach(({values})=>{
      Object.entries(values).forEach(([k, v]) => {
        if (variableMap[k]) {
          domainMax = Math.max(domainMax, v)
        }
      })
    })
    domainMax = Math.max(10, Math.ceil(domainMax*1.2))
    const noOverlapTitle = msgs.get('overview.impacted.no.overlap.title', locale)
    const noOverlapInfo = msgs.get('overview.impacted.no.overlap', locale)
    return (
      <div className='card-radar-container' >
        <div className='card-radar' ref={this.fixRadar}>
          {radarData.variables.length>0 ? <Radar
            width={500}
            height={500}
            padding={70}
            domainMax={domainMax}
            highlighted={null}
            style={{
              ringColor: $grcColorRadarRing,
              customColors: [
                $grcColorRadarBlue,
                $grcColorRadarGreen,
              ]
            }}
            axisLabelTextStyle={{
              fontSize: '0.875rem',
              color: '#171717',
            }}
            onHover={(point) => {
              if (point) {
                this.openTooltip(point)
              } else {
                this.closeTooltip()
              }
            }
            }
            data={radarData}
          />
            : <NoResource
              title={noOverlapTitle}
              detail={noOverlapInfo}
              svgName={'no-impacted-controls-overlap.svg'}
              alt={noOverlapTitle}>
            </NoResource>}
        </div>
      </div>
    )
  }

  setDropdown = ref => {
    this.dropdownRef = ref
    this.fixDropdown()
  }

  getSelectionLabel = (standardsChoice) => {
    const { locale } = this.context
    const { activeFilters: {standards:filteredStandards=new Set()} } = this.props
    const allLabel = filteredStandards.size>1 ?
      msgs.get('overview.impacted.controls.filtered', locale) :
      msgs.get('overview.impacted.controls.all', locale)
    return standardsChoice==='ALL' ? allLabel : standardsChoice
  }

  fixDropdown = () => {
    if (this.dropdownRef) {
      // tooltip on dropdown is hardcoded
      const { locale } = this.context
      const title = this.dropdownRef.querySelector('title')
      if (title) {
        title.innerHTML = msgs.get('choose.standard', locale)
      }

      // make sure editbox is the selected choice
      if (this.cardData) {
        const {standardsChoice} = this.cardData
        const choice = this.dropdownRef.querySelector('span')
        if (choice) {
          choice.innerHTML = this.getSelectionLabel(standardsChoice)
        }
      }

      if (!this.observer) {
        const dropdown = this.dropdownRef.querySelector('.bx--dropdown')
        this.observer = new MutationObserver(() => {
          const { activeFilters: {standards:filteredStandards=new Set()} } = this.props
          const items = Array.from(this.dropdownRef.querySelectorAll('.bx--list-box__menu-item'))
          items.forEach((item, idx)=>{
            const {innerHTML} = item
            let disabled = filteredStandards.size>0 &&
              !filteredStandards.has(innerHTML)
            if (disabled && filteredStandards.size>1 && idx===0) {
              disabled = false
            }
            item.classList.toggle('disabled', disabled)
          })
        })
        this.observer.observe(dropdown, {
          childList: true
        })
      }

    } else if (this.observer) {
      this.observer.disconnect()
      delete this.observer
    }
  }

  openTooltipLink = link => {
    if (this.props.history && this.props.location) {
      const pathPrefix = this.props.location.pathname.trim()
      const slash = pathPrefix.substr(-1) === '/' ? '' : '/'
      this.props.history.push(`${this.props.location.pathname}${slash}${link}`)
    }
  }

  //this funcation modified tooltip after rendering to make link clcikable/pressable
  fixTooltipDrilldown = () => {
    const openedTooltipLinksArray = document.getElementsByClassName('tool-tip-drill-down-link')
    if (openedTooltipLinksArray && openedTooltipLinksArray.length >= 1) {
      Array.from(openedTooltipLinksArray).forEach((openedTooltipLink) => {
        openedTooltipLink.tabIndex=0 // make drill down links keyboard accessible
        const link = openedTooltipLink.getAttribute('link')
        if (link && link.length > 0) {
          //open drill down link by press enter key
          window.removeEventListener('keydown', openedTooltipLink)
          openedTooltipLink.addEventListener('keydown', (e)=>{
            const evt = e || window.event
            if ((evt.key === 'Enter' || evt.keyCode === 13) && this.props.history && this.props.location) {
              this.openTooltipLink(openedTooltipLink.getAttribute('link'))
            }
          })
          //open drill down link by mouse click
          window.removeEventListener('click', openedTooltipLink)
          openedTooltipLink.addEventListener('click', ()=>{
            if (this.props.history && this.props.location) {
              this.openTooltipLink(openedTooltipLink.getAttribute('link'))
            }
          })
        }
      })
      const lastTooltipLink = openedTooltipLinksArray[openedTooltipLinksArray.length-1]
      // when last link on tooltip, prevent default Tab key otherwise will navi to webbrowser address bar
      window.removeEventListener('keydown', lastTooltipLink)
      lastTooltipLink.addEventListener('keydown', (e)=>{
        const evt = e || window.event
        if (evt.key === 'Tab' || evt.keyCode === 9) {
          evt.preventDefault()
          openedTooltipLinksArray[0].focus()
        }
      })
    }
  }

  // modify behaviour of react-d3-radar
  // (without modifying the code)
  // here renderToStaticMarkup in getTooltipHTML creates static html first,
  // then fixRadar function addes events onto static html later
  fixRadar = ref => {
    this.radarRef = ref
    if (this.radarRef) {
      // don't show fill in radar rings
      Array.from(this.radarRef.querySelectorAll('circle')).forEach((circle) =>{
        if (circle.getAttribute('r') > 3) {
          circle.setAttribute('fill-opacity', '0')
        } else if (circle.tabIndex!==0 && this.radarRef.querySelector('svg')) {
          const hoverMap = this.radarRef.querySelector('svg').children[0]
          circle.tabIndex = 0 // make point on radar keyboard accessible
          //when point on radar is keyboard focused, simulate clicking event to open tooltip
          window.removeEventListener('focus', circle)
          circle.addEventListener('focus', ()=>{
            clearTimeout(this.timeout)
            const rect = circle.getBoundingClientRect()
            const evt = new MouseEvent('mousemove', {
              bubbles: true,
              cancelable: true,
              view: window,
              clientX: rect.left+2,
              clientY: rect.top+2,
            })
            hoverMap.dispatchEvent(evt)
          })
          //then if also pressing enter key, move current focus on opened tooltip
          window.removeEventListener('keydown', circle)
          circle.addEventListener('keydown', (e)=>{
            const evt = e || window.event
            if (evt.key === 'Enter' || evt.keyCode === 13) {
              this.setState({ tooltipKeyFocus: true })
              const openedTooltip = document.getElementsByClassName('tooltip')[1]
              if (openedTooltip) {
                openedTooltip.focus()
                //add pressing Esc key event to close tooltip and refocus back to point on radar
                window.removeEventListener('keydown', openedTooltip)
                openedTooltip.addEventListener('keydown', (e)=>{
                  const evt = e || window.event
                  if (evt.key === 'Escape' || evt.key === 'Esc' || evt.keyCode === 27) {
                    circle.focus()
                    this.setState({ tooltipKeyFocus: false })
                    this.closeTooltip()
                  }
                })
                //add drill down on tooltip link
                this.fixTooltipDrilldown()
              }
            }
          })
          window.removeEventListener('blur', circle)
          circle.addEventListener('blur', ()=>{
            this.timeout = setTimeout(() => {
              !this.state.tooltipKeyFocus && this.closeTooltip()
            }, 200)
          })
        }
      })

      // wrap labels
      Array.from(this.radarRef.querySelectorAll('text')).forEach((text) =>{
        if (text.getAttribute('text-anchor') === 'middle') {
          // save unwrapped text
          const textContent = text.__textContent || text.textContent
          text.__textContent = textContent
          text = select(text)
          text.text(null)

          // wrap text into tspans
          let line = []
          let lineNumber = 0
          let isMultiLined = false
          const lineHeight = 1.1
          const x = text.attr('x')
          const y = text.attr('y')
          const dy = parseFloat(text.attr('dy'))
          let tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em')
          const words = textContent.split(/\s+/).reverse()
          while (words.length>0) {
            const word = words.pop()
            line.push(word)
            tspan.text(line.join(' '))
            if (tspan.node().getComputedTextLength() > 60) {
              line.pop()
              tspan.text(line.join(' '))
              line = [word]
              ++lineNumber
              tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', lineNumber * lineHeight + dy + 'em').text(word)
              isMultiLined = true
            }
          }

          // if wrap resulted in multiple lines, move entire label up
          if (isMultiLined) {
            text.selectAll('tspan').attr('y', y-10)
          }
        }
      })

      // close tooltip if exiting entire radar map
      window.removeEventListener('mouseout', this.radarRef)
      this.radarRef.addEventListener('mouseout', e=>{
        if (e.target.tagName==='svg' ) {
          this.closeTooltip()
        }
      })
    }
  }

  openTooltip = ({x, y, setKey, variableKey}) => {
    const tooltipHTML = this.getTooltipHTML(setKey, variableKey)
    if (tooltipHTML) {
      tooltip.style('display', undefined)
      tooltip.transition()
        .delay(200)
        .duration(100)
        .style('opacity', 1)
      tooltip.html(()=>{
        return tooltipHTML
      })
        .styles((d, j, ts)=>{
          const tooltipDiv = ts[j]
          const {width} = tooltipDiv.getBoundingClientRect()
          const height = tooltip.node().getBoundingClientRect().height
          const dot = this.getDotMap()[`${x}&${y}`].getBoundingClientRect()
          const top = dot.y + window.scrollY - height - 6
          const left = dot.x + window.scrollX - width/2 + 3
          return {
            'top': top + 'px',
            'left': left + 'px',
          }
        })

      //add drill down on tooltip link
      this.fixTooltipDrilldown()
    } else {
      tooltip.style('display', 'none')
    }
  }

  getDotMap() {
    if (!this.dotMap) {
      this.dotMap = {}
      if (this.radarRef) {
        Array.from(this.radarRef.querySelectorAll('circle')).forEach((circle) =>{
          if (circle.getAttribute('r') === '3') {
            // radar onhover supplies cx,cy of dot
            // create map to get current client bounds to position tooltip
            this.dotMap[`${circle.getAttribute('cx')}&${circle.getAttribute('cy')}`] = circle
          }
        })
      }
    }
    return this.dotMap
  }

  closeTooltip = () => {
    tooltip.transition()
      .duration(100)
      .style('opacity', 0)
      .on('end', ()=>{
        tooltip.style('display', 'none')
      })
  }

  getTooltipHTML = (setKey, variableKey) => {
    const { locale } = this.context
    const { setMap, variableMap, tooltips } = this.cardData
    const tooltipList = tooltips[setKey][variableKey]
    return tooltipList ? ReactDOMServer.renderToStaticMarkup(
      <div className='tooltip-text'>
        <div className='header'>
          <div className='title'>{setMap[setKey].label.toUpperCase()}</div>
          <div className='variable'>
            <div className={`legend ${setMap[setKey].className}`} />
            {variableMap[variableKey].label}
          </div>
        </div>
        <div className='findings'>
          {tooltipList.map(({count, findingType}) => {
            let label, className = ''
            switch (findingType) {
            case SECURITY_TYPES.HIGH:
            default:
              label = msgs.get('overview.recent.activity.severity.high', locale)
              className = 'high'
              break
            case SECURITY_TYPES.MEDIUM:
              label = msgs.get('overview.recent.activity.severity.medium', locale)
              className = 'medium'
              break
            case SECURITY_TYPES.LOW:
              label = msgs.get('overview.recent.activity.severity.low', locale)
              className = 'low'
              break
            case SECURITY_TYPES.VIOLATIONS:
              label = msgs.get('overview.recent.activity.finding.type.violations', locale)
              className = 'high'
              break
            }
            let page = ''
            const paraURL = {}
            switch(setMap[setKey].label.toUpperCase()) {
            case 'POLICY VIOLATIONS':
            default:
              page = 'all'
              paraURL.index = 0
              break
            case 'SECURITY FINDINGS':
              page = 'findings'
              paraURL.index = 0
              //Here we can't directly set GRC_FILTER_STATE_COOKIE, 'severity', if so then loop will store
              //all possible severity level rather than the clicked one. URL para seems the only solution
              paraURL.severity = _.startCase(className.toLowerCase())
              break
            }
            if(variableMap[variableKey].label){
              paraURL.filters = `{"textsearch":["${variableMap[variableKey].label}"]}`
            }
            const toolTipDrillDownURL = `${page}?${queryString.stringify(paraURL)}`
            if (count > 0) {
              //tool-tip-drill-down-link only accessible when tooltip keyboard focused and press enter key
              return (
                <div className='tool-tip-strip tool-tip-drill-down-link' link={toolTipDrillDownURL} key={findingType} tabIndex={-1} >
                  <div key={findingType} className={`finding ${className} link`} >
                    <div className='count'>{count}</div>
                    <div className='severity'>{label}</div>
                  </div>
                </div>
              )
            } else {
              return (
                <div className='tool-tip-strip' key={findingType}>
                  <div key={findingType} className={`finding ${className}`} >
                    <div className='count'>{count}</div>
                    <div className='severity'>{label}</div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    ) : null
  }

  getCardData = () => {
    const { policies, findings, showFindings } = this.props
    const { activeFilters: {standards:filteredStandards=new Set()} } = this.props
    const { availableFilters: {standards: {availableSet:availableStandards}} } = this.props
    let {viewState: {standardsChoice='ALL'}} = this.props

    // loop thru policies to get violations
    const violations = []
    policies.map(policy=>{
      const statuses = _.get(policy, 'raw.status.status', {})
      Object.keys(statuses).forEach(key=>{
        const compliant = statuses[key].compliant
        if (!compliant || compliant.toLowerCase()==='noncompliant') {
          violations.push({
            metadata: _.get(policy, 'raw.metadata', {}),
            cluster: key
          })
        }
      })
    })

    // adjust selections based on filter bar
    const selectionData = ['ALL', ...Array.from(availableStandards)]
    // if current choice isn't available, change to first avaiable choice
    if (filteredStandards.size!==0 && !filteredStandards.has(standardsChoice)) {
      // if only one choice, make that the selection
      if (filteredStandards.size===1) {
        standardsChoice = Array.from(filteredStandards)[0]
      } else {
        // else use all
        standardsChoice = 'ALL'
      }
    }

    const controlLabels = {}
    const violationsByControls = {}
    const policyTooltips = {}
    const regexAllSpaces = / +/g
    violations.forEach(policy=>{
      const annotations = _.get(policy, 'metadata.annotations', {})
      const controls = _.get(annotations, 'policies.open-cluster-management.io/controls', 'other')
      const standards = _.get(annotations, 'policies.open-cluster-management.io/standards', 'other').trim().toLowerCase()
      const standardsSet = new Set(standards.split(','))//deal with multi standards separated by comma
      controls.split(',').forEach(control => {
        const label = _.startCase(control.trim())
        const ctrl = control.toLowerCase().trim()
        controlLabels[ctrl] = label
        const standardsChoiceStr = standardsChoice.trim().toLowerCase().replace(regexAllSpaces, '-')
        if (ctrl && (standardsChoice === 'ALL' || standardsSet.has(standardsChoiceStr))) {
          violationsByControls[ctrl] = _.get(violationsByControls, ctrl, 0)+1
          policyTooltips[ctrl] = _.get(policyTooltips, ctrl, [{count: 0, findingType: SECURITY_TYPES.VIOLATIONS},])
          policyTooltips[ctrl][0].count = policyTooltips[ctrl][0].count+1
        }
      })
    })

    const findingsByControls = {}
    const findingsTooltips = {}
    findings.forEach(finding=>{
      const controls = _.get(finding, 'securityClassification.securityControl', 'other')
      controls.split(',').forEach(control => {
        const label = _.startCase(control.trim())
        const ctrl = control.toLowerCase().trim()
        controlLabels[ctrl] = label
        if (ctrl && (standardsChoice === 'ALL' ||
            _.get(finding, 'securityClassification.securityStandards', ['other']).join(',').toLowerCase().includes(standardsChoice.toLowerCase()))
        ) {
          findingsByControls[ctrl] = _.get(findingsByControls, ctrl, 0)+1
          findingsTooltips[ctrl] = _.get(findingsTooltips, ctrl, [
            {count: 0, findingType: SECURITY_TYPES.HIGH},
            {count: 0, findingType: SECURITY_TYPES.MEDIUM},
            {count: 0, findingType: SECURITY_TYPES.LOW},
          ])
          switch (_.get(finding, 'finding.severity', 'high').toLowerCase()) {
          case SECURITY_TYPES.LOW.toLowerCase():
            findingsTooltips[ctrl][2].count = findingsTooltips[ctrl][2].count+1
            break
          case SECURITY_TYPES.MEDIUM.toLowerCase():
            findingsTooltips[ctrl][1].count = findingsTooltips[ctrl][1].count+1
            break
          default:
            findingsTooltips[ctrl][0].count = findingsTooltips[ctrl][0].count+1
          }
        }
      })
    })

    let variables =[]
    Object.keys(violationsByControls).forEach(key=> {
      key = key.toLowerCase()
      variables.push({key, label: controlLabels[key]})
    })
    Object.keys(findingsByControls).forEach(key=> {
      key = key.toLowerCase()
      variables.push({key, label: controlLabels[key]})
    })

    // create unique controls
    // only show controls that have both violations and findings
    variables = _.uniqWith(variables, _.isEqual)
      .filter(({key})=>{
        if( showFindings === false){
          return violationsByControls[key]
        }
        else{
          return violationsByControls[key] && findingsByControls[key]
        }
      })

    // create radar data
    variables.forEach(({key})=>{
      violationsByControls[key] = _.get(violationsByControls, key, 0)
      findingsByControls[key] = _.get(findingsByControls, key, 0)
    })
    const radarData = {
      variables,
      sets: [
        {
          key: 'policy',
          color: $grcColorRadarGreen,
          className: 'policies',
          label: 'Policy violations',
          values: violationsByControls,
        },
        {
          key: 'findings',
          color: $grcColorRadarBlue,
          className: 'findings',
          label: 'Security findings',
          values: findingsByControls,
        },
      ],
    }
    const tooltips = {
      findings: findingsTooltips,
      policy: policyTooltips,
    }

    return {
      standardsChoice,
      selectionData,
      radarData,
      tooltips,
      setMap: _.keyBy(radarData.sets, 'key'),
      variableMap: _.keyBy(radarData.variables, 'key'),
    }
  }

  onSelectionChange = (e) => {
    const {selectedItem: {value}} = e
    this.props.updateViewState({standardsChoice: value})
  }

  onSliderChange = (e) => {
    const {value} = e
    this.props.updateViewState({showControls: value})
    this.setState(()=>{
      return {showControls: value}
    })
  }

}

ImpactedControlsModule.propTypes = {
  activeFilters: PropTypes.object,
  availableFilters: PropTypes.object,
  findings: PropTypes.array,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  policies: PropTypes.array,
  showFindings: PropTypes.bool,
  updateViewState: PropTypes.func,
  viewState: PropTypes.object,
}

export default withRouter(ImpactedControlsModule)

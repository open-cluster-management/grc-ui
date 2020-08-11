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
import { connect } from 'react-redux'
import _ from 'lodash'
import { Breadcrumb, Button, Tabs, Tab, TooltipIcon } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderLinks = this.renderLinks.bind(this)

    this.state = {
      shadowPresent: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }

  listenToScroll = () => {
    if (window.scrollY > .1 && this.state.shadowPresent === false) {
      this.setState({shadowPresent:true})
    }
    else if (window.scrollY <= .1 && this.state.shadowPresent === true) {
      this.setState({shadowPresent:false})
    }
  }

  render() {
    const { tabs, title, breadcrumbItems, links, description, location } = this.props
    const { locale } = this.context
    const displayType = location.pathname.split('/').pop()
    let showCreationLink
    switch(displayType) {
    case 'all':
    default:
      showCreationLink = true
      break
    case 'findings':
      showCreationLink = false
      break
    }
    if ((tabs && tabs.length > 0) || (breadcrumbItems && breadcrumbItems.length > 0)) {
      const midName = (!location.pathname.startsWith('/multicloud/policies/all/') ? 'secondary-header-grc-overview' : '')
      return (
        <div className='secondary-header-wrapper' role='region' aria-label={title}>
          <div className={`secondary-header ${midName} simple-header${this.state.shadowPresent ? '-with-shadow' : ''}${description ? ' special-layout': ''}`
          }>
            <header aria-label={`Heading: ${title}`}>
              <div className="bx--detail-page-header-content">
                {breadcrumbItems &&
                  (
                    <Breadcrumb>
                      {this.renderBreadCrumb()}
                    </Breadcrumb>
                  )
                }
                {this.renderHeader()}
                {tabs && tabs.length > 0 &&
                  <Tabs selected={this.getSelectedTab() || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
                    {this.renderTabs()}
                  </Tabs>
                }
              </div>
            </header>
          </div>
          {showCreationLink && links && links.length>0 &&
            <div className='secondary-header-links'>
              {this.renderLinks()}
            </div>
          }
        </div>
      )
    } else {
      return (
        <div className='secondary-header-wrapper-min' role='region' aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
          <div className='secondary-header simple-header'>
            <h1 className='bx--detail-page-header-title'>{decodeURIComponent(title)}</h1>
          </div>
        </div>
      )
    }
  }

  renderHeader() {
    const { title:headerTitle, description, information, links=[] } = this.props
    if (description) {
      /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
      return (
        <div className="bx--detail-page-header-title-container">
          <h1 className="bx--detail-page-header-title">{headerTitle}</h1>
          <div className="detail-page-header-title-button" onClick={description.action}><p>{description.display}</p></div>
        </div>
      )
    } else {
      return (
        <div className="bx--detail-page-header-title-container">
          <h1 className="bx--detail-page-header-title">{headerTitle}</h1>
          {information &&
            <TooltipIcon align='end' tooltipText={information}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          }
          {links && links.map(link => {
            const {id, kind, title:linkTitle } = link
            // if portal, react component will create the button using a portal
            if (kind==='portal' && linkTitle) {
              return <div key={id} id={id} className='portal' />
            } else {
              return null
            }})}
        </div>
      )
    }
  }

  renderBreadCrumb() {
    const { locale } = this.context
    const { breadcrumbItems } = this.props
    return breadcrumbItems && breadcrumbItems.map((breadcrumb, index) => {
      const key = `${breadcrumb.id}-${index}`
      const noLocale = _.get(breadcrumb, 'noLocale', false)
      return (
        <div key={key} className='bx--breadcrumb-item' title={decodeURIComponent(breadcrumb.label)}>
          {breadcrumb.handleClick ?
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div className='breadcrumb-link' onClick={breadcrumb.handleClick} >{msgs.get(breadcrumb.label, locale)}</div> :
            <Link to={breadcrumb.url || ''} className='bx--link'>{noLocale ? breadcrumb.label : msgs.get(breadcrumb.label, locale)}</Link>}
        </div>
      )
    })
  }

  renderTabs() {
    const { tabs } = this.props,
          { locale } = this.context
    return tabs.map(tab => {
      return <Tab label={msgs.get(tab.label, locale)} key={tab.id} id={tab.id} href={tab.url} onClick={tab.handleClick ? tab.handleClick : this.clickTab.bind(this, tab.url)} />
    })
  }

  renderLinks() {
    const { links } = this.props,
          { locale } = this.context
    return links.map(link => {
      const {id, label, url, kind='primary', handleClick=(()=> this.props.history.push(url)) } = link
      // if portal, react component will create the button using a portal
      if (kind==='portal') {
        return <div key={id} id={id} className='portal' />
      }
      return <Button key={id} id={id} onClick={handleClick} kind={kind} >
        {msgs.get(label, locale)}
      </Button>
    })
  }

  getSelectedTab() {
    const { tabs, location } = this.props
    const selectedTab = tabs.map((tab, index) => {
      tab.index = index
      return tab
    }).filter((tab, index) => {
      if (index !== 0) {
        return location.pathname.startsWith(tab.url)
      }
      return undefined
    })
    return selectedTab[0] && selectedTab[0].index
  }

  clickTab(url) {
    this.props.history.push(url)
    return url
  }
}

SecondaryHeader.contextTypes = {
  locale: PropTypes.string
}

SecondaryHeader.propTypes = {
  breadcrumbItems: PropTypes.array,
  description: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  history: PropTypes.object.isRequired,
  information: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  links: PropTypes.array,
  location: PropTypes.object,
  tabs: PropTypes.array,
  title: PropTypes.string,
}

const mapStateToProps = (state) => {
  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    refresh: state.secondaryHeader.refresh,
    role: state.role && state.role.role,
    description: state.secondaryHeader.description,
    information: state.secondaryHeader.information,
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))

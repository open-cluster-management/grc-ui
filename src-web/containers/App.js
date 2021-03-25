/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import resources from '../../lib/shared/resources'
resources(() => {
  require('../../scss/common.scss')
})
import PropTypes from 'prop-types'
// without curly braces means component with redux
// eslint-disable-next-line import/no-named-as-default
import SecondaryHeader from '../components/modules/SecondaryHeader'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import client from '../../lib/shared/client'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'
import GrcRouter from './GrcRouter'
import loadable from '@loadable/component'
import { LocaleContext } from '../components/common/LocaleContext'
import { AcmHeader, AcmRoute } from '@open-cluster-management/ui-components'
import WelcomeStatic from './Welcome'
import GrcApolloClient from '../../lib/client/apollo-client'
import { userAccessSuccess } from '../actions/access'
import { connect } from 'react-redux'

export const ResourceToolbar = loadable(() => import(/* webpackChunkName: "ResourceToolbar" */ '../components/common/ResourceToolbar'))

class App extends React.Component {

  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object,
    url: PropTypes.string,
  }

  constructor(props) {
    super(props)
    if (client && document.getElementById('propshcm')) {
      this.serverProps = JSON.parse(document.getElementById('propshcm').textContent)
    }
  }

  getServerProps() {
    if (client) {
      return this.serverProps
    }
    return this.props.staticContext
  }

  componentDidMount() {
    GrcApolloClient.getUserAccess().then((response) => {
      this.props.updateUserAccess(response.data.items)
    })
  }

  render() {
    const serverProps = this.getServerProps()
    const { match } = this.props
    return (
      <LocaleContext.Provider value={serverProps.context}>
        <div className='expand-vertically'>
          <SecondaryHeader />
          <ResourceToolbar />
          <Switch>
            <Route path={`${match.url}`} render={() => <GrcRouter />} />
            <Redirect to={`${config.contextPath}`} />
          </Switch>
          <Modal locale={serverProps.context.locale} />
        </div>
      </LocaleContext.Provider>
    )
  }
}

App.propTypes = {
  updateUserAccess: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserAccess: (access) => dispatch(userAccessSuccess(access))
  }
}

const AppWithUserAccess = withRouter(connect(null, mapDispatchToProps)(App))

const getAcmRoute = (props) => {
  let path = ''
  if (client) {
    path = window.location.pathname
  } else {
    path = props.url
  }
  if (path.includes(config.contextPath)) {
    return AcmRoute.GovernRisk
  }
  return AcmRoute.Welcome
}

// eslint-disable-next-line react/display-name
export default props => (
  // eslint-disable-next-line react/prop-types
  <AcmHeader route={getAcmRoute(props)} >
    <Route path={config.contextPath} serverProps={props} component={AppWithUserAccess} />
    <Route path={'/multicloud/welcome'} serverProps={props} component={WelcomeStatic} />
  </AcmHeader>
)

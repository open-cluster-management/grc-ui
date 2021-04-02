
/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import resources from '../../lib/shared/resources'
resources(() => {
  require('../../scss/common.scss')
})
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import client from '../../lib/shared/client'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'
import GrcRouter from './GrcRouter'
import AllPolicies from './AllPolicies'
import PolicyDetailSubRouter from './PolicyDetailSubRouter'
import { LocaleContext } from '../components/common/LocaleContext'
import { AcmHeader, AcmRoute } from '@open-cluster-management/ui-components'
import WelcomeStatic from './Welcome'
import { getUserAccessData } from '../actions/access'
import { connect } from 'react-redux'

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
    this.props.getUserAccess()
  }

  render() {
    const serverProps = this.getServerProps()
    const { match } = this.props
    return (
      <LocaleContext.Provider value={serverProps.context}>
        <Switch>
          <Route path="/:url*(/+)" exact strict render={({ location }) => <Redirect to={location.pathname.replace(/\/+$/, '')} />} />
          {/* Removes duplicate slashes in the middle of the URL */}
          <Route path="/:url(.*//+.*)" exact strict render={({ match: { params }})=> <Redirect to={`/${params.url.replace(/\/\/+/, '/')}`} />} />
          <Route path={`${match.url}/all/:namespace/:name/:tab`} exact>
            <PolicyDetailSubRouter />
          </Route>
          <Route path={`${match.url}/all`} exact>
            <AllPolicies />
          </Route>
          <Route path={`${match.url}`} render={() => <GrcRouter />} />
          <Redirect to={`${config.contextPath}/all`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
      </LocaleContext.Provider>
    )
  }
}

App.propTypes = {
  getUserAccess: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAccess: () => dispatch(getUserAccessData())
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
    return AcmRoute.RiskAndCompliance
  }
  return AcmRoute.Welcome
}

// eslint-disable-next-line react/display-name
export default props => (
  <AcmHeader route={getAcmRoute(props)} >
    <Route path={config.contextPath} serverProps={props} component={AppWithUserAccess} />
    <Route path={'/multicloud/welcome'} serverProps={props} component={WelcomeStatic} />
  </AcmHeader>
)

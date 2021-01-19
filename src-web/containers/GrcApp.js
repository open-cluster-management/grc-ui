/* eslint-disable import/no-named-as-default */
/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import SecondaryHeader from '../components/modules/SecondaryHeader'
import ResourceToolbar from '../components/common/ResourceToolbar'
import { Route, Switch, Redirect } from 'react-router-dom'
import client from '../../lib/shared/client'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'
import GrcRouter from './GrcRouter'
import { LocaleContext } from '../components/common/LocaleContext'

export default class GrcApp extends React.Component {

  static propTypes = {
    match: PropTypes.object,
    staticContext: PropTypes.object,
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

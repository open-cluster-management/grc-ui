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

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import App from './containers/App'
import * as reducers from './reducers'
import config from '../lib/shared/config'
import GrcApolloClient from '../lib/client/apollo-client'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const loggerMiddleware = createLogger()
// Grab the state from a global variable injected into the server-generated HTML

const middleware = [thunkMiddleware] // lets us dispatch() functions
if (!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && config['featureFlags:reduxLogger']) {
  middleware.push(loggerMiddleware) // middleware that logs actions
}

// Create Redux store with initial state
const store = createStore(combineReducers(reducers), composeEnhancers(
  applyMiddleware(...middleware)
))

render(
  <ApolloProvider client={GrcApolloClient.getGrcClient()}>
    <Provider store={store}>
      <BrowserRouter>
        <App url={window.location.pathname} />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
  , document.getElementById('page')
)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PolicyDetailsTab from '../../../src-web/containers/PolicyDetailsTab'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'

describe('PolicyDetailsTab container test', () => {
  it('renders as expected with access', () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const userAccess = [
      {
        namespace: 'default',
        rules: {
          '*/*': [
            '*'
          ]
        }
      }
    ]
    const component = mount(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsTab userAccess={userAccess} />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(toJson(component.find(PolicyDetailsTab))).toMatchSnapshot()
  })
  it('renders as expected with access', () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = mount(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsTab />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(toJson(component.find(PolicyDetailsTab))).toMatchSnapshot()
  })
})

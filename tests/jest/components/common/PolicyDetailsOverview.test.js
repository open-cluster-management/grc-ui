/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { PolicyDetailsOverview } from '../../../../src-web/components/common/PolicyDetailsOverview'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { staticResourceDataPolicyOverview, itemPolicyOverview } from './CommonTestingData'

describe('PolicyDetailsOverview component', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const location = {
      'pathname': '/multicloud/policies/policy/cluster1/1569249226915-policy-test',
      'search': '',
      'hash': '',
      'key': 'q1uagn'
    }
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const refreshControl = {
      'reloading': false,
      'refreshCookie': 'grc-refresh-interval-cookie',
      'timestamp': 'Tue Sep 24 2019 09:56:26 GMT-0400 (Eastern Daylight Time)'
    }
    const component = renderer.create(
      <ApolloProvider client={apolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              item={itemPolicyOverview}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('PolicyDetailsOverview component', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const location = {
      'pathname': '/multicloud/policies/policy/cluster1/1569249226915-policy-test',
      'search': '',
      'hash': '',
      'key': 'q1uagn'
    }
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const refreshControl = {
      'reloading': false,
      'refreshCookie': 'grc-refresh-interval-cookie',
      'timestamp': 'Tue Sep 24 2019 09:56:26 GMT-0400 (Eastern Daylight Time)'
    }
    const component = renderer.create(
      <ApolloProvider client={apolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              item={null}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('PolicyDetailsOverview component', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const location = {
      'pathname': '/multicloud/policies/policy/cluster1/1569249226915-policy-test',
      'search': '',
      'hash': '',
      'key': 'q1uagn'
    }
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const refreshControl = {
      'reloading': false,
      'refreshCookie': 'grc-refresh-interval-cookie',
      'timestamp': 'Tue Sep 24 2019 09:56:26 GMT-0400 (Eastern Daylight Time)'
    }
    const component = renderer.create(
      <ApolloProvider client={apolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetailsOverview
              item={['','','','']}
              updateResourceToolbar={jest.fn()}
              staticResourceData={staticResourceDataPolicyOverview}
              location={location}
              resourceType={resourceType}
              refreshControl={refreshControl}
              error={null}
              loading={false}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})


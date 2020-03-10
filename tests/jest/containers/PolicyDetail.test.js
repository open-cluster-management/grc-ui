/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PolicyDetail from '../../../src-web/containers/PolicyDetail'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apolloClient from '../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'

describe('PolicyTemplateTab container test', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const location = {
      'pathname': '/multicloud/policies/all/1570049336008-policy-test',
      'search': '',
      'hash': '',
      'key': 'ngh5of'
    }
    const match = {
      'path': '/multicloud/policies/all/:name',
      'url': '/multicloud/policies/all/1570049336008-policy-test',
      'isExact': true,
      'params': {
        'name': '1570049336008-policy-test'
      }
    }
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const tabs = [
      'detail',
      'violation',
      'yaml'
    ]
    const updateSecondaryHeader = jest.fn()
    const component = renderer.create(
      <ApolloProvider client={apolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyDetail
              match={match}
              location={location}
              resourceType={resourceType}
              tabs={tabs}
              updateSecondaryHeader={updateSecondaryHeader}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

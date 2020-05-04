/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PolicyClusterDetail from '../../../../src-web/components/common/PolicyClusterDetail'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'

describe('PolicyClusterDetail component', () => {
  it('renders as expected', () => {
    const updateSecondaryHeader = jest.fn()
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
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <PolicyClusterDetail
              location={location}
              params={{}}
              resourceType={resourceType}
              updateSecondaryHeader={updateSecondaryHeader}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

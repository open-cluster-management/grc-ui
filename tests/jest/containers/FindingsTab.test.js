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
import {FindingsTab} from '../../../src-web/containers/FindingsTab'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import { findingsData } from './ContainersTestingData'

describe('FindingsTab container test', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const secondaryHeaderProps = {
      'title': 'routes.create.policy',
      'information': 'policy.create.tooltip',
      'breadcrumbItems': [
        {
          'id': 'policy-overview',
          'label': 'routes.grc',
          'url': '/multicloud/policies'
        },
        {
          'id': 'policy-overview-all',
          'label': 'routes.policies',
          'url': '/multicloud/policies/all'
        }
      ]
    }
    const updateSecondaryHeader= jest.fn()
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <FindingsTab
              secondaryHeaderProps={secondaryHeaderProps}
              updateSecondaryHeader={updateSecondaryHeader}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})


describe('FindingsTab container formatEmptySecurityClassification test', () => {
  it('renders as expected', () => {
    const secondaryHeaderProps = {
      'title': 'routes.create.policy',
      'information': 'policy.create.tooltip',
      'breadcrumbItems': [
        {
          'id': 'policy-overview',
          'label': 'routes.grc',
          'url': '/multicloud/policies'
        },
        {
          'id': 'policy-overview-all',
          'label': 'routes.policies',
          'url': '/multicloud/policies/all'
        }
      ]
    }
    const updateSecondaryHeader= jest.fn()
    const component = shallow(
      <FindingsTab
        secondaryHeaderProps={secondaryHeaderProps}
        updateSecondaryHeader={updateSecondaryHeader}
      />
    )
    expect(component.instance().formatEmptySecurityClassification(null)).toMatchSnapshot()

    expect(component.instance().formatEmptySecurityClassification(findingsData)).toMatchSnapshot()
  })
})


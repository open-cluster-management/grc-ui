/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { mount, render } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import toJson from 'enzyme-to-json'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import MockDate from 'mockdate'

import * as reducers from '../../../src-web/reducers'
import AcmGrcPage from '../../../src-web/containers/AcmGrcPage'
import { ALL_POLICIES } from '../../../lib/client/queries'
import ALL_POLICIES_QUERY_DATA from './ALL_POLICIES_QUERY_DATA'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleware = [thunkMiddleware]
const store = createStore(combineReducers(reducers), composeEnhancers(
  applyMiddleware(...middleware)
))

const props = { userAccess: [], locale: 'en' }

describe('AcmGrcPage container', () => {
  it('should render loading spinner', () => {
    const mocks = []
    MockDate.set('2021-01-01')
    const component = render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AcmGrcPage type='ALL_POLICIES' {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Provider>
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render ALL_POLICIES page ', async () => {
    const mocks = [
      {
        request: {
          query: ALL_POLICIES,
        },
        result: {
          data: ALL_POLICIES_QUERY_DATA.data
        },
      },
    ]
    const component = mount(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AcmGrcPage type='ALL_POLICIES' {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Provider>
    )

    await new Promise(resolve => setTimeout(resolve, 0))
    MockDate.set('2021-01-01')
    component.update()
    expect(toJson(component)).toMatchSnapshot()
  })
})

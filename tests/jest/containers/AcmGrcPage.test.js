/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import toJson from 'enzyme-to-json'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { advanceBy, advanceTo, clear } from 'jest-date-mock'

import * as reducers from '../../../src-web/reducers'
import AcmGrcPage from '../../../src-web/containers/AcmGrcPage'
import { ALL_POLICIES, POLICY_STATUS, POLICY_STATUS_HISTORY, POLICY_TEMPLATE_DETAILS } from '../../../lib/client/queries'
import ALL_POLICIES_QUERY_DATA from './ALL_POLICIES_QUERY_DATA'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleware = [thunkMiddleware]
const store = createStore(combineReducers(reducers), composeEnhancers(
  applyMiddleware(...middleware)
))

const props = { userAccess: [], locale: 'en' }

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    companyId: 'company-id1',
    teamId: 'team-id1',
  }),
  useHistory: () => ({ url: '/company/company-id1/team/team-id1' }),
}))

describe('AcmGrcPage container', () => {
  it('should render loading spinner', () => {
    advanceTo(new Date(2021, 5, 27, 0, 0, 0))
    const mocks = []
    const component = mount(
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
    advanceTo(new Date(2021, 5, 27, 0, 0, 0))
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
    component.update()
    expect(toJson(component)).toMatchSnapshot()
  })
})

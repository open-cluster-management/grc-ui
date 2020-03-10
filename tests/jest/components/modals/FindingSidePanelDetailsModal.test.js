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
import FindingSidePanelDetailsModal from '../../../../src-web/components/modals/FindingSidePanelDetailsModal'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { findingsSidePanelData, resourceType } from './ModalsTestingData'

describe('FindingSidePanelDetailsModal', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const location = {
      'href': 'https://localhost:3000/multicloud/policies/findings',
      'ancestorOrigins': {},
      'origin': 'https://localhost:3000',
      'protocol': 'https:',
      'host': 'localhost:3000',
      'hostname': 'localhost',
      'port': '3000',
      'pathname': '/multicloud/policies/findings',
      'search': '',
      'hash': ''
    }
    const history = {}
    const updateModal = jest.fn()
    const component = shallow(
      <BrowserRouter>
        <FindingSidePanelDetailsModal
          data={findingsSidePanelData}
          title={'policy that is not compliant'}
          location={location}
          history={history}
          open={true}
          updateModal={updateModal}
          store={store}
          resourceType={resourceType}
          locale={'en'}
        />
      </BrowserRouter>
    )
    expect(component.instance().render()).toMatchSnapshot()
    expect(component.dive()).toMatchSnapshot()
    expect(component.update()).toMatchSnapshot()
  })
})

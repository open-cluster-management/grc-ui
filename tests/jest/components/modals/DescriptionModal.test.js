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
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import DescriptionModal from '../../../../src-web/components/modals/DescriptionModal'
import { updateModal } from '../../../../src-web/actions/common'
import { shallow } from 'enzyme'

describe('DescriptionModal render test', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const content = 'filler'
    const open = true
    const title = 'filler'
    const wrapper = shallow(
      <Provider store={store}>
        <BrowserRouter>
          <DescriptionModal
            content={content}
            title={title}
            open={open}
            updateModal={updateModal}
          />
        </BrowserRouter>
      </Provider>
    )
    expect(wrapper.instance().render()).toMatchSnapshot()
  })
})

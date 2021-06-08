/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { AnsibleAutomationModal } from '../../../../src-web/components/modals/AnsibleAutomationModal'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { AcmAlert } from '@open-cluster-management/ui-components'
import { Spinner } from '@patternfly/react-core'

// import {
//   disableResourceModalLabels
// } from './ModalsTestingData'
import { REQUEST_STATUS } from '../../../../src-web/actions/index'

describe('AnsibleAutomationModal component', () => {
  it('Disable modal renders as expected', () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = shallow(
      <AnsibleAutomationModal
        type='resource-disable'
        handleClose={jest.fn()}
        handleSubmit={jest.fn()}
        locale={'en'}
        open={true}
        store={store}
      />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('Modal renders without data', () => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = shallow(
      <AnsibleAutomationModal
        label={{}}
        locale={'en'}
        open={true}
        store={store}
      />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('Modal returns spinner when loading', () => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = shallow(
      <AnsibleAutomationModal
        label={{}}
        locale={'en'}
        open={true}
        reqStatus={REQUEST_STATUS.IN_PROGRESS}
        store={store}
      />
    )
    expect(component.find(Spinner)).toHaveLength(1)
    expect(toJson(component)).toMatchSnapshot()
  })

  it('Modal returns notification on error', () => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = shallow(
      <AnsibleAutomationModal
        label={{}}
        locale={'en'}
        open={true}
        reqStatus={REQUEST_STATUS.ERROR}
        reqErrorMsg='There was an error.'
        store={store}
      />
    )
    expect(component.find(AcmAlert)).toHaveLength(1)
    expect(toJson(component)).toMatchSnapshot()
  })
})

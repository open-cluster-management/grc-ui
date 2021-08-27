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
import RemoveResourceModal from '../../../../src-web/components/modals/RemoveResourceModal'
import { mount } from 'enzyme'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { resourceModalData, removeResourceModalLabels } from './ModalsTestingData'
import toJson from 'enzyme-to-json'
import { BrowserRouter } from 'react-router-dom'
import _ from 'lodash'

describe('RemoveResourceModal test', () => {
  it('renders modal without PolicyAutomation as expected', () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalData}
          handleClose={jest.fn()}
          handleSubmit={jest.fn()}
          label={removeResourceModalLabels}
          locale={'en'}
          open={true}
          store={store}
        />
      </BrowserRouter>
    )
    expect(toJson(component.instance())).toMatchSnapshot()
    expect(toJson(component.update())).toMatchSnapshot()
    expect(toJson(component)).toMatchSnapshot()
  })

  it('renders modal with PolicyAutomation as expected', () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const resourceModalDataCopy = _.cloneDeep(resourceModalData)
    resourceModalDataCopy.policyAutomation = {
      'kind': 'PolicyAutomation',
      'apiVersion': 'policy.open-cluster-management.io/v1beta1',
      'metadata': {
        'name': 'policy-auditpolicy-will-sev-policy-automation',
        'namespace': 'default',
        'annotations': {
          'policy.open-cluster-management.io/rerun': 'false'
        },
        'resourceVersion': '195796',
        '__typename': 'Metadata'
      },
      'spec': {
        'automationDef': {
          'name': 'ACM Policy Compliance Template',
          'secret': 'grc-test-1',
          'type': 'AnsibleJob'
        },
        'mode': 'disabled',
        'policyRef': 'policy-auditpolicy-will-sev'
      },
      '__typename': 'PolicyAutomation'
    }
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalDataCopy}
          handleClose={jest.fn()}
          handleSubmit={jest.fn()}
          label={removeResourceModalLabels}
          locale={'en'}
          open={true}
          store={store}
        />
      </BrowserRouter>
    )
    expect(toJson(component.instance())).toMatchSnapshot()
    expect(toJson(component.update())).toMatchSnapshot()
    expect(toJson(component)).toMatchSnapshot()
  })
})

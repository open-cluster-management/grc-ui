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
import { shallow } from 'enzyme'
import { sidePanelPolicies, sidePanelPoliciesAllCompliant,
  sidePanelResourceTypePolicies, sidePanelClusters,
  sidePanelResourceTypeClusters
} from './ModalsTestingData'
import PolicySidePanelDetailsModal, {
  PoliciesTable, ClustersOrApplicationsTable
} from '../../../../src-web/components/modals/PolicySidePanelDetailsModal'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import toJson from 'enzyme-to-json'

describe('PoliciesView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(<PolicySidePanelDetailsModal
      title = {''}
      data = {sidePanelPolicies}
      resourceType = {sidePanelResourceTypePolicies}
      locale = {'en-US'}
      open = {true}
      updateModal = {updateModal}
    />)
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('PoliciesView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(<PolicySidePanelDetailsModal
      title = {''}
      data = {sidePanelPoliciesAllCompliant}
      resourceType = {sidePanelResourceTypePolicies}
      locale = {'en-US'}
      open = {true}
      updateModal = {updateModal}
    />)
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('ClustersView view', () => {
  const updateModal = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(
      <PolicySidePanelDetailsModal
        title = {''}
        data = {sidePanelClusters}
        resourceType = {sidePanelResourceTypeClusters}
        locale = {'en-US'}
        open = {true}
        updateModal = {updateModal}
      />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('PoliciesTable 1', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <PoliciesTable
          items = {sidePanelPolicies}
          staticResourceData = {sidePanelResourceTypePolicies}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('PoliciesTable 2', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <PoliciesTable
          items = {[]}
          staticResourceData = {sidePanelResourceTypePolicies}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('PoliciesTable 3', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <PoliciesTable
          items = {sidePanelPoliciesAllCompliant}
          staticResourceData = {sidePanelResourceTypePolicies}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('ClustersOrApplicationsTable 1', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ClustersOrApplicationsTable
          items = {sidePanelClusters}
          staticResourceData = {sidePanelResourceTypeClusters}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('ClustersOrApplicationsTable 2', () => {
  it('renders expand as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ClustersOrApplicationsTable
          items = {[]}
          staticResourceData = {sidePanelResourceTypeClusters}
          inapplicable = {'N/A'}
        />
      </BrowserRouter>
    )
    expect(component).toMatchSnapshot()
  })
})

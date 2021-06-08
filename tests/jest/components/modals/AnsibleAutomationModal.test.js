/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { AnsibleAutomationModal } from '../../../../src-web/components/modals/AnsibleAutomationModal'
import { shallow } from 'enzyme'


describe('AnsibleAutomationModal test', () => {
  const viewState = {viewState: {grcCardChoice:0}}
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  it('renders expand as expected', () => {
    const component = shallow(
      <AnsibleAutomationModal
        viewState={viewState}
        updateViewState={updateViewState}
        grcItems={policiesTestingDataSet1}
        activeFilters={activeFilters}
        showGrcCard={true}
        displayType = {'all'}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(component.instance()).toMatchSnapshot()
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
 */

'use strict'

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { policiesTestingDataSet1, policiesTestingDataSet2, findingsTestingDataSet1 } from './ModuleTestingData'
import ImpactedControlsModule from '../../../../src-web/components/modules/ImpactedControlsModule'

describe('ImpactedControlsModule view with Security Findings', () => {
  const showFindings = true
  const viewState = {
    'showControls': 3
  }
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  const filteredFindings = findingsTestingDataSet1
  const activeFilters = {}
  const availableFilters = {standards:{availableSet:{}}}
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><ImpactedControlsModule
      showFindings={showFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      findings={filteredFindings}
      activeFilters={activeFilters}
      availableFilters={availableFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('ImpactedControlsModule view without Security Findings', () => {
  const showFindings = false
  const viewState = {
    'showControls': 3,
    'standardsChoice': 'NIST CSF'
  }
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  const filteredFindings = findingsTestingDataSet1
  const activeFilters = {}
  const availableFilters = {standards:{availableSet:{}}}
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><ImpactedControlsModule
      showFindings={showFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      findings={filteredFindings}
      activeFilters={activeFilters}
      availableFilters={availableFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('ImpactedControlsModule view without Security Findings', () => {
  const showFindings = false
  const viewState = {
    'showControls': 3,
    'standardsChoice': 'NIST'
  }
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  const filteredFindings = findingsTestingDataSet1
  const activeFilters = {}
  const availableFilters = {standards:{availableSet:{}}}
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><ImpactedControlsModule
      showFindings={showFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      policies={filteredPolicies}
      findings={filteredFindings}
      activeFilters={activeFilters}
      availableFilters={availableFilters}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

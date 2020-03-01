/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { policiesTestingDataSet1, findingsTestingDataSet1 } from './ModuleTestingData'
import RecentActivityModule from '../../../../src-web/components/modules/RecentActivityModule'

describe('RecentActivityModule view with Security Findings and applications', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const showFindings = true
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  const filteredFindings = findingsTestingDataSet1
  const viewState = {}
  const updateViewState = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><RecentActivityModule
      showFindings={showFindings}
      showApplications={showApplications}
      policies={filteredPolicies}
      findings={filteredFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('RecentActivityModule view without Security Findings and applications', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const showFindings = false
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  const filteredFindings = findingsTestingDataSet1
  const viewState = {}
  const updateViewState = jest.fn()
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><RecentActivityModule
      showFindings={showFindings}
      showApplications={showApplications}
      policies={filteredPolicies}
      findings={filteredFindings}
      viewState={viewState}
      updateViewState={updateViewState}
      handleDrillDownClick={handleDrillDownClick} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

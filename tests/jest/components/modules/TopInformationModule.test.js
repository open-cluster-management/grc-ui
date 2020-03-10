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
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { policiesTestingDataSet1, policiesTestingDataSet2, findingsTestingDataSet1 } from './ModuleTestingData'
import TopInformationModule from '../../../../src-web/components/modules/TopInformationModule'

describe('TopInformationModule clusters view without application', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateThreshold = jest.fn()
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'clusters'}
          type='policies'
          updateViewState={updateViewState}
          updateThreshold={updateThreshold}
          items={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'clusters'}
        type='policies'
        showApplications={false}
        updateViewState={updateViewState}
        updateThreshold={updateThreshold}
        items={filteredPolicies}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

describe('TopInformationModule clusters view with application', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateThreshold = jest.fn()
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'clusters'}
          type='policies'
          showApplications={true}
          updateViewState={updateViewState}
          updateThreshold={updateThreshold}
          items={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'clusters'}
        type='policies'
        showApplications={true}
        updateViewState={updateViewState}
        updateThreshold={updateThreshold}
        items={filteredPolicies}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

describe('TopInformationModule policies view without application', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateThreshold = jest.fn()
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'policies'}
          type='policies'
          updateThreshold={updateThreshold}
          updateViewState={updateViewState}
          items={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'policies'}
        type='policies'
        updateThreshold={updateThreshold}
        updateViewState={updateViewState}
        items={filteredPolicies}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

describe('TopInformationModule policies view with application', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateThreshold = jest.fn()
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredPolicies = policiesTestingDataSet2
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'policies'}
          type='policies'
          showApplications={true}
          updateThreshold={updateThreshold}
          updateViewState={updateViewState}
          items={filteredPolicies}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'policies'}
        type='policies'
        showApplications={true}
        updateThreshold={updateThreshold}
        updateViewState={updateViewState}
        items={filteredPolicies}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

describe('TopInformationModule findings view', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateThreshold = jest.fn()
  const updateViewState = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredFindings = findingsTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'findings'}
          type='findings'
          updateThreshold={updateThreshold}
          updateViewState={updateViewState}
          items={filteredFindings}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'findings'}
        type='findings'
        updateThreshold={updateThreshold}
        updateViewState={updateViewState}
        items={filteredFindings}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

describe('TopInformationModule findings clusters view', () => {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({display: 'block', 'padding-right': '0.625rem'}))
  const activeFilters = {activeFilters:{}}
  const updateViewState = jest.fn()
  const updateThreshold = jest.fn()
  const handleDrillDownClick = jest.fn()
  const filteredFindings = findingsTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <TopInformationModule
          viewState={'clusters'}
          type='findings'
          updateViewState={updateViewState}
          updateThreshold={updateThreshold}
          items={filteredFindings}
          activeFilters={activeFilters}
          handleDrillDownClick={handleDrillDownClick} />
      </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()

    const wrapper = shallow(
      <TopInformationModule
        viewState={'clusters'}
        type='findings'
        updateViewState={updateViewState}
        updateThreshold={updateThreshold}
        items={filteredFindings}
        activeFilters={activeFilters}
        handleDrillDownClick={handleDrillDownClick} />)
    expect(wrapper.instance().onChange(0)).toMatchSnapshot()
    expect(wrapper.instance().onChange(1)).toMatchSnapshot()
    expect(wrapper.instance().onChange(2)).toMatchSnapshot()
  })
})

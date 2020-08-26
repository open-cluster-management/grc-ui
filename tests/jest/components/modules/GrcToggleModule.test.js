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
import { policiesTabModuleFilteredPolicies, findingsTestingDataSet1,
  policiesTabModuleRefreshControl, policiesTabModuleSecondaryHeaderProps
} from './ModuleTestingData'
import { GrcToggleModule } from '../../../../src-web/components/modules/GrcToggleModule'
import { createMemoryHistory } from 'history'

const history1 = createMemoryHistory({
  'length':5,
  'action':'PUSH',
  'location':{
    'pathname':'/multicloud/policies/all',
    'search':'',
    'hash':''
  }
})

const history2 = createMemoryHistory({
  'length':5,
  'action':'PUSH',
  'location':{
    'pathname':'/multicloud/policies/findings',
    'search':'',
    'hash':''
  }
})

const location1 = {
  pathname: '/multicloud/policies/all'
}

const location2 = {
  pathname: '/multicloud/policies/findings',
  search: '?index=1&side=true&card=false&toggle=false&filters={"textsearch":["cluster1"]}'
}

describe('GrcToggle view without application', () => {
  it('renders expand as expected', () => {
    const component = shallow(
      <GrcToggleModule
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        showApplications={false}
        grcTabToggleIndex={0}
        showGrcTabToggle={true}
        highLightRowName={''}
        showSidePanel={false}
      />)
    expect(component).toMatchSnapshot()
  })
  it('renders expand as expected', () => {
    const component = shallow(
      <GrcToggleModule
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        showApplications={false}
        grcTabToggleIndex={0}
        showGrcTabToggle={false}
        highLightRowName={''}
        showSidePanel={false}
      />)
    expect(component).toMatchSnapshot()
  })
})

describe('GrcToggle view with application', () => {
  it('renders expand as expected', () => {
    const component = shallow(
      <GrcToggleModule
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        showApplications={true}
        grcTabToggleIndex={0}
        showGrcTabToggle={true}
        highLightRowName={''}
        showSidePanel={false}
      />)
    expect(component).toMatchSnapshot()
  })
  it('renders expand as expected', () => {
    const component = shallow(
      <GrcToggleModule
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        showApplications={true}
        grcTabToggleIndex={0}
        showGrcTabToggle={false}
        highLightRowName={''}
        showSidePanel={false}
      />)
    expect(component).toMatchSnapshot()
  })
})

describe('GrcToggle view', () => {
  it('renders expand as expected', () => {
    const component = shallow(
      <GrcToggleModule
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={findingsTestingDataSet1}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        grcTabToggleIndex={0}
        showApplications={true}
        showGrcTabToggle={true}
        highLightRowName={''}
        showSidePanel={false}
      />)
    expect(component).toMatchSnapshot()
  })
  it('renders expand as expected', () => {
    const component = shallow(<GrcToggleModule
      refreshControl = {policiesTabModuleRefreshControl}
      grcItems={findingsTestingDataSet1}
      secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
      locale = {'en-US'}
      grcTabToggleIndex={0}
      showApplications={true}
      showGrcTabToggle={false}
      highLightRowName={''}
      showSidePanel={false}
    />)
    expect(component).toMatchSnapshot()
  })
})

describe('GrcView toggleClick', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <GrcToggleModule
        history={history2}
        location={location2}
        refreshControl = {findingsTestingDataSet1}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        grcTabToggleIndex={0}
        showGrcTabToggle={true}
        highLightRowName={''}
        showSidePanel={false}
      />
    )
    expect(wrapper.instance().renderTabSwitcher('findings', 0)).toMatchSnapshot()
    expect(wrapper.instance().renderTabSwitcher('findings', 1)).toMatchSnapshot()
    expect(wrapper.instance().toggleClick()).toEqual(
      '/multicloud/policies/findings?card=false&filters=%7B%22textsearch%22%3A%5B%22cluster1%22%5D%7D&side=true&toggle=false'
    )
  })
})

describe('GrcView toggleClick', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <GrcToggleModule
        history={history1}
        location={location1}
        refreshControl = {policiesTabModuleRefreshControl}
        grcItems={policiesTabModuleFilteredPolicies}
        secondaryHeaderProps={policiesTabModuleSecondaryHeaderProps}
        locale = {'en-US'}
        grcTabToggleIndex={0}
        showApplications={true}
        showGrcTabToggle={true}
        highLightRowName={''}
        showSidePanel={false}
      />
    )
    expect(wrapper.instance().renderTabSwitcher('all', 0)).toMatchSnapshot()
    expect(wrapper.instance().renderTabSwitcher('all', 1)).toMatchSnapshot()
    expect(wrapper.instance().renderTabSwitcher('other', 0)).toMatchSnapshot()
    expect(wrapper.instance().renderTabSwitcher('other', 1)).toMatchSnapshot()
    expect(wrapper.instance().toggleClick()).toEqual('/multicloud/policies/all')
  })
})

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

const location1 = {
  pathname: '/multicloud/policies/all'
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(component.instance()).toMatchSnapshot()
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
    expect(wrapper.instance().toggleClick(true, {'currentTarget':{'id':'0'}})).toEqual('/multicloud/policies/all?index=0')
    expect(wrapper.instance().toggleClick(true, {'currentTarget':{'id':'1'}})).toEqual('/multicloud/policies/all?index=1')
  })
})

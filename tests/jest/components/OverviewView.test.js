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
import { GrcViewPolicyCluster, GrcViewFindingCluster, GrcViewRefreshControl, GrcViewSecondaryHeaderProps } from './ComponentsTestingData'
//curly braces means pure component without redux
//which is what we want in unit test
import { OverviewView } from '../../../src-web/components/OverviewView'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import { shallow } from 'enzyme'
import { createMemoryHistory } from 'history'

const history = createMemoryHistory({'length':4,'action':'POP','location':{'pathname':'/multicloud/policies/','search':'','hash':''}})

describe('OverviewView component 1', () => {
  const location = {
    pathname: '/multicloud/policies/'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <OverviewView
          title='Test1'
          history={history}
          location={location}
          loading={true}
          error={null}
          activeFilters={{}}
          policies={GrcViewPolicyCluster}
          findings={GrcViewFindingCluster}
          refreshControl={GrcViewRefreshControl}
          secondaryHeaderProps={GrcViewSecondaryHeaderProps}
        />
      </BrowserRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('OverviewView component 2', () => {
  const location = {
    pathname: '/multicloud/policies/'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <OverviewView
          title='Test2'
          history={history}
          location={location}
          loading={false}
          error={{}}
          activeFilters={{}}
          policies={GrcViewPolicyCluster}
          findings={GrcViewFindingCluster}
          refreshControl={GrcViewRefreshControl}
          secondaryHeaderProps={GrcViewSecondaryHeaderProps}
        />
      </BrowserRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('OverviewView component 3', () => {
  const location = {
    pathname: '/multicloud/policies/'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <OverviewView
          title='Test3'
          history={history}
          location={location}
          loading={false}
          error={null}
          activeFilters={{}}
          policies={[]}
          findings={GrcViewFindingCluster}
          refreshControl={GrcViewRefreshControl}
          secondaryHeaderProps={GrcViewSecondaryHeaderProps}
        />
      </BrowserRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('OverviewView handleDrillDownClickOverview 1', () => {
  const location1 = {
    pathname: '/multicloud/policies/'
  }
  const location2 = {
    pathname: '/multicloud/policies'
  }
  it('renders as expected', () => {
    const wrapper = shallow(
      <OverviewView
        title='Test4'
        history={history}
        location={location1}
        loading={false}
        error={{}}
        activeFilters={{}}
        policies={GrcViewPolicyCluster}
        findings={GrcViewFindingCluster}
        refreshControl={GrcViewRefreshControl}
        secondaryHeaderProps={GrcViewSecondaryHeaderProps}
      />
    )
    expect(wrapper.instance().handleDrillDownClickOverview()).toEqual(undefined)
    expect(wrapper.instance().handleDrillDownClickOverview(null, 'cluster1')).toEqual(undefined)
    expect(wrapper.instance().handleDrillDownClickOverview('clusters')).toEqual('all?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('clusters', 'cluster1')).toEqual('all?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22cluster1%22%5D%7D&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('policies')).toEqual('all?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('policies', 'policy-iampolicy')).toEqual('all?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22policy-iampolicy%22%5D%7D&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('security findings')).toEqual('findings?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('security findings', 'Policy that is not compliant')).toEqual('findings?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22Policy%20that%20is%20not%20compliant%22%5D%7D&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('finding clusters')).toEqual('findings?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('finding clusters', 'cluster1')).toEqual('findings?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22cluster1%22%5D%7D&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('Policy Violations')).toEqual('all?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('Cluster Violations')).toEqual('all?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('High')).toEqual('findings?autoFocus=module-toggle-tab&index=0&severity=High')
    expect(wrapper.instance().handleDrillDownClickOverview('Medium')).toEqual('findings?autoFocus=module-toggle-tab&index=0&severity=Medium')
    expect(wrapper.instance().handleDrillDownClickOverview('Low')).toEqual('findings?autoFocus=module-toggle-tab&index=0&severity=Low')
  })
  it('renders as expected', () => {
    const wrapper = shallow(
      <OverviewView
        title='Test4'
        history={history}
        location={location2}
        loading={false}
        error={{}}
        activeFilters={{}}
        policies={GrcViewPolicyCluster}
        findings={GrcViewFindingCluster}
        refreshControl={GrcViewRefreshControl}
        secondaryHeaderProps={GrcViewSecondaryHeaderProps}
      />
    )
    expect(wrapper.instance().handleDrillDownClickOverview()).toEqual(undefined)
    expect(wrapper.instance().handleDrillDownClickOverview(null, 'cluster1')).toEqual(undefined)
    expect(wrapper.instance().handleDrillDownClickOverview('clusters')).toEqual('/all?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('clusters', 'cluster1')).toEqual('/all?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22cluster1%22%5D%7D&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('policies')).toEqual('/all?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('policies', 'policy-iampolicy')).toEqual('/all?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22policy-iampolicy%22%5D%7D&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('security findings')).toEqual('/findings?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('security findings', 'Policy that is not compliant')).toEqual('/findings?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22Policy%20that%20is%20not%20compliant%22%5D%7D&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('finding clusters')).toEqual('/findings?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('finding clusters', 'cluster1')).toEqual('/findings?autoFocus=module-toggle-tab&filters=%7B%22textsearch%22%3A%5B%22cluster1%22%5D%7D&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('Policy Violations')).toEqual('/all?autoFocus=module-toggle-tab&index=0')
    expect(wrapper.instance().handleDrillDownClickOverview('Cluster Violations')).toEqual('/all?autoFocus=module-toggle-tab&index=1')
    expect(wrapper.instance().handleDrillDownClickOverview('High')).toEqual('/findings?autoFocus=module-toggle-tab&index=0&severity=High')
    expect(wrapper.instance().handleDrillDownClickOverview('Medium')).toEqual('/findings?autoFocus=module-toggle-tab&index=0&severity=Medium')
    expect(wrapper.instance().handleDrillDownClickOverview('Low')).toEqual('/findings?autoFocus=module-toggle-tab&index=0&severity=Low')
  })
})

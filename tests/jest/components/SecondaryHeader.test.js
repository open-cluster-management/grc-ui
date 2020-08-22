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
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
//curly braces means pure component without redux
//which is what we want in unit test
import { SecondaryHeader } from '../../../src-web/components/SecondaryHeader'
import { createMemoryHistory } from 'history'

const history = createMemoryHistory({'length':5,'action':'PUSH','location':{'pathname':'/multicloud/policies/all','search':'','hash':''}})

describe('SecondaryHeader component 1', () => {
  const location = {
    pathname: '/multicloud/policies'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <SecondaryHeader title='hello world' location={location} history={history} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 2', () => {
  const tabs = [{
    id: 'dashboard-application',
    label: 'tabs.dashboard.application',
    url: '/multicloud/dashboard',
  }]
  const location = {
    pathname: '/multicloud/policies/all'
  }
  it('renders clickable as expected', () => {
    const component = renderer.create(
      <SecondaryHeader
        title='hello world'
        tabs={tabs}
        location={location} history={history}
        links={[{'id':'create-policy','label':'button.create.policy','url':'/multicloud/policies/create'}]}
        userAccess={
          [
            {
              'namespace': 'calamari',
              'rules': {
                '*/*': [
                  '*'
                ]
              }
            },
          ]
        }
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders clickable as expected', () => {
    const component = renderer.create(
      <SecondaryHeader
        title='hello world'
        tabs={tabs}
        location={location} history={history}
        links={[{'id':'create-policy','label':'button.create.policy','url':'/multicloud/policies/create'}]}
        userAccess={
          [
            {
              'namespace': 'calamari',
              'rules': {
                'policy.open-cluster-management.io/policies': [
                  'get',
                  'list',
                  'watch',
                  'update',
                  'patch',
                  'create',
                  'delete',
                  'deletecollection'
                ]
              }
            },
          ]
        }
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders nonclickable as expected', () => {
    const component = renderer.create(
      <SecondaryHeader
        title='hello world'
        tabs={tabs}
        location={location} history={history}
        links={[{'id':'create-policy','label':'button.create.policy','url':'/multicloud/policies/create'}]}
        userAccess={
          [
            {
              'namespace': 'calamari',
              'rules': {
                'policy.open-cluster-management.io/policies': [
                  'get',
                  'list',
                  'watch',
                  'update',
                  'patch',
                ]
              }
            },
          ]
        }
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 3', () => {
  const tabs = [
    {
      id: 'logs-tab1',
      label: 'tabs.dashboard.application',
      url: '/multicloud/dashboard',
    },
    {
      id: 'logs-tab2',
      label: 'tabs.dashboard',
      url: '/hello',
    }
  ]
  const location = {
    pathname: '/multicloud/policies/findings'
  }
  it('renders as expected', () => {
    const component = renderer.create(

      // eslint-disable-next-line jsx-a11y/aria-role
      <SecondaryHeader title='hello world' role='Viewer' tabs={tabs} location={location} history={history} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 4', () => {
  const location = {
    pathname: '/multicloud/policies/findings'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <SecondaryHeader title='hello world' location={location} history={history} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 5', () => {
  const location = {
    pathname: '/multicloud/policies/findings'
  }
  it('clickTab as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history} />
    )
    expect(component.instance().clickTab('www.ibm.com')).toEqual('www.ibm.com')
  })
  it('renderHeader with description', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        description={{action:jest.fn(), display:jest.fn()}}
        location={location}
        history={history} />
    )
    expect(component.instance().renderHeader()).toMatchSnapshot()
  })
  it('renderHeader without description', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history} />
    )
    expect(component.instance().renderHeader()).toMatchSnapshot()
  })
  it('renderLinks nonclickable as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history}
        links={[{'id':'create-policy','label':'button.create.policy','url':'/multicloud/policies/create'}]}
      />
    )
    expect(component.instance().renderLinks()).toMatchSnapshot()
  })
  it('renderTabs as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history}
        tabs={[{'id':'grc-overview','label':'tabs.grc.overview','url':'/multicloud/policies','index':0},{'id':'grc-all','label':'tabs.grc.all','url':'/multicloud/policies/all','index':1},{'id':'grc-findings','label':'tabs.grc.findings','url':'/multicloud/policies/findings','index':2}]}
      />
    )
    expect(component.instance().renderTabs()).toMatchSnapshot()
  })

  it('renderBreadCrumb1 as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history}
      />
    )
    expect(component.instance().renderBreadCrumb()).toMatchSnapshot()
  })
  it('renderBreadCrumb2 as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history}
        breadcrumbItems={[]}
      />
    )
    expect(component.instance().renderBreadCrumb()).toMatchSnapshot()
  })
  it('renderBreadCrumb3 as expected', () => {
    const component = shallow(
      <SecondaryHeader
        title='hello world'
        location={location}
        history={history}
        breadcrumbItems={[{id:'id1', label:'label1', url:'www.test1.com', handleClick:jest.fn(), noLocale:true}, {id:'id2', label:'label2', url:'www.test2.com', noLocale:true}, {id:'id3', label:'label3', url:'www.test3.com', handleClick:jest.fn(), noLocale:false}, {id:'id4', label:'label4', url:'www.test4.com', noLocale:false}]}
      />
    )
    expect(component.instance().renderBreadCrumb()).toMatchSnapshot()
  })
})

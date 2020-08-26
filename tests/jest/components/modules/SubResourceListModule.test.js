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
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import ResourceOverviewModule from '../../../../src-web/components/modules/SubResourceListModule'
import
{ policieSubResourceListTestingResourceData,
  policieSubResourceListTestingItemData,
  clusterSubResourceListTestingResourceData,
  clusterSubResourceListTestingItemData,
} from './ModuleTestingData'

describe('PolicieSubResourceList view', () => {
  const staticResourceData = policieSubResourceListTestingResourceData
  const items = policieSubResourceListTestingItemData
  const linkFixedName = {2 : {fixedName:'table.actions.launch.cluster', urlTarget:'_blank'}}
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ResourceOverviewModule
          staticResourceData={staticResourceData}
          items={items}
          listSubItems={true}
          linkFixedName={linkFixedName}
        /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('ClusterSubResourceList view', () => {
  const staticResourceData = clusterSubResourceListTestingResourceData
  const items = clusterSubResourceListTestingItemData
  it('renders as expected', () => {
    const component = renderer.create(
      <BrowserRouter>
        <ResourceOverviewModule
          staticResourceData={staticResourceData}
          items={items}
          listSubItems={true} /></BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

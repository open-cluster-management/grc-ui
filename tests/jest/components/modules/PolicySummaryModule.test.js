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
import { policiesTestingDataSet1 } from './ModuleTestingData'
import PolicySummaryModule from '../../../../src-web/components/modules/PolicySummaryModule'

describe('PolicySummaryModule view', () => {
  const filteredPolicies = policiesTestingDataSet1
  it('renders as expected', () => {
    const component = renderer.create(<BrowserRouter><PolicySummaryModule
      policies={filteredPolicies} />
    </BrowserRouter>)
    expect(component.toJSON()).toMatchSnapshot()
  })
})

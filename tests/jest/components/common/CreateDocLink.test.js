/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import { createDocLink, generalDocLink } from '../../../../src-web/components/common/CreateDocLink'

describe('createDocLink view', () => {
  const handleCreatePolicy = jest.fn()
  it('renders show create link as expected', () => {
    const component = createDocLink('en-US', handleCreatePolicy, 'show create link')
    expect(component).toMatchSnapshot()
  })

  it('renders does not show create link as expected', () => {
    const component = createDocLink('en-US', handleCreatePolicy, 'does not show create link')
    expect(component).toMatchSnapshot()
  })
})

describe('generalDocLink view', () => {
  it('renders show general GRC doc link as expected', () => {
    const component = generalDocLink('en-US', 'product documentation',
    'html/governance/governance#kubernetes-configuration-policy-controller')
    expect(component).toMatchSnapshot()
  })
})

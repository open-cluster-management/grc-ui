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

import { resourceActions } from '../../../../src-web/components/common/ResourceTableRowMenuItemActions'

describe('ResourceTableRowMenuItemActions component table.actions.policy.edit', () => {
  it('renders as expected', () => {
    const action = 'table.actions.policy.edit'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
  })
})

describe('ResourceTableRowMenuItemActions component table.actions.launch.cluster', () => {
  it('renders as expected', () => {
    const action = 'table.actions.launch.cluster'
    const resourceType = {
      'name': 'HCMPolicyCluster',
      'list': 'HCMPolicyClusterList'
    }
    window.open = jest.fn()
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
    window.open.mockClear()
  })
})

describe('ResourceTableRowMenuItemActions component table.actions.policy.edit', () => {
  it('renders as expected', () => {
    const action = 'table.actions.policy.sidepanel'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
  })
})

describe('ResourceTableRowMenuItemActions component table.actions.compliance.remove', () => {
  it('renders as expected', () => {
    const action = 'table.actions.compliance.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
  })
})

describe('ResourceTableRowMenuItemActions component table.actions.policy.remove', () => {
  it('renders as expected', () => {
    const action = 'table.actions.policy.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
  })
})

describe('ResourceTableRowMenuItemActions component table.actions.remove', () => {
  it('renders as expected', () => {
    const action = 'table.actions.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toMatchSnapshot()
  })
})

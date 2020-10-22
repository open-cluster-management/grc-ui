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

describe('ResourceTableRowMenuItemActions', () => {
  it('table.actions.edit is called as expected', () => {
    const action = 'table.actions.edit'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.launch.cluster is called as expected', () => {
    const action = 'table.actions.launch.cluster'
    const resourceType = {
      'name': 'HCMPolicyCluster',
      'list': 'HCMPolicyClusterList'
    }
    const data = {
      consoleURL: 'website'
    }
    window.open = jest.fn()
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, data, true, {})).toBeUndefined()
    expect(dispatch).not.toHaveBeenCalled()
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open.mock.calls[0]).toMatchSnapshot()
    window.open.mockClear()
  })
  it('table.actions.policy.applications.sidepanel is called as expected', () => {
    const action = 'table.actions.policy.applications.sidepanel'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.policy.policies.sidepanel is called as expected', () => {
    const action = 'table.actions.policy.policies.sidepanel'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.policy.clusters.sidepanel is called as expected', () => {
    const action = 'table.actions.policy.clusters.sidepanel'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.applications.remove is called as expected', () => {
    const action = 'table.actions.applications.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.compliance.remove is called as expected', () => {
    const action = 'table.actions.compliance.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.policy.remove is called as expected', () => {
    const action = 'table.actions.policy.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.remove is called as expected', () => {
    const action = 'table.actions.remove'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.disable is called as expected', () => {
    const action = 'table.actions.disable'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.enable is called as expected', () => {
    const action = 'table.actions.enable'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.enforce is called as expected', () => {
    const action = 'table.actions.enforce'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.inform is called as expected', () => {
    const action = 'table.actions.inform'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.cluster.view.nodes is called as expected', () => {
    const action = 'table.actions.cluster.view.nodes'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    const history = { push: jest.fn() }
    expect(resourceActions(action, dispatch, resourceType, {'metadata': {'name': 'cluster1'}}, true, history)).toBeUndefined()
    expect(dispatch).not.toHaveBeenCalled()
    expect(history.push).toHaveBeenCalledTimes(1)
    expect(history.push.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.cluster.view.pods is called as expected', () => {
    const action = 'table.actions.cluster.view.pods'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    const history = { push: jest.fn() }
    expect(resourceActions(action, dispatch, resourceType, {'metadata': {'name': 'cluster1'}}, true, history)).toBeUndefined()
    expect(dispatch).not.toHaveBeenCalled()
    expect(history.push).toHaveBeenCalledTimes(1)
    expect(history.push.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.cluster.edit.labels is called as expected', () => {
    const action = 'table.actions.cluster.edit.labels'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('table.actions.pod.logs is called as expected', () => {
    const action = 'table.actions.pod.logs'
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })
  it('unknown action will return undefined', () => {
    const action = ''
    const resourceType = {}
    const dispatch = jest.fn()
    expect(resourceActions(action, dispatch, resourceType, {}, true, {})).toBeUndefined()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

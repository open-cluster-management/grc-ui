/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import { renderAnsibleRemovalModal } from '../../../../../src-web/components/modals/AnsibleAutomationModal/AnsibleRemovalModal'

describe('render ansible removal modal', () => {
  it('render opened ansible removal modal', () => {
    const component = renderAnsibleRemovalModal({
      openDelModal:true,
      policyAutoName: 'test-policy-3-1624936287-policy-automation', locale: 'us',
      handleDeleteClick:jest.fn(), handleCloseDelModal:jest.fn()
    })
    expect(component).toMatchSnapshot()
  })

  it('render closed ansible removal modal', () => {
    const component = renderAnsibleRemovalModal({
      openDelModal:false,
      policyAutoName: 'test-policy-3-1624936287-policy-automation', locale: 'us',
      handleDeleteClick:jest.fn(), handleCloseDelModal:jest.fn()
    })
    expect(component).toMatchSnapshot()
  })
})

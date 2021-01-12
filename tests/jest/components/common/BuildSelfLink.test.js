/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'

import { buildSelfLinK } from '../../../../src-web/components/common/BuildSelfLink'

const data1 = {
  'kind': 'HCMCompliance',
  '__typename': 'Compliance',
  'metadata': {
    '__typename': 'Metadata',
    'name': 'test-iam-policy-1610374358',
    'namespace': 'default',
    'selfLink': null,
  },
  'name': 'test-iam-policy-1610374358',
  'namespace': 'default',
  'raw': {
    'apiVersion': 'policy.open-cluster-management.io/v1',
    'kind': 'Policy',
  },
}

const data2 = {
  'kind': 'HCMCompliance',
  '__typename': 'Compliance',
  'metadata': {
    '__typename': 'Metadata',
    'name': 'test-iam-policy-1610374358',
    'namespace': 'default',
    'selfLink': 'testingSelfLink',
  },
  'name': 'test-iam-policy-1610374358',
  'namespace': 'default',
}

describe('BuildSelfLink', () => {
  it('should correctly build self link', () => {
    expect(buildSelfLinK(data1, 'policies')).toMatchSnapshot()
  })
  it('should correctly get testingSelfLink', () => {
    expect(buildSelfLinK(data2, 'policies')).toMatchSnapshot()
  })
  it('should correctly get empty SelfLink', () => {
    expect(buildSelfLinK('', 'policies')).toMatchSnapshot()
  })
})

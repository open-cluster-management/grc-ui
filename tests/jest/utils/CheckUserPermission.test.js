/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  checkCreatePermission,
  checkEditPermission,
  checkCreateRole,
  checkEditRole
} from '../../../src-web/utils/CheckUserPermission'

const accessUsers = {
  clusterAdmin: [{
    namespace: 'default',
    rules: {
      '*/*': ['*']
    }
  }],
  admin: [{
    namespace: 'default',
    rules: {
      'policy.open-cluster-management.io/policies': [
        'get',
        'list',
        'watch',
        'update',
        'create',
      ]
    }
  }],
  edit: [{
    namespace: 'default',
    rules: {
      'policy.open-cluster-management.io/policies': [
        'get',
        'list',
        'watch',
        'update',
      ]
    }
  }],
  view: [{
    namespace: 'default',
    rules: {
      'policy.open-cluster-management.io/policies': [
        'get',
        'list',
        'watch',
      ]
    }
  }]
}

describe('checkCreatePermission', () => {
  for (const user in accessUsers) {
    it(`should return correct permissions for ${user} users`, () => {
      expect(checkCreatePermission(accessUsers[user])).toMatchSnapshot()
    })
  }
})

describe('checkCreateRole', () => {
  for (const user in accessUsers) {
    it(`should return correct permissions for ${user} users`, () => {
      expect(checkCreateRole(accessUsers[user][0].rules)).toMatchSnapshot()
    })
  }
})

describe('checkEditPermission', () => {
  for (const user in accessUsers) {
    it(`should return correct permissions for ${user} users`, () => {
      expect(checkEditPermission(accessUsers[user])).toMatchSnapshot()
    })
  }
})

describe('checkEditRole', () => {
  for (const user in accessUsers) {
    it(`should return correct permissions for ${user} users`, () => {
      expect(checkEditRole(accessUsers[user][0].rules)).toMatchSnapshot()
    })
  }
})

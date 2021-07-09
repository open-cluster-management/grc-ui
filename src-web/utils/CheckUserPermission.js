/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

const policyKey = 'policy.open-cluster-management.io/policies'

export const checkCreatePermission = (userAccess) => {
  // if create policy permission on any ns, set flag to 1
  if (userAccess && typeof userAccess === 'object') {
    for (const singleNSAccess of userAccess) {
      if (checkCreateRole(singleNSAccess.rules) === 1) {
        return 1
      }
    }
  }
  return 0
}

export const checkCreateRole = (rules) => {
  if (Array.isArray(rules['*/*']) &&
          (rules['*/*'].includes('*') || rules['*/*'].includes('create'))) {
    return 1
  }
  if (Array.isArray(rules[policyKey]) &&
          (rules[policyKey].includes('*') || rules[policyKey].includes('create'))) {
    return 1
  }
  return 0
}

export const checkEditPermission = (userAccess) => {
  // if edit policy permission on any ns, set flag to 1
  if (userAccess && typeof userAccess === 'object') {
    for (const singleNSAccess of userAccess) {
      if (checkEditRole(singleNSAccess.rules) === 1) {
        return 1
      }
    }
  }
  return 0
}

export const checkEditRole = (rules) => {
  if (Array.isArray(rules['*/*']) &&
          (rules['*/*'].includes('*') || rules['*/*'].includes('update'))) {
    return 1
  }
  if (Array.isArray(rules[policyKey]) &&
          (rules[policyKey].includes('*') || rules[policyKey].includes('update'))) {
    return 1
  }
  return 0
}

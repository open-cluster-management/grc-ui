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

export const checkCreateRole = (rules, policyKeys=[]) => {
  if (Array.isArray(rules['*/*']) &&
          (rules['*/*'].includes('*') || rules['*/*'].includes('create'))) {
    return 1
  }
  // Assumption is that create permissions are needed for all resources provided in policyKeys
  policyKeys.push(policyKey)
  const permissions = policyKeys.map((key) => {
    if (Array.isArray(rules[key]) &&
          (rules[key].includes('*') || rules[key].includes('create'))) {
      return 1
    }
    return 0
  })
  if (!permissions.includes(0)) {
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

export const checkEditRole = (rules, policyKeys=[]) => {
  if (Array.isArray(rules['*/*']) &&
          (rules['*/*'].includes('*') || rules['*/*'].includes('update'))) {
    return 1
  }
  // Assumption is that edit permissions are needed for all resources provided in policyKeys
  policyKeys.push(policyKey)
  const permissions = policyKeys.map((key) => {
    if (Array.isArray(rules[key]) &&
            (rules[key].includes('*') || rules[key].includes('update'))) {
      return 1
    }
    return 0
  })
  if (!permissions.includes(0)) {
    return 1
  }
  return 0
}

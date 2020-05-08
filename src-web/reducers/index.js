/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/*
 *
 * Things you should never do inside a reducer:
 *
 * - Mutate its arguments
 * - Perform side effects like API calls and routing transitions
 * - Call non-pure functions, e.g. Date.now() or Math.random()
 *
 * Reducers must be deterministic pure functions.  Given the same arguments, it should calculate the next state and return it.
 * No surprises. No side effects. No API calls. No mutations. Just a calculation.
 *
 * Selectors should sit along side reducers.
 */

import { createResourceReducer, resourceReducerFunction } from './common'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import lodash from 'lodash'

export { user, loggedIn } from './user'
export { uiconfig } from './uiconfig'
export { role } from './role'
export { userpreferences } from './userpreferences'
export { resourceToolbar } from './common'
export { secondaryHeader } from './common'

export { modal } from './modal'

export const HCMApplicationList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_APPLICATIONS))
export const HCMComplianceList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_COMPLIANCES))
export const HCMPolicyList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_POLICIES))
export const HCMPolicyApplicationList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION))
export const HCMPolicyPolicyList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_POLICIES_PER_POLICY))
export const HCMPolicyClusterList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER))
export const HCMSecurityFindingsList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_SECURITY_FINDINGS))
export const HCMClusterFindingsList = createResourceReducer(resourceReducerFunction, predicate.bind(null, RESOURCE_TYPES.HCM_CLUSTER_FINDINGS))

// export { default as catalog } from './catalog'
export { resourceFilters } from './filter'

export function predicate(resourceType, action) {
  if (lodash.isEqual(resourceType, action.resourceType)) {
    return true
  }
  const result = lodash.find(lodash.values(resourceType), type => {
    if (typeof type === 'string') {
      return type.indexOf(action.resourceType) > -1
    }
    return false
  })

  return result ? result : null
}

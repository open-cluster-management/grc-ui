/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019, 2020. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

export function fliterTableAction(namespace,actions,userAccessHash,resourceType) {
  let actionList = []
  const adminRules = userAccessHash[`${namespace}/*/*`]
  let typeRules = null
  if(resourceType && resourceType.name) {
    switch (resourceType.name) {
    case 'HCMCompliance':
    case 'HCMPolicyPolicy':
      typeRules = userAccessHash[`${namespace}/policy.open-cluster-management.io/policies`]
      if (Array.isArray(adminRules)) {
        if (adminRules.includes('*')) { // if admin and *
          return actions // all kind of actions are available
        }
        else { // build action list based admin permission
          actionList = buildPolicyAction(adminRules, actionList)
        }
      }

      if (Array.isArray(typeRules)) {
        if (typeRules.includes('*')) { // if * for policy api on target NS
          return actions // all kind of actions are available
        }
        else { // build action list based user policy api permission on target NS
          actionList = buildPolicyAction(typeRules, actionList)
        }
      }
    }
    // will add more for Findings in future
  }
  return actionList
}

function buildPolicyAction(rulesSet, actionList) {
  actionList.push('table.actions.policy.policies.sidepanel')
  if (rulesSet.includes('delete') || rulesSet.includes('deletecollection')) {
    actionList.push('table.actions.remove')
  }
  if (rulesSet.includes('update') || rulesSet.includes('patch')) {
    actionList.push('table.actions.edit')
    actionList.push('table.actions.disable')
    actionList.push('table.actions.enforce')
  }
  return actionList
}

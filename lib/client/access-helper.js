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

export function filterTableAction(item,actions,userAccessHash,resourceType) {
  let actionList = []
  let adminRules = []
  let typeRules = []
  if(resourceType && resourceType.name) {
    switch (resourceType.name) {
    case 'HCMCompliance':
    case 'HCMPolicyPolicy':
      if (item && item.metadata && item.metadata.namespace) {
        adminRules = userAccessHash[`${item.metadata.namespace}/*/*`]
        typeRules = userAccessHash[`${item.metadata.namespace}/policy.open-cluster-management.io/policies`]
        if (Array.isArray(adminRules) && adminRules.length > 0) {
          if (adminRules.includes('*')) { // if admin and *
            return actions // all kind of actions are available
          }
          else { // build action list based admin permission
            actionList = buildPolicyAction(adminRules, actionList)
          }
        }

        if (Array.isArray(typeRules) && typeRules.length > 0) {
          if (typeRules.includes('*')) { // if * for policy api on target NS
            return actions // all kind of actions are available
          }
          else { // build action list based user policy api permission on target NS
            actionList = buildPolicyAction(typeRules, actionList)
          }
        }
      }
      break
    case 'HCMPolicyCluster':
      return actions // all kind of cluster actions are available
    default:
      // do nothing
    }
  }
  return actionList
}

function buildPolicyAction(rulesSet, actionList) {
  actionList.push('table.actions.policy.policies.sidepanel')

  if (rulesSet.includes('update') || rulesSet.includes('patch')) {
    actionList.push('table.actions.edit')
    actionList.push('table.actions.disable')
    actionList.push('table.actions.enforce')
  } else {
    actionList.push('disabled.table.actions.edit')
    actionList.push('disabled.table.actions.disable')
    actionList.push('disabled.table.actions.enforce')
  }

  if (rulesSet.includes('delete') || rulesSet.includes('deletecollection')) {
    actionList.push('table.actions.remove')
  } else {
    actionList.push('disabled.table.actions.remove')
  }

  return actionList
}

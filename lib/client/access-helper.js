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

const filterTableAction = (data,actions,userAccessHash,resourceType) => {
  let actionList = []
  if(resourceType && resourceType.name && Array.isArray(actions)) {
    let adminRules = [], typeRules = []
    const namespace = (data && data.metadata && data.metadata.namespace)
      ? data.metadata.namespace
      : ''
    switch (resourceType.name) {
    case 'HCMCompliance':
    case 'HCMPolicyPolicy':
      if (namespace) {
        adminRules = userAccessHash[`${namespace}/*/*`]
        typeRules = userAccessHash[`${namespace}/policy.open-cluster-management.io/policies`]
        actionList = buildActionByUser(adminRules, typeRules, actions, actionList)
      }
      break
    case 'HCMPolicyCluster':
      return actions // all kind of cluster actions are available
    case 'policy.pp.details.title':
      if (namespace) {
        adminRules = userAccessHash[`${namespace}/*/*`]
        typeRules = userAccessHash[`${namespace}/apps.open-cluster-management.io/placementrules`]
        actionList = buildActionByUser(adminRules, typeRules, actions, actionList)
      }
      break
    case 'policy.pb.details.title':
      if (namespace) {
        adminRules = userAccessHash[`${namespace}/*/*`]
        typeRules = userAccessHash[`${namespace}/policy.open-cluster-management.io/placementbindings`]
        actionList = buildActionByUser(adminRules, typeRules, actions, actionList)
      }
      break
    default:
      // do nothing
    }
    return actionList
  }
}

function buildActionByUser(adminRules, typeRules, actions, actionList) {
  if (Array.isArray(adminRules) && adminRules.length > 0) {
    if (adminRules.includes('*')) { // if admin and *
      return actions // all kind of actions are available
    }
    else { // build action list based admin permission
      actionList = buildActionList(actions, adminRules, actionList)
    }
  }
  if (Array.isArray(typeRules) && typeRules.length > 0) {
    if (typeRules.includes('*')) { // if * for api on target NS
      return actions // all kind of api actions are available
    }
    else { // build action list based user api permission on target NS
      actionList = buildActionList(actions, typeRules, actionList)
    }
    return actionList
  }
}

function buildActionList(actions, rulesSet, actionList) {
  const removeFlag = actions.includes('table.actions.remove')
  const editFlag = actions.includes('table.actions.edit')
  const disableFlag = actions.includes('table.actions.disable')
  const enforceFlag = actions.includes('table.actions.enforce')
  if (actions.includes('table.actions.policy.policies.sidepanel')) {
    actionList.push('table.actions.policy.policies.sidepanel')
  }
  if (rulesSet.includes('update') || rulesSet.includes('patch')) {
    if (editFlag) {
      actionList.push('table.actions.edit')
    }
    if (disableFlag) {
      actionList.push('table.actions.disable')
    }
    if (enforceFlag) {
      actionList.push('table.actions.enforce')
    }
  } else {
    if (editFlag) {
      actionList.push('disabled.table.actions.edit')
    }
    if (disableFlag) {
      actionList.push('disabled.table.actions.disable')
    }
    if (enforceFlag) {
      actionList.push('disabled.table.actions.enforce')
    }
  }
  if (rulesSet.includes('delete') || rulesSet.includes('deletecollection')) {
    if (removeFlag) {
      actionList.push('table.actions.remove')
    }
  } else {
    if (removeFlag) {
      actionList.push('disabled.table.actions.remove')
    }
  }
  return actionList
}

export default filterTableAction

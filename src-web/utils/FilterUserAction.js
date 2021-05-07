/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

const filterUserAction = (data,actions,userAccessHash,resourceType) => {
  let actionList = []
  if(resourceType && resourceType.name && Array.isArray(actions)) {
    let adminRules = [], typeRules = []
    const namespace = (data && data.namespace)
      ? data.namespace
      : ''
    switch (resourceType.name) {
    case 'HCMCompliance':
      if (namespace) {
        adminRules = userAccessHash[`${namespace}/*/*`]
        typeRules = userAccessHash[`${namespace}/policy.open-cluster-management.io/policies`]
        actionList = buildActionByUser(adminRules, typeRules, actions, actionList)
      }
      break
    case 'PoliciesByCluster':
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
  }
  return actionList
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
  }
  return actionList
}

function buildActionList(actions, rulesSet, actionList) {
  const removeFlag = actions.includes('table.actions.policy.remove')
  const editFlag = actions.includes('table.actions.policy.edit')
  const disableFlag = actions.includes('table.actions.policy.disable')
  const enforceFlag = actions.includes('table.actions.policy.enforce')
  if (rulesSet.includes('update') || rulesSet.includes('patch')) {
    if (editFlag) {
      actionList.push('table.actions.policy.edit')
    }
    if (disableFlag) {
      actionList.push('table.actions.policy.disable')
    }
    if (enforceFlag) {
      actionList.push('table.actions.policy.enforce')
    }
  } else {
    if (editFlag) {
      actionList.push('disabled.table.actions.policy.edit')
    }
    if (disableFlag) {
      actionList.push('disabled.table.actions.policy.disable')
    }
    if (enforceFlag) {
      actionList.push('disabled.table.actions.policy.enforce')
    }
  }
  if (rulesSet.includes('delete') || rulesSet.includes('deletecollection')) {
    if (removeFlag) {
      actionList.push('table.actions.policy.remove')
    }
  } else {
    if (removeFlag) {
      actionList.push('disabled.table.actions.policy.remove')
    }
  }
  return actionList
}

export default filterUserAction

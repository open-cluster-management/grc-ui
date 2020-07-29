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

import { ROLES } from '../shared/constants'
import apolloClient from '../client/apollo-client'

export function fliterTableAction(actions,userRole,resourceType) {
  let actionList = []
  switch (userRole) {
  case ROLES.VIEWER:
    if(resourceType && resourceType.name) {
      switch (resourceType.name) {
      case 'HCMSecurityFindings':
      case 'HCMClusterFindings':
        //viewer role can see findings side panel
        actionList = actions.filter((action) => (action === 'table.actions.finding.securityFindings.sidepanel' || action === 'table.actions.finding.clusterFindings.sidepanel'))
        break
      default:
        //do nothing
        break
      }
    }
    return actionList
  case ROLES.EDITOR:
  case ROLES.OPERATOR:
    if(resourceType && resourceType.name) {
      switch (resourceType.name) {
      case 'HCMCompliance':
      case 'HCMPolicyPolicy':
        // do nothing
        break
      case 'HCMSecurityFindings':
        //operator role can see security findings side panel and delete it
        actionList = actions.filter((action) => (action === 'table.actions.finding.securityFindings.sidepanel' || action === 'table.actions.remove'))
        break
      case 'HCMClusterFindings':
        //operator role can see cluster findings side panel
        actionList = actions.filter((action) => (action === 'table.actions.finding.clusterFindings.sidepanel'))
        break
      default:
        actionList = actions.filter((action) => (action === 'table.actions.edit' || action === 'table.actions.cluster.edit.labels' || action==='table.actions.cluster.view.pods'))
        break
      }
    }
    return actionList
  case ROLES.ADMIN:
  case ROLES.ACCOUNT_ADMIN:
  case ROLES.CLUSTER_ADMIN:
  default:
    return actions
  }
}

export function getActionPermission(resource, action, namespace, apiGroup) {
  return apolloClient.getUserAccess({ resource, action, namespace, apiGroup })
}

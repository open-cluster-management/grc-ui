/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import lodash from 'lodash'

import { RESOURCE_TYPES } from '../../lib/shared/constants'

import hcmpoliciescluster from './hcm-policies-cluster'
import hcmpoliciespolicy from './hcm-policies-policy'
import hcmcompliances from './hcm-compliances'
import hcmpolicies from './hcm-policies'
import hcmsecurityfindings from './hcm-security-findings'
import hcmclusterfindings from './hcm-cluster-findings'
import hcmpoliciesapplication from './hcm-policies-application'

const resourceData = {
  [RESOURCE_TYPES.HCM_POLICIES_PER_APPLICATION.name]: hcmpoliciesapplication,
  [RESOURCE_TYPES.HCM_POLICIES_PER_POLICY.name]: hcmpoliciespolicy,
  [RESOURCE_TYPES.HCM_POLICIES_PER_CLUSTER.name]: hcmpoliciescluster,
  [RESOURCE_TYPES.HCM_COMPLIANCES.name]: hcmcompliances,
  [RESOURCE_TYPES.HCM_POLICIES.name]: hcmpolicies,
  [RESOURCE_TYPES.HCM_SECURITY_FINDINGS.name]: hcmsecurityfindings,
  [RESOURCE_TYPES.HCM_CLUSTER_FINDINGS.name]: hcmclusterfindings,
}

// diagram tabs
function getResourceData(resourceType) {
  // main Topology tab
  const def = resourceData[resourceType.name]
  if (!def) {
    //eslint-disable-next-line no-console
    console.error(`No resource data found for '${JSON.stringify(resourceType)}'`)
  }
  return def
}

export default getResourceData

export function getPrimaryKey(resourceType) {
  let pk = 'metadata.uid'
  const def = getResourceData(resourceType)
  if (def && def.primaryKey) {
    pk = def.primaryKey
  }
  return pk
}

export function getSecondaryKey(resourceType) {
  let sk = 'cluster'
  const def = getResourceData(resourceType)
  if(def && def.secondaryKey) {
    sk = def.secondaryKey
  }
  return sk
}

export function getURIKey(resourceType) {
  let uriKey = 'metadata.name'
  const def = getResourceData(resourceType)
  if (def && def.uriKey) {
    uriKey = def.uriKey
  }
  return uriKey
}

export function getDefaultSearchField(resourceType) {
  const def = getResourceData(resourceType)
  let sf = def && def.defaultSearchField
  if (!def || !def.tableKeys || (def && def.tableKeys.length < 1))
    //eslint-disable-next-line no-console
    console.error(`No table keys found in ${resourceType} resource definition`)
  if (!sf)
    sf = def && def.tableKeys && def.tableKeys[0] && def.tableKeys[0].resourceKey
  return sf
}

export function getDefaultSortField(resourceType) {
  const def = getResourceData(resourceType)
  let sf = def && def.defaultSortField
  if (!def || !def.tableKeys || (def && def.tableKeys.length < 1))
    //eslint-disable-next-line no-console
    console.error(`No table keys found in ${resourceType} resource definition`)
  if (!sf) {
    sf = def && def.tableKeys && def.tableKeys[0] && def.tableKeys[0].resourceKey
  }
  if (!sf)
    //eslint-disable-next-line no-console
    console.error(`No sortable fields defined for '${resourceType}' resource definition`)
  return sf
}

export function getTableKeys(resourceType) {
  const def = getResourceData(resourceType)
  return def.tableKeys
}

export function getLink(link, resource) {
  if(typeof(link) === 'boolean') {
    return `/${resource.metadata.namespace}/${resource.metadata.name}`
  } else if (typeof(link) === 'function') {
    return link(resource)
  } else {
    const parts = link.split('/')
    let path = ''
    parts.forEach(part => {
      const value = lodash.get(resource, part)
      path += `/${encodeURIComponent(value)}`
    })
    return path
  }
}

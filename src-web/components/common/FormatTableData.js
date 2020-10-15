/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'
import _ from 'lodash'

const formatPolicyClusterView = (clusterName, policiesUnderCluster) => {
  let compliantNum = 0
  let noncompliantNum = 0
  let nameSpace = '-'
  let consoleURL = '-'
  const nonCompliant = []
  policiesUnderCluster.forEach(policy => {
    if (policy.clusterNS && typeof policy.clusterNS === 'object' && policy.clusterNS[clusterName]) {
      nameSpace = policy.clusterNS[clusterName]
    }

    if (policy.clusterConsoleURL && typeof policy.clusterConsoleURL === 'object' && policy.clusterConsoleURL[clusterName]) {
      consoleURL = policy.clusterConsoleURL[clusterName]
    }

    const statuses = _.get(policy, 'raw.status.status')
    if (Array.isArray(statuses) && statuses.length > 0) {
      statuses.forEach(status => {
        const clusterNameTemp = _.get(status, 'clustername', '')
        const compliantTemp = _.get(status, 'compliant', '')
        if (clusterNameTemp.trim().toLowerCase() === clusterName.trim().toLowerCase()) {
          if (compliantTemp.trim().toLowerCase() === 'compliant') {
            compliantNum += 1
          } else if (compliantTemp.trim().toLowerCase() === 'noncompliant') {
            noncompliantNum += 1
            nonCompliant.push(_.get(policy, 'metadata.name', '-'))
          } else {
            nonCompliant.push(_.get(policy, 'metadata.name', '-'))
          }
        }
      })
    }
  })

  return {
    cluster: clusterName,
    namespace: nameSpace,
    violation: `${noncompliantNum}/${policiesUnderCluster.length}/${policiesUnderCluster.length-compliantNum-noncompliantNum}`,
    nonCompliant: nonCompliant,
    consoleURL: consoleURL,
  }
}

export const formatPoliciesToClustersTableData = (policies) => {
  const result = []
  const map = new Map()
  if (policies) {
    policies.forEach((policy) => {
      const statuses = _.get(policy, 'raw.status.status', {})
      Array.isArray(statuses) && statuses.forEach((cluster) =>
      {
        if (!map.has(cluster.clustername)) {
          map.set(cluster.clustername, [])
        }
        map.get(cluster.clustername).push(policy)
      })
    })

    for (const [key, value] of map.entries()) {
      result.push(formatPolicyClusterView(key, value))
    }
  }
  return result
}

export const formatExpandablePolicies = (policies) => {
  const result = []
  if (policies) {
    policies.forEach(policy => {
      if(policy) {
        const subItems = [{name: 'policy.pb', items: policy.placementBindings ? policy.placementBindings.map(pb => pb.metadata.name) : []},
          {name: 'policy.pp', items: policy.placementPolicies ? policy.placementPolicies.map(pp => pp.metadata.name) : []}]
        result.push({...policy, subItems})
      }
    })
  }
  return result
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import React from 'react'
import TruncateText from '../components/common/TruncateText'
import config from '../../lib/shared/config'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'cluster',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.policy.clusters.sidepanel',
    'table.actions.launch.cluster'
  ],
  tableKeys: [
    {
      msgKey: 'table.header.cluster.name',
      resourceKey: 'cluster',
      transformFunction: createClusterLink,
    },
    {
      msgKey: 'table.header.cluster.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.violation',
      resourceKey: 'violation',
    },
    {
      msgKey: 'table.header.violated',
      resourceKey: 'nonCompliant',
      transformFunction: getClusterViolationLabels,
    }
  ],
  clusterViolatedSidePanel: {
    headerRows: ['', 'table.header.policy.name', 'table.header.rule.violation', 'table.header.control'],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.reason'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'metadata.name',
          },
          {
            resourceKey: 'violatedNum',
          },
          {
            resourceKey: `metadata.annotations["${config.mcmPolicyPrefix}/controls"]`,
          }
        ]
      }
    ]
  },
}

export function getClusterViolationLabels(item) {
  return getTruncatedText(item.nonCompliant.join(', '))
}

export function getTruncatedText(item){
  return <TruncateText text={item} />
}

export function createClusterLink(item){
  if (item && item.cluster && item.namespace) {
    return <a href={`${config.clusterContextPath}/${item.namespace}/${item.cluster}`}>{item.cluster}</a>
  }
  else if (item && item.cluster) {
    return item.cluster
  }
  return '-'
}

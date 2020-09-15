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
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons'
import dangerColor from '@patternfly/react-tokens/dist/js/global_danger_color_100'
import okColor from '@patternfly/react-tokens/dist/js/global_palette_green_500'
import warningColor from '@patternfly/react-tokens/dist/js/global_warning_color_100'
import _ from 'lodash'
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
      transformFunction: getCompliantStatus,
    },
    {
      msgKey: 'table.header.violated',
      resourceKey: 'nonCompliant',
      transformFunction: getClusterViolationLabels,
    }
  ],
  clusterViolatedSidePanel: {
    headerRows: ['', 'table.header.policy.name', 'table.header.rule.violation', 'table.header.control'],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.timestamp'],
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
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
          }
        ]
      }
    ]
  },
}

export function getCompliantStatus(item) {
  const statusArray = _.get(item, 'violation').split('/')
  return (
    <div className='violationCell'>
      { parseInt(statusArray[0]) > 0 ?
        <ExclamationCircleIcon color={dangerColor.value} /> :
        <CheckCircleIcon color={okColor.value} /> }
      { parseInt(statusArray[2]) > 0 ? <ExclamationTriangleIcon color={warningColor.value} /> : null }
      {`${statusArray[0]}/${statusArray[1]}`}
    </div>
  )
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

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
import _ from 'lodash'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'
import {getCategories, getControls, getStandards} from './hcm-compliances'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.policy.policies.sidepanel',
    'table.actions.edit',
    'table.actions.disable',
    'table.actions.enforce',
    'table.actions.remove',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.policy.name',
      resourceKey: 'metadata.name',
      transformFunction: createComplianceLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.remediation',
      information: 'grc.remediation.tooltip',
      resourceKey: 'remediation',
    },
    {
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
      transformFunction: getPolicyCompliantStatus
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
      transformFunction: getStandards,
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
      transformFunction: getCategories
    },
    {
      msgKey: 'table.header.controls',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
      transformFunction: getControls,
    },
  ],
  policyViolatedSidePanel: {
    // title: 'policy.violated.cluster',
    headerRows: ['', 'table.header.cluster.name', 'table.header.rule.violation', ''],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.timestamp'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'metadata.name',
          },
          {
            resourceKey: 'violated',
          },
          {
            resourceKey: 'status.consoleURL',
            transformFunction: createClusterLaunchLink,
          }
        ]
      }
    ]
  },
}

export function getPolicyCompliantStatus(item) {
  const clusterCompliant =  _.get(item, 'clusterCompliant', '-')
  if (clusterCompliant === '-') {
    return (
      <div className='violationCell'>
        <YellowExclamationTriangleIcon  />{clusterCompliant}
      </div>
    )
  }
  const statusArray = _.get(item, 'clusterCompliant').split('/')
  return (
    <div className='violationCell'>
      { parseInt(statusArray[0]) > 0 ?
        <RedExclamationCircleIcon /> :
        <GreenCheckCircleIcon /> }
      { parseInt(statusArray[2]) > 0 && <YellowExclamationTriangleIcon /> }
      {`${statusArray[0]}/${statusArray[1]}`}
    </div>
  )
}

export function createComplianceLink(item = {}, ...param){
  if (param[2]) {
    return item.metadata.name
  } else if (item && item.metadata)
  {
    if (item.raw.kind === 'Compliance') {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name} (Deprecated)</Link>
    }
    else {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.namespace)}/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
    }
  }
  return undefined
}

export function createClusterLaunchLink(item = {}, ...param) {
  if (param[1] === 'status.consoleURL') {
    // If a cluster doesn't have a link, fall back to '-'
    const result = _.get(item, param[1], '-')
    return result !== '' ? result : '-'
  } else {
    return undefined
  }
}


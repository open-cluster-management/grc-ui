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
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'
import {getCategories, getControls, getStandards} from './hcm-compliances'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.policy.policies.sidepanel',
    'table.actions.edit',
    'table.actions.disable',
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
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: `metadata.annotations["${config.mcmPolicyPrefix}/standards"]`,
      transformFunction: getStandards,
    },
    {
      msgKey: 'table.header.controls',
      resourceKey: `metadata.annotations["${config.mcmPolicyPrefix}/controls"]`,
      transformFunction: getControls,
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: `metadata.annotations["${config.mcmPolicyPrefix}/categories"]`,
      transformFunction: getCategories
    },
  ],
  policyViolatedSidePanel: {
    // title: 'policy.violated.cluster',
    headerRows: ['', 'table.header.cluster.name', 'table.header.rule.violation', ''],
    subHeaders: ['table.header.name', 'table.header.message', 'table.header.reason'],
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
            resourceKey: 'spec.consoleURL',
          }
        ]
      }
    ]
  },
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


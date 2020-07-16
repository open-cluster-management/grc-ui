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

import React from 'react'
import config from '../../lib/shared/config'
import { getTruncatedText } from './hcm-policies-cluster'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'nameSpace',
  tableActions: [
    'table.actions.policy.applications.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.application',
      resourceKey: 'name',
      transformFunction: createApplicationLink,
    },
    {
      msgKey: 'string.namespace',
      resourceKey: 'nameSpace',
    },
    {
      msgKey: 'table.header.violation',
      resourceKey: 'violations',
    },
    {
      msgKey: 'table.header.violated',
      resourceKey: 'violatedPolicies',
      transformFunction: getAppViolationLabels,
    }
  ],
  applicationViolatedSidePanel: {
    headerRows: ['', 'table.header.policy.name', 'table.header.rule.violation', 'table.header.control', 'table.header.cluster',],
    subHeaders: ['string.name', 'table.header.message', 'table.header.reason', '',],
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
          },
          {
            resourceKey: 'cluster',
          },
        ]
      }
    ]
  },
}

export function getAppViolationLabels(item) {
  if (item && Array.isArray(item.violatedPolicies) && item.violatedPolicies.length > 0){
    let violatedPoliciesString = ''
    item.violatedPolicies.forEach((violatedPolicy, index) => {
      if(violatedPolicy.name && typeof violatedPolicy.name === 'string') {
        if (index+1 < item.violatedPolicies.length) {
          violatedPoliciesString = `${violatedPoliciesString}${violatedPolicy.name}, `
        }
        else {
          violatedPoliciesString = `${violatedPoliciesString}${violatedPolicy.name}`
        }
      }
    })
    return getTruncatedText(violatedPoliciesString)
  }
  return '-'
}

export function createApplicationLink(item){
  if (item && item.name && item.nameSpace) {
    return <a href={`${config.contextPath}/applications/${item.nameSpace}/${item.name}`}>{item.name}</a>
  }
  else if (item && item.name) {
    return item.name
  }
  return '-'
}

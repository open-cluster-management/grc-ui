/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import _ from 'lodash'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'cluster',
  secondaryKey: 'metadata.namespace',
  tableActions: [
    'table.actions.finding.clusterFindings.sidepanel',
  ],
  tableKeys: [
    {
      msgKey: 'table.header.cluster.name',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'overview.recent.activity.severity.high',
      resourceKey: 'severity',
    },
    {
      msgKey: 'table.header.highSeverity',
      resourceKey: 'highSeverity',
      transformFunction: getHighSeverityObjTostring,
    },
  ],
  clusterFindingSidePanel: {
    headerRows: ['', 'table.header.findingName', 'table.header.severity'],
    subHeaders: ['tabs.detail', ''],
    rows: [
      {
        cells: [
          {
            resourceKey: 'shortDescription',
          },
          {
            resourceKey: 'finding.severity',
          }
        ]
      }
    ]
  },
}

export function getHighSeverityObjTostring(item) {
  const highSeverityMap = _.get(item, 'highSeverity')
  let highSeverityString = ''
  if (highSeverityMap) {
    Object.keys(highSeverityMap).forEach((key) => {
      highSeverityString = `${highSeverityString} ${key} (${highSeverityMap[key]}),`
    })
  }
  highSeverityString = highSeverityString.trim()
  return highSeverityString.substring(0, highSeverityString.length-1)
}

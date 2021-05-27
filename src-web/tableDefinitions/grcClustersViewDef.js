/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */


'use strict'

import {
  buildClusterLink,
  getClusterCompliantStatus,
  getClusterViolationLabels,
} from './utils'
import {
  breakWord,
  wrappable,
} from '@patternfly/react-table'

export default {
  tableActions: [
    'table.actions.launch.cluster'
  ],
  tableKeys: [
    {
      label: 'cluster',
      msgKey: 'table.header.cluster.name',
      resourceKey: 'cluster',
      searchable: true,
      sortable: true,
      sortLabel: 'cluster.rawData',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildClusterLink,
    },
    {
      label: 'namespace',
      msgKey: 'table.header.cluster.namespace',
      resourceKey: 'namespace',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
    },
    {
      label: 'clusterCompliant',
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
      searchable: true,
      sortable: true,
      sortLabel: 'clusterCompliant.rawData',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: getClusterCompliantStatus,
    },
    {
      label: 'nonCompliant',
      msgKey: 'table.header.violated',
      searchable: true,
      resourceKey: 'nonCompliant',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: getClusterViolationLabels,
    },
    // Row metadata
    {
      hidden: true,
      label: 'consoleURL',
      resourceKey: 'consoleURL',
    }
  ],
  sortBy: {
    index: 2,
    direction: 'desc',
  }
}

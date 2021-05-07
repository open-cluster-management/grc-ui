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
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildClusterLink,
    },
    {
      label: 'namespace',
      msgKey: 'table.header.cluster.namespace',
      resourceKey: 'namespace',
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
    },
    {
      label: 'clusterCompliant',
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: getClusterCompliantStatus,
    },
    {
      label: 'nonCompliant',
      msgKey: 'table.header.violated',
      resourceKey: 'nonCompliant',
      sortable: true,
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

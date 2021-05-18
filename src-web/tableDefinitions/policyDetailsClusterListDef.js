/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  getLabels,
  getDecisionCount,
  getDecisionList,
} from './utils'
import {
  breakWord,
  wrappable
} from '@patternfly/react-table'

export default {
  tableKeys: [
    {
      key: 'clusterSelector',
      label: 'clusterSelector',
      resourceKey: 'placementPolicies',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      msgKey: 'table.header.cluster.selector',
      transformFunction: getLabels,
    },
    {
      key: 'cluster',
      label: 'clusters',
      resourceKey: 'clusters',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      msgKey: 'table.header.clusters',
      transformFunction: getDecisionCount,
    },
    {
      key: 'decisions',
      label: 'status',
      resourceKey: 'status',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      msgKey: 'table.header.status',
      transformFunction: getDecisionList,
    },
  ],
}

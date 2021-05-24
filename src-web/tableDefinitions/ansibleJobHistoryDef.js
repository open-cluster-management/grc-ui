/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  breakWord,
  wrappable,
  cellWidth,
  sortable
} from '@patternfly/react-table'
import { buildAnsibleJobStatus } from './utils'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      resourceKey: 'status',
      transforms: [sortable],
      cellTransforms: [breakWord],
      transformFunction: buildAnsibleJobStatus
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      resourceKey: 'message',
      transforms: [cellWidth(50), wrappable, sortable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.started',
      label: 'started',
      resourceKey: 'started',
      transforms: [wrappable, sortable],
      type: 'timestamp'
    },
    {
      msgKey: 'table.header.finished',
      label: 'finished',
      resourceKey: 'finished',
      transforms: [wrappable, sortable],
      type: 'timestamp'
    },
  ],
  sortBy: {
    index: 2,
    direction: 'desc',
  }
}

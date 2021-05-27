/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */


'use strict'

import {
  buildCompliantCellFromMessage,
  statusHistoryMessageTooltip,
} from './utils'
import {
  breakWord,
  wrappable,
  cellWidth,
  sortable
} from '@patternfly/react-table'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      resourceKey: 'status',
      transforms: [wrappable, sortable],
      cellTransforms: [breakWord],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      resourceKey: 'message',
      transforms: [cellWidth(70), wrappable, sortable],
      cellTransforms: [breakWord],
      transformFunction: statusHistoryMessageTooltip
    },
    {
      msgKey: 'table.header.lastReport',
      label: 'timestamp',
      resourceKey: 'timestamp',
      type: 'timestamp'
    },
  ],
  sortBy: {
    index: 2,
    direction: 'desc',
  }
}

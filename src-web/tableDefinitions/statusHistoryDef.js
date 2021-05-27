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
} from '@patternfly/react-table'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      sortable: true,
      resourceKey: 'message',
      transforms: [cellWidth(70), wrappable],
      cellTransforms: [breakWord],
      transformFunction: statusHistoryMessageTooltip
    },
    {
      msgKey: 'table.header.lastReport',
      label: 'timestamp',
      sortable: true,
      resourceKey: 'timestamp',
      transforms: [wrappable],
      type: 'timestamp'
    },
  ],
  sortBy: {
    index: 2,
    direction: 'desc',
  }
}

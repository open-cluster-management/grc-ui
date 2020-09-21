/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import {
  breakWord,
  cellWidth,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import {
  getAge,
  buildCompliantCellFromMessage,
  buildClusterLink,
  buildStatusHistoryLink
} from './utils'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.cluster',
      transforms: [sortable, wrappable],
      transformFunction: buildClusterLink
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transforms: [cellWidth(15), sortable],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.timestamp',
      resourceKey: 'timestamp',
      transforms: [sortable, wrappable],
      transformFunction: getAge,
    },
    {
      msgKey: 'table.header.history',
      transformFunction: buildStatusHistoryLink
    },
  ],
  sortBy: {
    index: 0,
    direction: 'asc',
  }
}


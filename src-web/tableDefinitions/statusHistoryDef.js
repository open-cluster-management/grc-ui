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
      msgKey: 'table.header.compliance',
      label: 'compliance',
      searchable: true,
      sortable: true,
      sortLabel: 'status.rawData',
      resourceKey: 'message', // because the cell content is actually built from the message
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      sortable: true,
      sortLabel: 'message.rawData',
      resourceKey: 'message',
      transforms: [cellWidth(70), wrappable],
      cellTransforms: [breakWord],
      transformFunction: statusHistoryMessageTooltip
    },
    {
      msgKey: 'table.header.lastReport',
      label: 'timestamp',
      sortable: true,
      sortLabel: 'timestamp.rawData',
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

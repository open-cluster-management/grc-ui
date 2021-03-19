/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import {
  breakWord,
  cellWidth,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import {
  buildTimestamp,
  buildCompliantCellFromMessage,
  buildClusterLink,
  buildStatusHistoryLink,
  buildTemplateDetailLink
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
      msgKey: 'table.header.template',
      resourceKey: 'templateName',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [cellWidth(70), sortable, wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildTemplateDetailLink
    },
    {
      msgKey: 'table.header.timestamp',
      resourceKey: 'timestamp',
      transforms: [sortable, wrappable],
      transformFunction: buildTimestamp,
    },
    {
      msgKey: 'table.header.history',
      transforms: [wrappable],
      transformFunction: buildStatusHistoryLink
    },
  ],
  sortBy: {
    index: 1,
    direction: 'desc',
  }
}

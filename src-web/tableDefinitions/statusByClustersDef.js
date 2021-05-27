/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  breakWord,
  cellWidth,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import {
  buildCompliantCellFromMessage,
  buildClusterLink,
  buildStatusHistoryLink,
  buildTemplateDetailLink
} from './utils'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.cluster',
      label: 'cluster',
      searchable: true,
      transforms: [sortable, wrappable],
      transformFunction: buildClusterLink
    },
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      resourceKey: 'status',
      transforms: [cellWidth(15), sortable],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.template',
      label: 'templateName',
      searchable: true,
      resourceKey: 'templateName',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      resourceKey: 'message',
      transforms: [cellWidth(70), sortable, wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildTemplateDetailLink
    },
    {
      msgKey: 'table.header.timestamp',
      label: 'timestamp',
      resourceKey: 'timestamp',
      type: 'timestamp'
    },
    {
      msgKey: 'table.header.history',
      label: 'history',
      transforms: [wrappable],
      transformFunction: buildStatusHistoryLink
    },
  ],
  sortBy: {
    index: 1,
    direction: 'desc',
  }
}

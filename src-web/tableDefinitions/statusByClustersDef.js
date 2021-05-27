/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  breakWord,
  cellWidth,
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
      sortable: true,
      transforms: [sortable, wrappable],
      transforms: [wrappable],
      transformFunction: buildClusterLink
    },
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      sortable: true,
      resourceKey: 'status',
      transforms: [cellWidth(15)],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.template',
      label: 'templateName',
      searchable: true,
      sortable: true,
      resourceKey: 'templateName',
      transforms: [wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      sortable: true,
      resourceKey: 'message',
      transforms: [cellWidth(70), wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildTemplateDetailLink
    },
    {
      msgKey: 'table.header.timestamp',
      label: 'timestamp',
      sortable: true,
      resourceKey: 'timestamp',
      transforms: [wrappable],
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

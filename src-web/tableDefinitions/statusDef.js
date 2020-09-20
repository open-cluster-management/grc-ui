/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import {
  breakWord,
  sortable,
  wrappable,
} from '@patternfly/react-table'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'object.metadata.name',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'object.metadata.namespace',
      transforms: [sortable, wrappable],
    },
    {
      msgKey: 'table.header.message',
      resourceKey: 'object.kind',
      transforms: [sortable, wrappable],
    },
    {
      msgKey: 'table.header.timestamp',
      resourceKey: 'object.apiVersion',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.history',
      resourceKey: 'compliant',
      transforms: [sortable, wrappable],
    },
  ],
  sortBy: {
    index: 0,
    direction: 'asc',
  }
}

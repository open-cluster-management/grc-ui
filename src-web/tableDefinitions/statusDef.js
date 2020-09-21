/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import {
  breakWord,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import { getAge, buildCompliantCellFromMessage } from './utils'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
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
      cellTransforms: [breakWord],
      transformFunction: getAge,
    },
    {
      msgKey: 'table.header.history',
      resourceKey: 'compliant',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
  ],
  sortBy: {
    index: 0,
    direction: 'asc',
  }
}

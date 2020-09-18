/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import { getAge, buildCompliantCellFromMessage } from './utils'
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
      resourceKey: 'status',
      transforms: [wrappable, sortable],
      cellTransforms: [breakWord],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [cellWidth(80), wrappable, sortable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.lastreport',
      resourceKey: 'timestamp',
      transforms: [wrappable, sortable],
      transformFunction: getAge
    },
  ],
  sortBy: {
    index: 2,
    direction: 'asc',
  }
}

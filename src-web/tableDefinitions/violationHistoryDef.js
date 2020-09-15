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
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.lastreport',
      resourceKey: 'timestamp',
      transforms: [sortable, wrappable],
    },
  ],
  sortBy: {
    index: 1,
    direction: 'asc',
  }
}

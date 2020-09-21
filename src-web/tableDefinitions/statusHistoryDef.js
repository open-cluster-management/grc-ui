/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import { getAge, buildCompliantCellFromMessage } from './utils'
import {
  breakWord,
  wrappable,
  cellWidth
} from '@patternfly/react-table'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: buildCompliantCellFromMessage
    },
    {
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [cellWidth(70), wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.lastreport',
      resourceKey: 'timestamp',
      transforms: [wrappable],
      transformFunction: getAge,
    },
  ]
}

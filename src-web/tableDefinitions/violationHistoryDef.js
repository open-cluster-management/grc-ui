/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import { getAge, buildCompliantCellFromMessage, parseMessage } from './utils'
import {
  breakWord,
  wrappable,
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
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: parseMessage
    },
    {
      msgKey: 'table.header.lastreport',
      resourceKey: 'timestamp',
      transforms: [wrappable],
      transformFunction: getAge,
    },
  ]
}

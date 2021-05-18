/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */


'use strict'

import React from 'react'
import {
  breakWord,
  wrappable,
  cellWidth,
  sortable
} from '@patternfly/react-table'
import _ from 'lodash'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'
import msgs from '../nls/platform.properties'


const buildAnsibleJobStatus = (item, locale) => {
  const message = _.get(item, 'status', '-')
  if (message.toLowerCase() === 'successful') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.successful', locale)}</div>
  } else if (message.toLowerCase() === 'failed') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.failed', locale)}</div>
  } else if (message.toLowerCase() === '-') {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {message}</div>
  }
}

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      resourceKey: 'status',
      transforms: [sortable],
      cellTransforms: [breakWord],
      transformFunction: buildAnsibleJobStatus
    },
    {
      msgKey: 'table.header.message',
      label: 'message',
      searchable: true,
      resourceKey: 'message',
      transforms: [cellWidth(50), wrappable, sortable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.started',
      label: 'started',
      resourceKey: 'started',
      transforms: [wrappable, sortable],
      type: 'timestamp'
    },
    {
      msgKey: 'table.header.finished',
      label: 'finished',
      resourceKey: 'finished',
      transforms: [wrappable, sortable],
      type: 'timestamp'
    },
  ],
  sortBy: {
    index: 2,
    direction: 'desc',
  }
}

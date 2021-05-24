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
  let ansibleJobStatus = _.get(item, 'status', '-')
  ansibleJobStatus = (ansibleJobStatus && typeof ansibleJobStatus === 'string')
    ? ansibleJobStatus.trim().toLowerCase() : '-'

  switch (ansibleJobStatus) {
    case 'successful':
      ansibleJobStatus = <div><GreenCheckCircleIcon /> {msgs.get('table.cell.successful', locale)}</div>
      break
    case 'failed':
      ansibleJobStatus = <div><RedExclamationCircleIcon /> {msgs.get('table.cell.failed', locale)}</div>
      break
    case '-':
      ansibleJobStatus = <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
      break
    default :
      ansibleJobStatus = <div><YellowExclamationTriangleIcon /> {ansibleJobStatus}</div>
      break
  }

  return ansibleJobStatus
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

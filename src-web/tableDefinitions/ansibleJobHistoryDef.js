/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import {
  breakWord,
  wrappable,
} from '@patternfly/react-table'
import _ from 'lodash'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'
import msgs from '../nls/platform.properties'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.status',
      label: 'status',
      searchable: true,
      sortable: true,
      resourceKey: 'status',
      cellTransforms: [breakWord],
      transformFunction: buildAnsibleJobStatus
    },
    {
      msgKey: 'table.header.started',
      label: 'started',
      sortable: true,
      sortLabel: 'started.rawData',
      resourceKey: 'started',
      transforms: [wrappable],
      type: 'timestamp'
    },
    {
      msgKey: 'table.header.finished',
      label: 'finished',
      sortable: true,
      sortLabel: 'finished.rawData',
      resourceKey: 'finished',
      transforms: [wrappable],
      type: 'timestamp'
    },
    {
      label: 'link',
      transformFunction: buildViewJobLink
    },
  ],
  sortBy: {
    index: 1,
    direction: 'desc',
  }
}

export function buildAnsibleJobStatus(item, locale) {
  let ansibleJobStatus = _.get(item, 'status', '-')
  ansibleJobStatus = (ansibleJobStatus && typeof ansibleJobStatus === 'string')
    ? ansibleJobStatus.trim().toLowerCase() : '-'

  switch (ansibleJobStatus) {
    case 'successful':
      ansibleJobStatus = <div><GreenCheckCircleIcon tooltip={item.message} /> {msgs.get('table.cell.successful', locale)}</div>
      break
    case 'error':
    case 'failed':
      ansibleJobStatus = <div><RedExclamationCircleIcon tooltip={item.message} /> {msgs.get('table.cell.failed', locale)}</div>
      break
    case '-':
      ansibleJobStatus = <div><YellowExclamationTriangleIcon tooltip={item.message} /> {msgs.get('table.cell.nostatus', locale)}</div>
      break
    default :
      ansibleJobStatus = <div><YellowExclamationTriangleIcon tooltip={item.message} /> {ansibleJobStatus}</div>
      break
  }

  return ansibleJobStatus
}

export function buildViewJobLink(item, locale) {
  const job = _.get(item, 'job')
  if (job) {
    const jobNamespace = job.split('/')[0]
    const jobName = job.split('/')[1]
    return (
      <a target='_blank' rel='noopener noreferrer'
        href={`/search?filters={%22textsearch%22:%22cluster%3Alocal-cluster%20kind%3Aansiblejob%20namespace%3A${jobNamespace}%20name%3A${jobName}%22}`}>
          {msgs.get('table.actions.view.job', locale)}
      </a>
    )
  } else {
    return ''
  }
}

/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'
import config from '../../lib/shared/config'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'
import TableTimestamp from '../components/common/TableTimestamp'
import msgs from '../../nls/platform.properties'

export const transform = (items, def, locale) => {
  const rows = items.map(item => {
    return def.tableKeys.map(key => {
      let value = _.get(item, key.resourceKey)
      if (key.type === 'timestamp') {
        return moment.unix(value).format('MMM Do YYYY \\at h:mm A')
      } else if (key.type === 'i18n') {
        return msgs.get(key.resourceKey, locale)
      } else if (key.type === 'boolean') {
        value = (Boolean(value)).toString()
        return msgs.get(value, locale)
      } else if (key.transformFunction && typeof key.transformFunction === 'function') {
        return { title: key.transformFunction(item, locale) }
      } else {
        return (value || value === 0) ? value : '-'
      }
    })
  })

  const columns = def.tableKeys.map(key => {
    return {
      title: key.msgKey ? msgs.get(key.msgKey, locale): '',
      ...key
    }
  })

  const sortBy = def.sortBy ? def.sortBy : { index: 0, direction: 'asc' } // default if doesn't exist

  return { columns, rows, sortBy }
}

export const buildCompliantCell = (item, locale) => {
  const compliant = _.get(item, 'compliant', '-')
  if (compliant.toLowerCase() === 'compliant') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.compliant', locale)}</div>
  } else if (compliant.toLowerCase() === 'noncompliant') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.noncompliant', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  }
}

export const buildCompliantCellFromMessage = (item, locale) => {
  const message = _.get(item, 'message', '-')
  const compliant = message.split(';')[0]
  if (compliant.toLowerCase() === 'compliant') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.compliant', locale)}</div>
  } else if (compliant.toLowerCase() === 'noncompliant') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.noncompliant', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  }
}

export const buildTimestamp = (item) => {
  const createdTime = _.get(item, 'timestamp')
  return <TableTimestamp timestamp={createdTime} />
}

export function buildClusterLink(item) {
  const cluster = _.get(item, 'cluster')
  const clusterNamespace = _.get(item, 'clusterNamespace')
  if (cluster && clusterNamespace) {
    const clusterURL = `${config.clusterContextPath}/${clusterNamespace}/${cluster}`
    return <a
      rel='noopener noreferrer'
      href={clusterURL}>
      {cluster}
    </a>
  } else if (cluster) {
    return cluster
  }
  return '-'
}

export function buildStatusHistoryLink(item, locale) {
  const policyName = _.get(item, 'policyName')
  const policyNamespace = _.get(item, 'policyNamespace')
  const cluster = _.get(item, 'cluster')
  const templateName = _.get(item, 'templateName')
  if (policyName && policyNamespace && cluster && templateName) {
    const statusHistoryURL = `/multicloud/policies/all/${policyNamespace}/${policyName}/status/${cluster}/templates/${templateName}/history`
    return <Link to={statusHistoryURL}>
      {msgs.get('table.actions.view.history', locale)}
    </Link>
  }
  return '-'
}

export function buildMessageDetailLink(item, locale) {
  const message = _.get(item, 'message')
  const policyName = _.get(item, 'policyName')
  const policyNamespace = _.get(item, 'policyNamespace')
  const cluster = _.get(item, 'cluster')
  const templateName = _.get(item, 'templateName')
  const apiVersion = _.get(item, 'apiVersion')
  const kind = _.get(item, 'kind')
  if (message && policyName && policyNamespace && cluster && templateName && apiVersion && kind) {
    const statusHistoryURL = `/multicloud/policies/all/${policyNamespace}/${policyName}/template/${cluster}/${apiVersion}/${kind}/${templateName}`
    return <div>
      {`${message} `}
      <Link to={statusHistoryURL}>
        {msgs.get('table.actions.view.details', locale)}
      </Link>
    </div>
  }
  return ''
}

/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import React from 'react'
import moment from 'moment'
import lodash from 'lodash'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'
import msgs from '../../nls/platform.properties'

export const transform = (items, def, locale) => {
  const rows = items.map(item => {
    return def.tableKeys.map(key => {
      let value = lodash.get(item, key.resourceKey)
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
  const compliant = lodash.get(item, 'compliant', '-')
  if (compliant.toLowerCase() === 'compliant') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.compliant', locale)}</div>
  } else if (compliant.toLowerCase() === 'noncompliant') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.noncompliant', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  }
}

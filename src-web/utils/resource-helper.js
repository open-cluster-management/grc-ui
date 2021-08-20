/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */
'use strict'

import _ from 'lodash'
import msgs from '../nls/platform.properties'

export const normalizeChannelType = chType => {
  const channelType = (chType && chType.toLowerCase()) || ''
  return channelType === 'github' ? 'git' : channelType
}

export const groupByChannelType = channels =>
  _.groupBy(channels, ch => normalizeChannelType(ch.type))

export const getChannelLabel = (chType, count, locale) => {
  const label = msgs.get(`channel.type.${chType}`, locale)
  const optionalCount = count > 1 ? ` (${count})` : ''
  return label + optionalCount
}

export const CHANNEL_TYPES = ['git', 'helmrepo', 'namespace', 'objectbucket']

export const getSearchLink = (params = {}) => {
  const { properties, showRelated } = params
  let textsearch = ''

  _.entries(properties).forEach(([key, value]) => {
    textsearch = `${textsearch}${textsearch ? ' ' : ''}${key}:${
      Array.isArray(value) ? value.join() : value
    }`
  })

  const queryParams = []
  if (textsearch) {
    queryParams.push(
      `filters={"textsearch":"${encodeURIComponent(textsearch)}"}`
    )
  }
  if (showRelated) {
    queryParams.push(`showrelated=${showRelated}`)
  }
  return `/search${queryParams.length ? '?' : ''}${queryParams.join('&')}`
}

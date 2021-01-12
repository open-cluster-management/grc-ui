/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'
import _ from 'lodash'

export const buildSelfLinK = (data, kind) => {
  const apiGroupVersion = _.get(data, 'raw.apiVersion')
  const namespace = _.get(data, 'metadata.namespace')
  const name = _.get(data, 'metadata.name')
  const selfLink = _.get(data, 'metadata.selfLink')
  if (apiGroupVersion && namespace && kind && name) {
    return `/apis/${apiGroupVersion}/namespaces/${namespace}/${kind}/${name}`
  } else if (selfLink) {
    return selfLink
  }
  return ''
}

/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'
import _ from 'lodash'

export const buildSelfLinK = (data) => {
  const apiGroupVersion = _.get(data, 'apiVersion', 'raw.apiVersion')
  const resourceKind = _.get(data, 'kind')
  const namespace = _.get(data, 'metadata.namespace')
  const name = _.get(data, 'metadata.name')
  let kind
  let selfLink = ''
  if (apiGroupVersion && namespace && resourceKind && name) {
    switch (resourceKind.trim().toLowerCase()) {
      case 'placementrule':
        kind = 'placementrules'
        break
      case 'placementbinding':
        kind = 'placementbindings'
        break
      default:
        kind = 'policies'
        break
    }
    selfLink = `/apis/${apiGroupVersion}/namespaces/${namespace}/${kind}/${name}`
  } else if (_.get(data, 'metadata.selfLink')) {
    selfLink = _.get(data, 'metadata.selfLink')
  }
  return selfLink
}

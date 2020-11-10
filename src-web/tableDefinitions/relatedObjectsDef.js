/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import React from 'react'
import _ from 'lodash'
import {
  breakWord,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import { buildCompliantCell } from './utils'
import msgs from '../../nls/platform.properties'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'object.metadata.name',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'object.metadata.namespace',
      transforms: [sortable, wrappable],
    },
    {
      msgKey: 'table.header.kind',
      resourceKey: 'object.kind',
      transforms: [sortable, wrappable],
    },
    {
      msgKey: 'table.header.apiGroups',
      resourceKey: 'object.apiVersion',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.compliant',
      resourceKey: 'compliant',
      transforms: [sortable, wrappable],
      transformFunction: buildCompliantCell,
    },
    {
      msgKey: 'table.header.reason',
      resourceKey: 'reason',
      transforms: [sortable, wrappable],
    },
    {
      transformFunction: buildViewYamlLink
    },
  ],
  sortBy: {
    index: 0,
    direction: 'asc',
  }
}

function buildViewYamlLink(item, locale) {
  const selfLink = _.get(item, 'object.metadata.selfLink')
  if (selfLink) {
    return <a target='_blank' rel='noopener noreferrer'
      href={`/multicloud/details/${_.get(item, 'cluster')}${selfLink}`}>{msgs.get('table.actions.view.yaml', locale)}</a>
  }
  return ''
}

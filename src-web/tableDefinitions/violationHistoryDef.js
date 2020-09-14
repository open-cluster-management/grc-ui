/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import React from 'react'
import lodash from 'lodash'
import {
  breakWord,
  sortable,
  wrappable,
} from '@patternfly/react-table'
import msgs from '../../nls/platform.properties'

export default {
  tableKeys: [
    {
      msgKey: 'table.header.message',
      resourceKey: 'message',
      transforms: [sortable, wrappable],
      cellTransforms: [breakWord],
    },
    {
      msgKey: 'table.header.lastreport',
      resourceKey: 'timestamp',
      transforms: [sortable, wrappable],
    },
    {
      transformFunction: buildViewYamlLink
    },
  ],
  sortBy: {
    index: 1,
    direction: 'asc',
  }
}

function buildViewYamlLink(item, locale) {
  const selfLink = lodash.get(item, 'object.metadata.selfLink')
  if (selfLink) {
    return <a target='_blank' rel='noopener noreferrer'
      href={`/multicloud/details/${lodash.get(item, 'cluster')}${selfLink}`}>{msgs.get('table.actions.view.yaml', locale)}</a>
  }
  return ''
}

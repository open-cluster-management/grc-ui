/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { getResourceType } from '../../../lib/client/resource-helper'
import _uniqueId from 'lodash/uniqueId'

const ResourceTableRowExpandableContent = ({ items }, context) =>
  <StructuredListWrapper>
    <StructuredListHead>
      <StructuredListRow head key={_uniqueId('SLRowHeader')}>
        <StructuredListCell head>
          <div>{msgs.get('formfield.name', context.locale)}</div>
        </StructuredListCell>
        <StructuredListCell head>
          {msgs.get('formfield.type', context.locale)}
        </StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {items.map(item => (
        <StructuredListRow key={_uniqueId('item.resource')} data-row-name={item.resource} >
          <StructuredListCell noWrap>{item.resource}</StructuredListCell>
          <StructuredListCell noWrap>{getResourceType(item, context.locale)}</StructuredListCell>
        </StructuredListRow>
      ))}
    </StructuredListBody>
  </StructuredListWrapper>

ResourceTableRowExpandableContent.contextTypes = {
  locale: PropTypes.string
}

ResourceTableRowExpandableContent.propTypes = {
  items: PropTypes.array,
}

export default ResourceTableRowExpandableContent

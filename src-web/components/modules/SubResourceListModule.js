/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import SimpleTable from '../common/SimpleTable'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/resource-overview.scss')
})

const ResourceOverviewModule = ({
  staticResourceData,
  items,
  listSubItems,
  linkFixedName,
}) => {
  return (
    <SimpleTable
      title={staticResourceData.title}
      headerRows={staticResourceData.headerRows}
      rows={staticResourceData.rows}
      data={items}
      listSubItems={listSubItems}
      subHeaders={staticResourceData.subHeaders}
      linkFixedName={linkFixedName}
    />
  )
}

ResourceOverviewModule.contextTypes = {
  locale: PropTypes.string
}

ResourceOverviewModule.propTypes = {
  items: PropTypes.array,
  linkFixedName: PropTypes.object,
  listSubItems: PropTypes.bool,
  staticResourceData: PropTypes.object
}



export default ResourceOverviewModule

/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
} from '@patternfly/react-core'
import { AcmTable } from '@open-cluster-management/ui-components'
import { LocaleContext } from '../common/LocaleContext'
import statusHistoryDef from '../../tableDefinitions/statusHistoryDef'
import { transform_new } from '../../tableDefinitions/utils'
import msgs from '../../nls/platform.properties'

class PolicyStatusHistoryView extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext

  render() {
    const { items=[], cluster, template } = this.props
    const { locale } = this.context

    const tableData = transform_new(items, statusHistoryDef, locale)

    return (
      <div className='policy-status-history-view'>
        <div className='table'>
          <Title className='title' headingLevel="h3">{cluster}</Title>
          <Title className='title' headingLevel="h4">{`${msgs.get('policy.template', locale)}: ${template}`}</Title>
          <br></br>
          <AcmTable
            items={tableData.rows}
            columns={tableData.columns}
            keyFn={(item) => item.uid.toString()}
            gridBreakPoint=''
          />
        </div>
      </div>

    )
  }
}

PolicyStatusHistoryView.propTypes = {
  cluster: PropTypes.string,
  items: PropTypes.array,
  template: PropTypes.string
}

export default PolicyStatusHistoryView

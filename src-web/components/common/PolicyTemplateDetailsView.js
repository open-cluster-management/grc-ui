/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  // Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core'
import {
  sortable,
} from '@patternfly/react-table'
// import { PlusCircleIcon } from '@patternfly/react-icons'
import jsYaml from 'js-yaml'
import lodash from 'lodash'
import YamlEditor from './YamlEditor'
import PatternFlyTable from './PatternFlyTable'
import { LocaleContext } from './LocaleContext'
import msgs from '../../../nls/platform.properties'

class PolicyTemplateDetailsView extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = LocaleContext
  render() {
    const { template } = this.props
    const { locale } = this.context
    const relatedObjects = lodash.get(template, 'status.relatedObjects', [])
    const rows = relatedObjects.map(o => {
      return [
        lodash.get(o, 'object.metadata.name', '-'),
        lodash.get(o, 'object.metadata.namespace', '-'),
        lodash.get(o, 'object.kind', '-'),
        lodash.get(o, 'object.apiVersion', '-'),
        lodash.get(o, 'compliant', '-'),
        lodash.get(o, 'reason', '-'),
        { title: <a target='_blank' rel='noopener noreferrer'
          href={`/multicloud/details/${lodash.get(template, 'metadata.namespace')}${lodash.get(o, 'object.metadata.selfLink')}`}>{msgs.get('table.actions.view.yaml', locale)}</a> }
      ]
    })

    const tableData = {
      columns: [
        { title: msgs.get('table.header.name', locale), transforms: [sortable] },
        { title: msgs.get('table.header.namespace', locale), transforms: [sortable] },
        { title: msgs.get('table.header.kind', locale), transforms: [sortable] },
        { title: msgs.get('table.header.apiGroups', locale), transforms: [sortable] },
        { title: msgs.get('table.header.compliant', locale), transforms: [sortable] },
        { title: msgs.get('table.header.reason', locale), transforms: [sortable] },
        { title: '' },
      ],
      sortBy: {
        index: 4,
        direction: 'asc',
      }
    }
    return (
      <div className='policy-template-details-view'>
        <div className='details'>
          <div className='overview'>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.name', locale)}</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'metadata.name', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.cluster', locale)}</DescriptionListTerm>
                <DescriptionListDescription>
                  {lodash.get(template, 'metadata.namespace', '-')}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.kind', locale)}</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'kind', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.apiGroups', locale)}</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'apiVersion', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.compliant', locale)}</DescriptionListTerm>
                <DescriptionListDescription>
                  {lodash.get(template, 'status.compliant', '-')}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>{msgs.get('table.header.violation.detail', locale)}</DescriptionListTerm>
                <DescriptionListDescription>
                  {JSON.stringify(lodash.get(template, 'status.compliancyDetails', '-'))}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>
          <div className='yaml'>
            <YamlEditor
              width={'100%'}
              height={'500px'}
              readOnly
              yaml={jsYaml.safeDump(template)} />
          </div>
        </div>
        <div className='table'>
          <PatternFlyTable columns={tableData.columns} rows={rows} sortBy={tableData.sortBy} />
        </div>
      </div>

    )
  }
}


PolicyTemplateDetailsView.propTypes = {
  template: PropTypes.object,
}

export default PolicyTemplateDetailsView

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
import YamlEditor from '../common/YamlEditor'
import PatternFlyTable from './PatternFlyTable'

class PolicyTemplateDetails extends React.Component {
  constructor(props) {
    super(props)
    this.tableData = {
      columns: [
        { title: 'Name', transforms: [sortable] },
        { title: 'Namespace', transforms: [sortable] },
        { title: 'Kind', transforms: [sortable] },
        { title: 'API version', transforms: [sortable] },
        { title: 'Compliant', transforms: [sortable] },
        { title: 'Reason', transforms: [sortable] },
        { title: '' },
      ],
      sortBy: {
        index: 4,
        direction: 'asc',
      }
    }
  }


  render() {
    const { template } = this.props
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
          href={`/multicloud/details/${lodash.get(template, 'metadata.namespace')}${lodash.get(o, 'object.metadata.selfLink')}`}>view</a> }
      ]
    })
    console.log(rows)
    return (
      <React.Fragment>
        <div className='policy-template-details'>
          <div className='overview'>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'metadata.name', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Cluster</DescriptionListTerm>
                <DescriptionListDescription>
                  {lodash.get(template, 'metadata.namespace', '-')}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Kind</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'kind', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>API Version</DescriptionListTerm>
                <DescriptionListDescription>{lodash.get(template, 'apiVersion', '-')}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Compliant</DescriptionListTerm>
                <DescriptionListDescription>
                  {lodash.get(template, 'status.compliant', '-')}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Details</DescriptionListTerm>
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
          <PatternFlyTable columns={this.tableData.columns} rows={rows} sortBy={this.tableData.sortBy} />
        </div>

      </React.Fragment>

    )
  }
}


PolicyTemplateDetails.propTypes = {
  template: PropTypes.object,
}

export default PolicyTemplateDetails

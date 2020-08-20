/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  // Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription
} from '@patternfly/react-core'
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  // SortByDirection
} from '@patternfly/react-table'
// import { PlusCircleIcon } from '@patternfly/react-icons'
import jsYaml from 'js-yaml'
import YamlEditor from '../common/YamlEditor'

const PolicyTemplateDetails = ({ template }) => {
  console.log(template)
  const tableData = {
    columns: [
      { title: 'Repositories', transforms: [sortable] },
      'Branches',
      { title: 'Pull requests', transforms: [sortable] },
      'Workspaces',
      'Last Commit'
    ],
    rows: [['one', 'two', 'a', 'four', 'five'], ['a', 'two', 'k', 'four', 'five'], ['p', 'two', 'b', 'four', 'five']],
    sortBy: {}
  }
  return (
    <React.Fragment>
      <div className='policy-template-details'>
        <div className='overview'>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{template.metadata.name}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster</DescriptionListTerm>
              <DescriptionListDescription>
                {template.metadata.namespace}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Kind</DescriptionListTerm>
              <DescriptionListDescription>{template.kind}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>apiVersion</DescriptionListTerm>
              <DescriptionListDescription>{template.apiVersion}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>status</DescriptionListTerm>
              <DescriptionListDescription>
                {template.status.compliancyDetails[0].conditions[0].message}
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
        <Table aria-label="Sortable Table" cells={tableData.columns} rows={tableData.rows}>
          <TableHeader />
          <TableBody />
        </Table>
      </div>

    </React.Fragment>

  )
}


PolicyTemplateDetails.propTypes = {
  template: PropTypes.object,
}

export default PolicyTemplateDetails

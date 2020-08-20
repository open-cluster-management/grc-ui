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
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core'
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection
} from '@patternfly/react-table'
// import { PlusCircleIcon } from '@patternfly/react-icons'
import jsYaml from 'js-yaml'
import YamlEditor from '../common/YamlEditor'

class PolicyTemplateDetails extends React.Component {
  constructor(props) {
    super(props)
    this.tableData = {
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
    this.defaultPerPage = 1
    this.state = {
      perPage: this.defaultPerPage,
      page: 1,
      rows: this.tableData.rows.slice(0, this.defaultPerPage)
    }
  }
  handleSetPage = (_evt, newPage, perPage, startIdx, endIdx) => {
    this.setState({
      page: newPage,
      rows: this.tableData.rows.slice(startIdx, endIdx)
    })
  }

  handlePerPageSelect = (_evt, newPerPage, newPage, startIdx, endIdx) => {
    this.setState({
      perPage: newPerPage,
      page: newPage,
      rows: this.tableData.rows.slice(startIdx, endIdx)
    })
  }
  onSort = (_event, index, direction) => {
    this.setState(prevState => {
      const sortedRows = prevState.rows.sort((a, b) => (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0))
      return {
        sortBy: {
          index,
          direction
        },
        rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
      }
    })
  }
  render() {
    const { template } = this.props
    const rows = this.state.rows.map(row => ({ cells: row }))
    const { sortBy } = this.state
    console.log(template)
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
          <Table aria-label="Sortable Table" sortBy={sortBy} onSort={this.onSort} cells={this.tableData.columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Pagination
            itemCount={this.tableData.rows.length}
            widgetId="pagination-options-menu-bottom"
            perPage={this.state.perPage}
            page={this.state.page}
            variant={PaginationVariant.bottom}
            onSetPage={this.handleSetPage}
            onPerPageSelect={this.handlePerPageSelect}
            perPageOptions={[
              { title: '1', value: 1 },
              { title: '5', value: 5 },
              { title: '10', value: 10 },
              { title: '20', value: 20},
              { title: '50', value: 50},
            ]}
          />
        </div>

      </React.Fragment>

    )
  }
}


PolicyTemplateDetails.propTypes = {
  template: PropTypes.object,
}

export default PolicyTemplateDetails

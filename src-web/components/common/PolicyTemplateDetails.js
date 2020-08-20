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
import lodash from 'lodash'
import YamlEditor from '../common/YamlEditor'

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
          href={`/multicloud/details/${lodash.get(template, 'metadata.namespace')}${lodash.get(o, 'object.metadata.selfLink')}`}>view yaml</a> }
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


class PatternFlyTable extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.defaultPerPage = 10
    const { sortBy } = this.props
    const sortedRows = this.props.rows.sort((a, b) => (a[sortBy.index] < b[sortBy.index] ? -1 : a[sortBy.index] > b[sortBy.index] ? 1 : 0))
    this.state = {
      perPage: this.defaultPerPage,
      page: 1,
      rows: sortedRows.slice(0, this.defaultPerPage),
      itemCount: this.props.rows.length,
      sortBy: this.props.sortBy,
    }
  }
  handleSort = (_event, index, direction) => {
    console.log(index)
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
  handlePerPageSelect = (_evt, newPerPage, newPage, startIdx, endIdx) => {
    this.setState({
      perPage: newPerPage,
      page: newPage,
      rows: this.props.rows.slice(startIdx, endIdx)
    })
  }
  handleSetPage = (_evt, newPage, perPage, startIdx, endIdx) => {
    this.setState({
      page: newPage,
      rows: this.props.rows.slice(startIdx, endIdx)
    })
  }
  render() {
    const { sortBy, rows, itemCount } = this.state
    const { columns } = this.props
    console.log(sortBy)
    return (
      <React.Fragment>
        <Table aria-label="Sortable Table" sortBy={sortBy} onSort={this.handleSort} cells={columns} rows={rows}>
          <TableHeader />
          <TableBody />
        </Table>
        <Pagination
          itemCount={itemCount}
          widgetId="pagination-options-menu-bottom"
          perPage={this.state.perPage}
          page={this.state.page}
          variant={PaginationVariant.bottom}
          onSetPage={this.handleSetPage}
          onPerPageSelect={this.handlePerPageSelect}
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '20', value: 20},
            { title: '50', value: 50},
          ]}
        />
      </React.Fragment>
    )

  }
}

PatternFlyTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
}

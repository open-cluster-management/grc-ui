/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'


import React from 'react'
import PropTypes from 'prop-types'
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Pagination,
  PaginationVariant,
  Title,
} from '@patternfly/react-core'
import {
  Table,
  TableHeader,
  TableBody,
  SortByDirection
} from '@patternfly/react-table'
import { SearchIcon } from '@patternfly/react-icons'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/pattern-fly-table.scss')
})

class PatternFlyTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      perPage: 10,
      page: 1,
      rows: [],
      itemCount: 0,
      sortBy: this.props.sortBy || {},
      startIdx: 0,
      endIdx: 9
    }
  }
  static getDerivedStateFromProps(props, state) {
    const { sortBy } = state
    const sortedRows = props.rows.sort((a, b) => (a[sortBy.index] < b[sortBy.index] ? -1 : a[sortBy.index] > b[sortBy.index] ? 1 : 0))
    const sortedRowsByDrection = sortBy.direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    return {
      rows: sortedRowsByDrection.slice(state.startIdx, state.endIdx),
      itemCount: props.rows.length,
    }

  }
  handleSort = (_event, index, direction) => {
    this.setState({
      sortBy: {
        index,
        direction
      }
    })
  }
  handlePerPageSelect = (_evt, newPerPage, newPage, startIdx, endIdx) => {
    this.setState({
      perPage: newPerPage,
      page: newPage,
      startIdx,
      endIdx,
    })
  }
  handleSetPage = (_evt, newPage, perPage, startIdx, endIdx) => {
    this.setState({
      page: newPage,
      startIdx,
      endIdx
    })
  }
  render() {
    const { sortBy, rows=[], itemCount } = this.state
    const { columns } = this.props
    return (
      <div className='pattern-fly-table'>
        <Table aria-label="Sortable Table" sortBy={sortBy} onSort={this.handleSort} cells={columns} rows={rows}>
          <TableHeader />
          <TableBody />
        </Table>
        {rows.length === 0 && (
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={SearchIcon} />
            <Title headingLevel="h2" size="md">
              No results found
            </Title>
          </EmptyState>
        )}
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
      </div>
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

export default PatternFlyTable

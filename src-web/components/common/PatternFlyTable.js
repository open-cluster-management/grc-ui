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

class PatternFlyTable extends React.Component {
  constructor(props) {
    super(props)
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
      const { sortBy, rows=[], itemCount } = this.state
      const { columns } = this.props
      return (
        <div className='pattern-fly-table'>
          <Table aria-label="Sortable Table" sortBy={sortBy} onSort={this.handleSort} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          {rows.length == 0 && (
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

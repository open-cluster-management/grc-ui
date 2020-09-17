/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import classNames from 'classnames'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Pagination,
  PaginationVariant,
  SearchInput,
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
      perPage: this.props.perPage,
      page: 1,
      rows: [],
      itemCount: 0,
      sortBy: this.props.sortBy,
      startIdx: 0,
      endIdx: this.props.perPage,
      searchValue: ''
    }
  }
  static defaultProps = {
    pagination: true,
    perPage: 10,
    noResultMsg: 'No results found',
    searchable: true,
    searchPlaceholder: 'Find',
    sortBy: {}
  }
  static getDerivedStateFromProps(props, state) {
    const { searchValue, sortBy } = state
    const { pagination, rows, searchable } = props
    // Helper function to return the string from the cell
    const parseCell = function (cell) {
      if (typeof cell === 'object' && cell.title) {
        if (typeof cell.title === 'string') {
          return cell.title
        }
        // It's not a string so render the component and strip HTML tags
        return ReactDOMServer.renderToString(cell.title).replace(/<[^>]+>/g, '')
      }
      return cell
    }
    // Filter the rows based on given searchValue from user
    const rowsFiltered = !searchable || searchValue === ''
      ? [...rows]
      : rows.filter(row => {
        const cells = row.cells ? row.cells : row
        return cells.some(item => {
          return parseCell(item).toLowerCase().includes(searchValue.toLowerCase())
        })
      })
    // Sort the rows based on sortBy prop (if it's not empty)
    const sortedRows = rowsFiltered
    if (Object.keys(sortBy).length !== 0) {
      sortedRows.sort((a, b) => {
        const acell = a.cells ? a.cells[sortBy.index] : a[sortBy.index]
        const bcell = b.cells ? b.cells[sortBy.index] : b[sortBy.index]
        const avalue = parseCell(acell)
        const bvalue = parseCell(bcell)
        if (sortBy.direction === SortByDirection.asc) {
          return avalue < bvalue ? -1 : avalue > bvalue ? 1 : 0
        } else {
          return avalue > bvalue ? -1 : avalue < bvalue ? 1 : 0
        }
      })
    }
    // Return the filtered and sorted array
    return {
      rows: sortedRows.slice(state.startIdx, pagination ? state.endIdx : sortedRows.length),
      itemCount: sortedRows.length,
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
  handleSearch = (value) => {
    this.setState({
      searchValue: value
    })
  }
  render() {
    const { sortBy, rows = [], itemCount, searchValue } = this.state
    const { columns, className, noResultMsg, pagination, searchable, searchPlaceholder } = this.props
    const classes = classNames('pattern-fly-table', className)
    return (
      <div className='pattern-fly-table-group'>
        {searchable && <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={this.handleSearch}
          onClear={() => this.handleSearch('')}
        />}
        <div className={classes}>
          <Table aria-label='Sortable Table' sortBy={sortBy} onSort={this.handleSort} cells={columns}
            rows={rows}>
            <TableHeader className='pattern-fly-table-header' />
            <TableBody className='pattern-fly-table-body' />
          </Table>
          {rows.length === 0 && (
            <EmptyState className='pattern-fly-table-empty-state' variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel='h2' size='md'>
                {noResultMsg}
              </Title>
            </EmptyState>
          )}
          {pagination && <Pagination
            itemCount={itemCount}
            widgetId='pagination-options-menu-bottom'
            perPage={this.state.perPage}
            page={this.state.page}
            variant={PaginationVariant.bottom}
            onSetPage={this.handleSetPage}
            onPerPageSelect={this.handlePerPageSelect}
            perPageOptions={[
              { title: '5', value: 5 },
              { title: '10', value: 10 },
              { title: '20', value: 20 },
              { title: '50', value: 50 },
            ]}
          />}
        </div>
      </div>
    )
  }
}

PatternFlyTable.propTypes = {
  /** Add class names in addition to the defaults to the PatternFly table (optional) */
  className: PropTypes.string,
  /** Table column headings and properties */
  columns: PropTypes.array,
  /** Message when no results are displayed in the table */
  noResultMsg: PropTypes.string,
  /** Toggle pagination (optional) */
  pagination: PropTypes.bool,
  /** Number of rows displayed per page for pagination */
  perPage: PropTypes.oneOf([5, 10, 20, 50]),
  /** Table row content */
  rows: PropTypes.array,
  /** Placeholder text for search input field */
  searchPlaceholder: PropTypes.string,
  /** Toggle search input (optional) */
  searchable: PropTypes.bool,
  /** Initial table sorting (optional) */
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
}

export default PatternFlyTable

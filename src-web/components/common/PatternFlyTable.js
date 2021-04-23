/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import classNames from 'classnames'
import React from 'react'
import purifyReactNode from '../../utils/PurifyReactNode'
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
import '../../scss/pattern-fly-table.scss'
import moment from 'moment'

class PatternFlyTable extends React.Component {
  constructor(props) {
    super(props)
    const { searchQueryEnabled, searchQueryKey, strictSearch } = props
    let { searchValue } = props
    let searchText = ''
    if (searchQueryEnabled) {
      const searchQuery = new URLSearchParams(location.search.substring(1)).get(searchQueryKey)
      // If there's a query, overwrite any provided searchValue
      if (searchQuery) {
        searchValue = searchQuery
      }
    }
    searchText = searchValue.trim()
    this.state = {
      perPage: this.props.perPage,
      page: 1,
      rows: [],
      itemCount: 0,
      sortBy: this.props.sortBy,
      startIdx: 0,
      endIdx: this.props.perPage,
      searchState: searchText,
      searchQueryEnabled,
      strictSearch
    }
  }
  static defaultProps = {
    pagination: true,
    perPage: 10,
    noResultMsg: 'No results found',
    searchable: true,
    searchQueryEnabled: false,
    searchQueryKey: 'searchFilter',
    searchPlaceholder: 'Find',
    searchValue: '',
    sortBy: {}
  }
  static getDerivedStateFromProps(props, state) {
    const { searchState, sortBy, strictSearch } = state
    const { searchValue, handleSearch, handleClear, pagination, rows, searchable } = props
    let trimmedSearchValue = typeof searchState === 'string' ? searchState.trim() : ''
    if (typeof handleSearch === 'function' && typeof handleClear === 'function' && typeof searchValue === 'string') {
      trimmedSearchValue = searchValue.trim()
    }
    // also able to search truncated text
    trimmedSearchValue = trimmedSearchValue.split('...')[0]
    // Helper function to return the string from the cell
    const parseCell = function (cell) {
      if (cell.title && cell.title.props && cell.title.props.timestamp) {
        return {
          timeStamp: cell.title.props.timestamp,
          fromNow: moment(cell.title.props.timestamp, 'YYYY-MM-DDTHH:mm:ssZ').fromNow().toString()
        }
      }
      if (typeof cell === 'object') {
        // get the pure text from table cell
        return purifyReactNode(cell.title)
      }
      return cell
    }
    // Filter the rows based on given searchValue from user
    const rowsFiltered = !searchable || trimmedSearchValue === ''
      ? [...rows]
      : rows.filter(row => {
        const cells = row.cells ? row.cells : row
        return cells.some(item => {
          let parsedCell = parseCell(item)
          parsedCell = (typeof parsedCell === 'string') ? parsedCell : parsedCell.fromNow
          if (strictSearch) {
            return parsedCell.toLowerCase() === trimmedSearchValue.toLowerCase()
          }
          return parsedCell.toLowerCase().includes(trimmedSearchValue.toLowerCase())
        })
      })

    // Sort the rows based on sortBy prop (if it's not empty)
    const sortedRows = rowsFiltered
    if (Object.keys(sortBy).length !== 0) {
      sortedRows.sort((a, b) => {
        const acell = a.cells ? a.cells[sortBy.index] : a[sortBy.index]
        const bcell = b.cells ? b.cells[sortBy.index] : b[sortBy.index]
        let avalue, bvalue
        if (sortBy.direction === SortByDirection.asc) {
          avalue = parseCell(acell)
          bvalue = parseCell(bcell)
        } else {
          bvalue = parseCell(acell)
          avalue = parseCell(bcell)
        }
        avalue = (typeof avalue === 'string') ? avalue : avalue.timeStamp
        bvalue = (typeof bvalue === 'string') ? bvalue : bvalue.timeStamp
        if (avalue > bvalue) {
          return 1
        } else if (avalue < bvalue) {
          return -1
        }
        return 0
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
    const { searchQueryKey } = this.props
    const { searchQueryEnabled } = this.state
    // Update URL query if it changes (without adding to browser history)
    if (searchQueryEnabled) {
      const searchQuery = new URLSearchParams(location.search.substring(1))
      searchQuery.delete(searchQueryKey)
      // If there are other queries, keep them in the URL, otherwise return the URL without queries
      if (searchQuery.toString() !== '') {
        window.history.replaceState({}, document.title, `${location.origin}${location.pathname}?${searchQuery.toString()}`)
      } else {
        window.history.replaceState({}, document.title, `${location.origin}${location.pathname}`)
      }
    }
    this.setState({
      searchState: value,
      searchQueryEnabled: false,
      strictSearch: false
    })
  }
  handleClear = () => {
    this.handleSearch('')
  }

  render() {
    const { sortBy, rows = [], itemCount, searchState } = this.state
    const {
      columns,
      className,
      noResultMsg,
      pagination,
      searchable,
      searchPlaceholder,
      searchValue,
      dropdownPosition,
      dropdownDirection,
      tableActionResolver,
      handleSearch,
      handleClear
    } = this.props
    const classes = classNames('pattern-fly-table', className)
    // if not pass in handleSearch, use build in handleSearch
    let handleSearchFunc = this.handleSearch
    // if not pass in handleClear, use build in handleClear
    let handleClearFunc = this.handleClear
    let searchText = searchState
    if (typeof handleSearch === 'function' && typeof handleClear === 'function' && typeof searchValue === 'string') {
      handleSearchFunc = handleSearch
      handleClearFunc = handleClear
      searchText = searchValue.trim()
    }
    return (
      <div className='pattern-fly-table-group'>
        {searchable && <SearchInput
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={handleSearchFunc}
          onClear={handleClearFunc}
        />}
        <div className={classes}>
          <Table
            aria-label='Sortable Table'
            sortBy={sortBy}
            onSort={this.handleSort}
            cells={columns}
            rows={rows}
            actionResolver={tableActionResolver}
            dropdownPosition={dropdownPosition}
            dropdownDirection={dropdownDirection}
          >
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
  /* Add class names in addition to the defaults to the PatternFly table (optional) */
  className: PropTypes.string,
  /* Table column headings and properties */
  columns: PropTypes.array,
  /* The desired direction to show the dropdown when clicking on the actions Kebab.
  Can only be used together with `actions` property (optional) */
  dropdownDirection: PropTypes.string,
  /* The desired position to show the dropdown when clicking on the actions Kebab.
  Can only be used together with `actions` property (optional) */
  dropdownPosition: PropTypes.string,
  /* Callback function from parent to handle clean search input action */
  handleClear: PropTypes.func,
  /* Callback function from parent to handle search action */
  handleSearch: PropTypes.func,
  /* Message when no results are displayed in the table */
  noResultMsg: PropTypes.string,
  /* Toggle pagination (optional) */
  pagination: PropTypes.bool,
  /* Number of rows displayed per page for pagination */
  perPage: PropTypes.oneOf([5, 10, 20, 50]),
  /* Table row content */
  rows: PropTypes.array,
  /* Placeholder text for search input field */
  searchPlaceholder: PropTypes.string,
  /* Enable updating the URL query for this table */
  searchQueryEnabled: PropTypes.bool,
  /* Key for URL query if enabled (in case there are
    mutliple tables on a page or on differnt toggles) */
  searchQueryKey: PropTypes.string,
  /* Initial search value from parent props */
  searchValue: PropTypes.string,
  /* Toggle search input (optional) */
  searchable: PropTypes.bool,
  /* Initial table sorting (optional) */
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  /* Whether to match strings exactly */
  strictSearch: PropTypes.bool,
  /* call back function to pass in and handle table action in patternfly table*/
  tableActionResolver: PropTypes.func
}

export default PatternFlyTable

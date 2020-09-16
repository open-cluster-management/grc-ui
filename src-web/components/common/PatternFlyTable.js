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
      perPage: 10,
      page: 1,
      rows: [],
      itemCount: 0,
      sortBy: this.props.sortBy || {},
      startIdx: 0,
      endIdx: 10,
      searchValue: ''
    }
  }
  static defaultProps = {
    pagination: true,
    searchable: true,
    searchPlaceholder: 'Find'
  }
  static getDerivedStateFromProps(props, state) {
    const { searchValue, sortBy } = state
    const { pagination, rows, searchable } = props
    const rowsFiltered = !searchable || searchValue === ''
      ? rows
      : rows.filter(row => {
        const cells = row.cells ? row.cells : row
        return cells.some(item => {
          if (typeof item === 'string') {
            return item.toLowerCase().includes(searchValue.toLowerCase())
          } else if (typeof item === 'object' && item.title) {
            if (typeof item.title === 'string') {
              return item.title.toLowerCase().includes(searchValue.toLowerCase())
            }
            return ReactDOMServer.renderToString(item.title).replace(/<[^>]+>/g, '').toLowerCase().includes(searchValue.toLowerCase())
          } else {
            return false
          }
        })
      })
    let sortedRows
    if (Object.keys(sortBy).length !== 0) {
      sortedRows = rowsFiltered.sort((a, b) => {
        const acell = a.cells ? a.cells[sortBy.index] : a[sortBy.index]
        const bcell = b.cells ? b.cells[sortBy.index] : b[sortBy.index]
        let avalue, bvalue
        if (typeof acell === 'object' && acell.title && typeof bcell === 'object' && bcell.title) {
          if (typeof item === 'string') {
            avalue = acell.title
            bvalue = bcell.title
          } else {
            avalue = ReactDOMServer.renderToString(acell.title).replace(/<[^>]+>/g, '')
            bvalue = ReactDOMServer.renderToString(bcell.title).replace(/<[^>]+>/g, '')
          }
        } else {
          avalue = acell
          bvalue = bcell
        }
        if (sortBy.direction === SortByDirection.asc) {
          return avalue < bvalue ? -1 : avalue > bvalue ? 1 : 0
        } else {
          return avalue > bvalue ? -1 : avalue < bvalue ? 1 : 0
        }
      })
    } else {
      sortedRows = rowsFiltered
    }
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
  className: PropTypes.string,
  columns: PropTypes.array,
  noResultMsg: PropTypes.string,
  pagination: PropTypes.bool,
  rows: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  searchable: PropTypes.bool,
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
}

export default PatternFlyTable

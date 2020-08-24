/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import renderer from 'react-test-renderer'
import React from 'react'
import PatternFlyTable from '../../../../src-web/components/common/PatternFlyTable'

const tableData = {
  columns: [
    { title: 'Repositories' },
    'Branches',
    { title: 'Pull requests' },
    'Workspaces',
    'Last Commit'
  ],
  rows: [['one', 'two', 'a', 'four', 'five'], ['a', 'two', 'k', 'four', 'five'], ['p', 'two', 'b', 'four', 'five']],
  sortBy: {}
}

describe('PatternFlyTable component', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <PatternFlyTable {...tableData} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('PatternFlyTable component', () => {
  it('renders empty state', () => {
    const component = renderer.create(
      <PatternFlyTable columns={tableData.columns} sortBy={tableData.sortBy} rows={[]} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

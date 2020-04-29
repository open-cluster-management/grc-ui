/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Module, ModuleBody, ModuleHeader } from 'carbon-addons-cloud-react'
import { TooltipIcon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import _uniqueId from 'lodash/uniqueId'

resources(() => {
  require('../../../scss/structured-list.scss')
})

const VerticalDivider = (key) => {
  return <span className="vertical-divider" key={key} />
}

class DetailsModule extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  formatData() {
    const { numRows, listData, listItem} = this.props
    const tablesData = []
    const itemsForEachTable = _.chunk(listItem, numRows)
    _.forEach(itemsForEachTable, (items) => {
      const oneTableData = []
      _.forEach(items, (item) => {
        if (item.cells && Array.isArray(item.cells)) {
          const entry = []
          entry[0] = item.cells[0].resourceKey
          const entryData = _.get(listData, item.cells[1].resourceKey, '-')
          const replacedData = JSON.stringify(entryData).replace(/\[|\]|"/g, ' ')
          entry[1] = typeof(entryData) === 'object' ? replacedData : entryData
          // third column entry[2] is tooltip inforamtion, if not exist then no tooltip
          if (item.cells[0].information) {
            entry[2] = item.cells[0].information
          }
          oneTableData.push(entry)
        }
      })
      tablesData.push(oneTableData)
    })
    return tablesData
  }

  renderStructuredListBody(tablesData) {
    const { numRows, numColumns } = this.props
    const tables = []
    for( let column=0; column < numColumns; column++ ) {
      const tableData = tablesData[column]
      const tableRows = []
      for( let row=0; row < numRows; row++){
        if(tableData[row]){
          const tableCells = []
          tableCells.push(
            <td className='structured-list-table-item' key={`list-item-${tableData[row][0]}`} >
              <div className='structured-list-table-item-header'>
                <div className='structured-list-table-item-name'>{msgs.get(tableData[row][0], this.context.locale)}</div>
                {tableData[row][2] && // no third column no tooltip
                  <TooltipIcon align='end' tooltipText={msgs.get(tableData[row][2], this.context.locale)}>
                    <svg className='info-icon'>
                      <use href={'#diagramIcons_info'} ></use>
                    </svg>
                  </TooltipIcon>}
              </div>
            </td>
          )
          tableCells.push(
            <td className='structured-list-table-data' key={`list-item-${tableData[row][1]}`} >
              {tableData[row][1]}
            </td>
          )
          const tableRow =
            <tr className = 'new-structured-list-table-row' key={`list-line-${row}-${tableData[row][0]}`} >
              {tableCells}
            </tr>
          tableRows.push(tableRow)
        }
      }
      const table =
        <table className = 'new-structured-list-table' key={`new-structured-list-${tableData[0][1]}`}>
          <tbody>{tableRows}</tbody>
        </table>
      tables.push(table)
    }
    const moduleBody = []
    for( let i=0; i<tables.length; i++){
      moduleBody.push(tables[i])
      if(i !== tables.length -1 ) {
        moduleBody.push(<VerticalDivider key={_uniqueId('VerticalDivider')} />)
      }
    }
    return React.createElement('div',{className: 'new-structured-list'}, moduleBody)
  }

  render() {
    const { title } = this.props
    const showHeader = _.get(this.props, 'showHeader', true)
    const tablesData = this.formatData()

    return(<Module className='new-structured-list-container' key='new-structured-list'>
      { showHeader? <ModuleHeader>{msgs.get(title, this.context.locale)}</ModuleHeader> : null}
      <ModuleBody key='new-structured-list-body'>
        {this.renderStructuredListBody(tablesData)}
      </ModuleBody>
    </Module>)

  }

  static contextTypes = {
    locale: PropTypes.string
  }

  static propTypes = {
    listData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    listItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    numColumns: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
    title: PropTypes.string,
  }
}

export default DetailsModule

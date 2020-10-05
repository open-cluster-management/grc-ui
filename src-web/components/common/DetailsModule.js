/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Tooltip
} from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import _uniqueId from 'lodash/uniqueId'
import moment from 'moment'
import { getPolicyCompliantStatus } from '../../definitions/hcm-policies-policy'
import { LocaleContext } from './LocaleContext'

resources(() => {
  require('../../../scss/structured-list.scss')
})

const VerticalDivider = (key) => {
  return <span className="vertical-divider" key={key} />
}

class DetailsModule extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expanded: `${props.title.toLowerCase().replace(/ /g,'-')}-toggle`
    }
  }
  formatData() {
    const { numRows, listData, listItem} = this.props
    const tablesData = []
    const itemsForEachTable = _.chunk(listItem, numRows)
    _.forEach(itemsForEachTable, (items) => {
      const oneTableData = []
      _.forEach(items, (item) => {
        if (Array.isArray(item.cells) && item.cells[0]) {
          const entry = []
          entry[0] = item.cells[0].resourceKey ? item.cells[0].resourceKey : '-'
          const entryData = item.cells[1] ? _.get(listData, item.cells[1].resourceKey, '-') : '-'
          const replacedData = JSON.stringify(entryData).replace(/\[|\]|"/g, ' ')
          entry[1] = (typeof(entryData) === 'object'||typeof(entryData) === 'boolean') ? replacedData : entryData
          if(item && item.cells[0] && item.cells[0].resourceKey){
            if(item.cells[0].type === 'timestamp') {
              entry[1] = moment(entry[1], 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
            } else if(item.cells[1] && item.cells[1].resourceKey === 'clusterCompliant') {
              entry[1] = getPolicyCompliantStatus({clusterCompliant: entry[1]}, this.context.locale)
            }
          }
          // third column entry[2] is tooltip information, if not exist then no tooltip
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
                  <Tooltip content={msgs.get(tableData[row][2], this.context.locale)}>
                    <svg className='info-icon'>
                      <use href={'#diagramIcons_info'} ></use>
                    </svg>
                  </Tooltip>}
              </div>
            </td>
          )
          tableCells.push(
            <td className='structured-list-table-data' key={_uniqueId(`list-item-${tableData[row][1]}`)} >
              {tableData[row][1]}
            </td>
          )
          const tableRow =
            <tr className = 'new-structured-list-table-row' key={_uniqueId(`list-line-${row}-${tableData[row][0]}`)} >
              {tableCells}
            </tr>
          tableRows.push(tableRow)
        }
      }
      const table =
        <table className = 'new-structured-list-table' key={_uniqueId(`new-structured-list-${tableData[0][1]}`)}>
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

  onToggle(id) {
    if (id === this.state.expanded) {
      this.setState({expanded: ''})
    } else {
      this.setState({expanded: id })
    }
  }

  render() {
    const { title } = this.props
    const tablesData = this.formatData()
    const id = title.toLowerCase().replace(/ /g,'-')

    return(<Accordion className='new-structured-list-container' key={_uniqueId('new-structured-list')}>
      <AccordionItem key={_uniqueId('new-structured-list-body')}>
        <AccordionToggle
          onClick={() => {this.onToggle(`${id}-toggle`)}}
          isExpanded={this.state.expanded===`${id}-toggle`}
        >
          <div className='section-title pf-c-accordion__toggle-title'>
            {msgs.get(title, this.context.locale)}
          </div>
          <AccordionContent id={`${id}-expand`} isHidden={this.state.expanded !== `${id}-toggle`}>
            {this.renderStructuredListBody(tablesData)}
          </AccordionContent>
        </AccordionToggle>
      </AccordionItem>
    </Accordion>)

  }

  static contextType = LocaleContext

  static propTypes = {
    listData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    listItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    numColumns: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
    title: PropTypes.string,
  }
}

export default DetailsModule

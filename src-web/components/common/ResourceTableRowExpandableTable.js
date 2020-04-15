/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
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
import msgs from '../../../nls/platform.properties'
import { DataTable,  } from 'carbon-components-react'
import TruncateText from './TruncateText'
import uuidv4 from 'uuid/v4'

const {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell } = DataTable

const ResourceTableRowExpandableTable = ({ items, headers }, context) =>
  <Table className='resource-table-expandable'>
    <TableHead>
      <TableRow>
        {headers && headers.map((header, index) => {
          if (header) {
            return (
              <th className={`bx--table-header-index-${index}`} scope={'col'} key={header}>
                <span className='bx--table-header-label'>{msgs.get(header, context.locale)}</span>
              </th>
            )
          } else {
            return <th className={`bx--table-header-index-${index}`} scope={'col'} key={`bx--table-header-${uuidv4()}`} />
          }
        }
        )}
      </TableRow>
    </TableHead>
    <TableBody>
      {items && items.map(row => {//check undefined row.id to avoid whole page crush
        if(row && row.cells){//single sub row for policy/cluster violation side panel
          return (
            <TableRow key={row.id ? row.id : `sidePanelTableRow-${uuidv4()}`}>
              {row.cells.map(cell => (cell && typeof cell === 'string') ?
                <TableCell key={cell.substring(0, 21)}><TruncateText text={cell} /></TableCell>
                : <TableCell key={`sidePanelTableCell-${uuidv4()}`}><TruncateText text='-' /></TableCell>)}
            </TableRow>
          )
        }
        else if (row && row.subRowsArray) {//mulit sub rows for cluster finding side panel
          return row.subRowsArray.map(subRow => {
            if(subRow && subRow.cells) {
              return (
                <TableRow key={subRow.id ? subRow.id : `sidePanelTableRow-${uuidv4()}`}>
                  {subRow.cells.map((cell, index) => (cell && typeof cell === 'string') ?
                    <TableCell key={cell.substring(0, 21)} className={`bx--table-subRowsArray-subRow-index-${index}`}>
                      <TruncateText text={cell} /></TableCell> :
                    <TableCell key={`sidePanelTableCell-${uuidv4()}`}><TruncateText text='-' /></TableCell>)}
                </TableRow>
              )
            }
            return ''
          })
        }
        return ''
      })
      }
    </TableBody>
  </Table>

ResourceTableRowExpandableTable.propTypes = {
  headers: PropTypes.array,
  items: PropTypes.array
}

export default ResourceTableRowExpandableTable

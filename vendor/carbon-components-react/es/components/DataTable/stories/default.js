/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { iconDownload, iconEdit, iconSettings } from 'carbon-icons';
import Download16 from '@carbon/icons-react/lib/download/16';
import Edit16 from '@carbon/icons-react/lib/edit/16';
import Settings16 from '@carbon/icons-react/lib/settings/16';
import Button from '../../Button';
import DataTable, { Table, TableBatchAction, TableBatchActions, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableSelectAll, TableSelectRow, TableToolbar, TableToolbarAction, TableToolbarContent, TableToolbarSearch } from '../../DataTable';
import { batchActionClick, initialRows, headers } from './shared';
import { componentsX } from '../../../internal/FeatureFlags';
export default (function (_ref) {
  var short = _ref.short,
      shouldShowBorder = _ref.shouldShowBorder;
  return React.createElement(DataTable, {
    rows: initialRows,
    headers: headers,
    short: short,
    shouldShowBorder: shouldShowBorder,
    render: function render(_ref2) {
      var rows = _ref2.rows,
          headers = _ref2.headers,
          getHeaderProps = _ref2.getHeaderProps,
          getRowProps = _ref2.getRowProps,
          getSelectionProps = _ref2.getSelectionProps,
          getBatchActionProps = _ref2.getBatchActionProps,
          onInputChange = _ref2.onInputChange,
          selectedRows = _ref2.selectedRows,
          getTableProps = _ref2.getTableProps;
      return React.createElement(TableContainer, {
        title: "DataTable"
      }, React.createElement(TableToolbar, null, React.createElement(TableBatchActions, getBatchActionProps(), React.createElement(TableBatchAction, {
        onClick: batchActionClick(selectedRows)
      }, "Ghost"), React.createElement(TableBatchAction, {
        onClick: batchActionClick(selectedRows)
      }, "Ghost"), React.createElement(TableBatchAction, {
        onClick: batchActionClick(selectedRows)
      }, "Ghost")), React.createElement(TableToolbarSearch, {
        onChange: onInputChange
      }), React.createElement(TableToolbarContent, null, React.createElement(TableToolbarAction, {
        renderIcon: !componentsX ? undefined : Download16,
        icon: componentsX ? undefined : iconDownload,
        iconDescription: "Download",
        onClick: action('TableToolbarAction - Download')
      }), React.createElement(TableToolbarAction, {
        renderIcon: !componentsX ? undefined : Edit16,
        icon: componentsX ? undefined : iconEdit,
        iconDescription: "Edit",
        onClick: action('TableToolbarAction - Edit')
      }), React.createElement(TableToolbarAction, {
        renderIcon: !componentsX ? undefined : Settings16,
        icon: componentsX ? undefined : iconSettings,
        iconDescription: "Settings",
        onClick: action('TableToolbarAction - Settings')
      }), React.createElement(Button, {
        onClick: action('Add new row'),
        small: true,
        kind: "primary"
      }, "Add new"))), React.createElement(Table, getTableProps(), React.createElement(TableHead, null, React.createElement(TableRow, null, React.createElement(TableSelectAll, getSelectionProps()), headers.map(function (header) {
        return React.createElement(TableHeader, getHeaderProps({
          header: header
        }), header.header);
      }))), React.createElement(TableBody, null, rows.map(function (row) {
        return React.createElement(TableRow, getRowProps({
          row: row
        }), React.createElement(TableSelectRow, getSelectionProps({
          row: row
        })), row.cells.map(function (cell) {
          return React.createElement(TableCell, {
            key: cell.id
          }, cell.value);
        }));
      }))));
    }
  });
});
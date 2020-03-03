"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.headers = void 0;

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _carbonIcons = require("carbon-icons");

var _ = _interopRequireDefault(require("@carbon/icons-react/lib/download/16"));

var _2 = _interopRequireDefault(require("@carbon/icons-react/lib/edit/16"));

var _3 = _interopRequireDefault(require("@carbon/icons-react/lib/settings/16"));

var _Button = _interopRequireDefault(require("../../Button"));

var _Checkbox = _interopRequireDefault(require("../../Checkbox"));

var _DataTable = _interopRequireWildcard(require("../../DataTable"));

var _FeatureFlags = require("../../../internal/FeatureFlags");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
// import { initialRows, headers } from './shared';
var initialRows = [{
  id: 'a',
  name: 'Load Balancer 3',
  protocol: 'HTTP',
  port: 3000,
  rule: 'Round robin',
  attached_groups: 'Kevins VM Groups',
  status: 'Disabled',
  enabled: true
}, {
  id: 'b',
  name: 'Load Balancer 1',
  protocol: 'HTTP',
  port: 443,
  rule: 'Round robin',
  attached_groups: 'Maureens VM Groups',
  status: 'Starting',
  enabled: true
}, {
  id: 'c',
  name: 'Load Balancer 2',
  protocol: 'HTTP',
  port: 80,
  rule: 'DNS delegation',
  attached_groups: 'Andrews VM Groups',
  status: 'Active',
  enabled: false
}];
var headers = [{
  key: 'name',
  header: 'Name'
}, {
  key: 'protocol',
  header: 'Protocol'
}, {
  key: 'port',
  header: 'Port'
}, {
  key: 'rule',
  header: 'Rule'
}, {
  key: 'attached_groups',
  header: 'Attached Groups'
}, {
  key: 'status',
  header: 'Status'
}, {
  key: 'enabled',
  header: 'Enabled'
}];
exports.headers = headers;

var _default = function _default() {
  return _react.default.createElement(_DataTable.default, {
    rows: initialRows,
    headers: headers,
    render: function render(_ref) {
      var rows = _ref.rows,
          headers = _ref.headers,
          getHeaderProps = _ref.getHeaderProps,
          getRowProps = _ref.getRowProps,
          onInputChange = _ref.onInputChange;
      return _react.default.createElement(_DataTable.TableContainer, {
        title: "DataTable with toolbar"
      }, _react.default.createElement(_DataTable.TableToolbar, null, _react.default.createElement(_DataTable.TableToolbarSearch, {
        onChange: onInputChange
      }), _react.default.createElement(_DataTable.TableToolbarContent, null, _react.default.createElement(_DataTable.TableToolbarAction, {
        renderIcon: !_FeatureFlags.componentsX ? undefined : _.default,
        icon: _FeatureFlags.componentsX ? undefined : _carbonIcons.iconDownload,
        iconDescription: "Download",
        onClick: (0, _addonActions.action)('TableToolbarAction - Download')
      }), _react.default.createElement(_DataTable.TableToolbarAction, {
        renderIcon: !_FeatureFlags.componentsX ? undefined : _2.default,
        icon: _FeatureFlags.componentsX ? undefined : _carbonIcons.iconEdit,
        iconDescription: "Edit",
        onClick: (0, _addonActions.action)('TableToolbarAction - Edit')
      }), _react.default.createElement(_DataTable.TableToolbarAction, {
        renderIcon: !_FeatureFlags.componentsX ? undefined : _3.default,
        icon: _FeatureFlags.componentsX ? undefined : _carbonIcons.iconSettings,
        iconDescription: "Settings",
        onClick: (0, _addonActions.action)('TableToolbarAction - Settings')
      }), _react.default.createElement(_Button.default, {
        onClick: (0, _addonActions.action)('Add new row'),
        small: true,
        kind: "primary"
      }, "Add new"))), _react.default.createElement(_DataTable.Table, null, _react.default.createElement(_DataTable.TableHead, null, _react.default.createElement(_DataTable.TableRow, null, headers.map(function (header) {
        return _react.default.createElement(_DataTable.TableHeader, getHeaderProps({
          header: header
        }), header.header);
      }))), _react.default.createElement(_DataTable.TableBody, null, rows.map(function (row) {
        return _react.default.createElement(_DataTable.TableRow, getRowProps({
          row: row
        }), row.cells.map(function (cell) {
          if (cell.info.header === 'enabled') {
            return _react.default.createElement(_DataTable.TableCell, {
              key: cell.id,
              id: cell.id,
              className: "la-".concat(cell.info.header)
            }, _react.default.createElement(_Checkbox.default, {
              id: 'check-' + cell.id,
              checked: cell.value,
              labelText: ""
            }));
          } else {
            return _react.default.createElement(_DataTable.TableCell, {
              key: cell.id
            }, cell.value);
          }
        }));
      }))));
    }
  });
};

exports.default = _default;
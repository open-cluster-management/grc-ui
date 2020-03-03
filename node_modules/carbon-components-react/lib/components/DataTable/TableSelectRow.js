"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _InlineCheckbox = _interopRequireDefault(require("../InlineCheckbox"));

var _RadioButton = _interopRequireDefault(require("../RadioButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var TableSelectRow = function TableSelectRow(_ref) {
  var ariaLabel = _ref.ariaLabel,
      checked = _ref.checked,
      id = _ref.id,
      name = _ref.name,
      onSelect = _ref.onSelect,
      disabled = _ref.disabled,
      radio = _ref.radio,
      className = _ref.className;
  var selectionInputProps = {
    id: id,
    name: name,
    onClick: onSelect,
    checked: checked,
    ariaLabel: ariaLabel,
    disabled: disabled
  };
  var InlineInputComponent = radio ? _RadioButton.default : _InlineCheckbox.default;
  return _react.default.createElement("td", {
    className: className
  }, _react.default.createElement(InlineInputComponent, selectionInputProps));
};

TableSelectRow.propTypes = {
  /**
   * Specify the aria label for the underlying input control
   */
  ariaLabel: _propTypes.default.string.isRequired,

  /**
   * Specify whether all items are selected, or not
   */
  checked: _propTypes.default.bool.isRequired,

  /**
   * Specify whether the control is disabled
   */
  disabled: _propTypes.default.bool,

  /**
   * Provide an `id` for the underlying input control
   */
  id: _propTypes.default.string.isRequired,

  /**
   * Provide a `name` for the underlying input control
   */
  name: _propTypes.default.string.isRequired,

  /**
   * Provide a handler to listen to when a user initiates a selection request
   */
  onSelect: _propTypes.default.func.isRequired,

  /**
   * Specify whether the control should be a radio button or inline checkbox
   */
  radio: _propTypes.default.bool,

  /**
   * The CSS class names of the cell that wraps the underlying input control
   */
  className: _propTypes.default.string
};
var _default = TableSelectRow;
exports.default = _default;
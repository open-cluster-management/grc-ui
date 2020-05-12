'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CheckBoxIcon = require('./CheckBoxIcon');

var _CheckBoxIcon2 = _interopRequireDefault(_CheckBoxIcon);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Checkbox = function Checkbox(_ref) {
  var className = _ref.className,
      id = _ref.id,
      labelText = _ref.labelText,
      _onChange = _ref.onChange,
      indeterminate = _ref.indeterminate,
      hideLabel = _ref.hideLabel,
      wrapperClassName = _ref.wrapperClassName,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? '' : _ref$title,
      hasGroups = _ref.hasGroups,
      isExpanded = _ref.isExpanded,
      tooltipText = _ref.tooltipText,
      other = _objectWithoutProperties(_ref, ['className', 'id', 'labelText', 'onChange', 'indeterminate', 'hideLabel', 'wrapperClassName', 'title', 'hasGroups', 'isExpanded', 'tooltipText']);

  var input = void 0;
  var labelClasses = (0, _classnames2.default)('bx--checkbox-label', className);
  var innerLabelClasses = (0, _classnames2.default)({
    'bx--visually-hidden': hideLabel
  });
  var wrapperClasses = (0, _classnames2.default)('bx--form-item', 'bx--checkbox-wrapper', wrapperClassName);

  return _react2.default.createElement(
    'div',
    { className: wrapperClasses },
    _react2.default.createElement('input', _extends({}, other, {
      type: 'checkbox',
      onChange: function onChange(evt) {
        _onChange(input.checked, id, evt);
      },
      className: 'bx--checkbox',
      id: id,
      ref: function ref(el) {
        input = el;
        if (input) {
          input.indeterminate = indeterminate;
        }
      }
    })),
    _react2.default.createElement(
      'label',
      { className: labelClasses, title: title || null, htmlFor: id },
      _react2.default.createElement(
        'div',
        {
          className: innerLabelClasses,
          style: {
            width: '' + (hasGroups ? 'calc(100% - 28px)' : '100%'),
            display: 'flex'
          } },
        _react2.default.createElement(
          'span',
          { style: { maxWidth: '100%' } },
          tooltipText ? _react2.default.createElement(
            _Tooltip2.default,
            {
              className: 'bx--checkbox--tooltip',
              showIcon: false,
              tabIndex: -1,
              triggerText: labelText },
            tooltipText
          ) : labelText,
          hasGroups && _react2.default.createElement(_CheckBoxIcon2.default, { isExpanded: isExpanded })
        )
      )
    )
  );
};

Checkbox.propTypes = {
  /**
   * Specify whether the underlying input should be checked
   */
  checked: _propTypes2.default.bool,

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked: _propTypes2.default.bool,

  /**
   * Specify whether the Checkbox is in an indeterminate state
   */
  indeterminate: _propTypes2.default.bool,

  /**
   * Specify an optional className to be applied to the <label> node
   */
  className: _propTypes2.default.string,

  /**
   * Specify whether the Checkbox should be disabled
   */
  disabled: _propTypes2.default.bool,

  /**
   * Provide an `id` to uniquely identify the Checkbox input
   */
  id: _propTypes2.default.string.isRequired,

  /**
   * Provide a label to provide a description of the Checkbox input that you are
   * exposing to the user
   */
  labelText: _propTypes2.default.node.isRequired,

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: _propTypes2.default.bool,

  /**
   * Receives three arguments: true/false, the checkbox's id, and the dom event.
   * `(value, id, event) => console.log({value, id, event})`
   */
  onChange: _propTypes2.default.func,

  /**
   * Specify a title for the <label> node for the Checkbox
   */
  title: _propTypes2.default.string,

  /**
   * The CSS class name to be placed on the wrapping element
   */
  wrapperClassName: _propTypes2.default.string
};

Checkbox.defaultProps = {
  onChange: function onChange() {},
  indeterminate: false
};

exports.default = Checkbox;
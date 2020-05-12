'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ListBoxField = require('./ListBoxField');

var _ListBoxField2 = _interopRequireDefault(_ListBoxField);

var _ListBoxMenu = require('./ListBoxMenu');

var _ListBoxMenu2 = _interopRequireDefault(_ListBoxMenu);

var _ListBoxPropTypes = require('./ListBoxPropTypes');

var _childrenOf = require('../../prop-types/childrenOf');

var _childrenOf2 = _interopRequireDefault(_childrenOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var handleOnKeyDown = function handleOnKeyDown(event) {
  if (event.keyCode === 27) {
    event.stopPropagation();
  }
};

var handleClick = function handleClick(event) {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * `ListBox` is a generic container component that handles creating the
 * container class name in response to certain props.
 */
var ListBox = function ListBox(_ref) {
  var _cx;

  var ariaLabel = _ref.ariaLabel,
      children = _ref.children,
      containerClassName = _ref.className,
      disabled = _ref.disabled,
      innerRef = _ref.innerRef,
      type = _ref.type,
      invalid = _ref.invalid,
      invalidText = _ref.invalidText,
      light = _ref.light,
      rest = _objectWithoutProperties(_ref, ['ariaLabel', 'children', 'className', 'disabled', 'innerRef', 'type', 'invalid', 'invalidText', 'light']);

  var className = (0, _classnames2.default)((_cx = {}, _defineProperty(_cx, containerClassName, !!containerClassName), _defineProperty(_cx, 'bx--list-box', true), _defineProperty(_cx, 'bx--list-box--inline', type === 'inline'), _defineProperty(_cx, 'bx--list-box--disabled', disabled), _defineProperty(_cx, 'bx--list-box--light', light), _cx));
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      'div',
      _extends({}, rest, {
        role: 'listbox',
        'aria-label': ariaLabel,
        className: className,
        ref: innerRef,
        onKeyDown: handleOnKeyDown,
        onClick: handleClick,
        'data-invalid': invalid || undefined,
        'aria-invalid': invalid || undefined }),
      children
    ),
    invalid ? _react2.default.createElement(
      'div',
      { className: 'bx--form-requirement' },
      invalidText
    ) : null
  );
};

ListBox.propTypes = {
  children: (0, _childrenOf2.default)([_ListBoxField2.default, _ListBoxMenu2.default]),

  /**
   * Specify a class name to be applied on the containing list box node
   */
  className: _propTypes2.default.string,

  /**
   * `innerRef` hook used for libraries like Downshift that require a reference
   * on a container node when it is not a native element
   */
  innerRef: _propTypes2.default.func.isRequired,

  /**
   * Specify whether the ListBox is currently disabled
   */
  disabled: _propTypes2.default.bool.isRequired,

  /**
   * Specify the "type" of the ListBox. Currently supports either `default` or
   * `inline` as an option.
   */
  type: _ListBoxPropTypes.ListBoxType.isRequired,

  /**
   * Specify the "aria-label" of the ListBox.
   */
  ariaLabel: _propTypes2.default.string
};

ListBox.defaultProps = {
  innerRef: function innerRef() {},
  disabled: false,
  type: 'default',
  ariaLabel: 'Choose an item'
};

exports.default = ListBox;
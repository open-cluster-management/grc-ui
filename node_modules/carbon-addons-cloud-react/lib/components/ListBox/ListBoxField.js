'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ListBoxMenuIcon = require('./ListBoxMenuIcon');

var _ListBoxMenuIcon2 = _interopRequireDefault(_ListBoxMenuIcon);

var _ListBoxSelection = require('./ListBoxSelection');

var _ListBoxSelection2 = _interopRequireDefault(_ListBoxSelection);

var _childrenOf = require('../../prop-types/childrenOf');

var _childrenOf2 = _interopRequireDefault(_childrenOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * `ListBoxField` is responsible for creating the containing node for valid
 * elements inside of a field. It also provides a11y-related attributes like
 * `role` to make sure a user can focus the given field.
 */
var ListBoxField = function ListBoxField(_ref) {
  var children = _ref.children,
      tabIndex = _ref.tabIndex,
      rest = _objectWithoutProperties(_ref, ['children', 'tabIndex']);

  return _react2.default.createElement(
    'div',
    _extends({
      role: 'button',
      className: 'bx--list-box__field',
      tabIndex: tabIndex
    }, rest),
    children
  );
};

ListBoxField.propTypes = {
  children: (0, _childrenOf2.default)([_ListBoxMenuIcon2.default, _ListBoxSelection2.default, 'span', 'input']),
  tabIndex: _propTypes2.default.string
};

ListBoxField.defaultProps = {
  tabIndex: '0'
};

exports.default = ListBoxField;
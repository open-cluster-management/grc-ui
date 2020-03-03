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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * `ListBoxMenuItem` is a helper component for managing the container class
 * name, alongside any classes for any corresponding states, for a generic list
 * box menu item.
 */
var ListBoxMenuItem = function ListBoxMenuItem(_ref) {
  var children = _ref.children,
      isActive = _ref.isActive,
      isHighlighted = _ref.isHighlighted,
      rest = _objectWithoutProperties(_ref, ['children', 'isActive', 'isHighlighted']);

  var className = (0, _classnames2.default)({
    'bx--list-box__menu-item': true,
    'bx--list-box__menu-item--active': isActive,
    'bx--list-box__menu-item--highlighted': isHighlighted
  });
  return _react2.default.createElement(
    'div',
    _extends({ className: className }, rest),
    children
  );
};

ListBoxMenuItem.propTypes = {
  /**
   * Specify any children nodes that hsould be rendered inside of the ListBox
   * Menu Item
   */
  children: _propTypes2.default.node,

  /**
   * Specify whether the current menu item is "active".
   */
  isActive: _propTypes2.default.bool.isRequired,

  /**
   * Specify whether the current menu item is "highlighed".
   */
  isHighlighted: _propTypes2.default.bool.isRequired
};

ListBoxMenuItem.defaultProps = {
  isActive: false,
  isHighlighted: false
};

exports.default = ListBoxMenuItem;
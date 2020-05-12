'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ListBoxMenuItem = require('./ListBoxMenuItem');

var _ListBoxMenuItem2 = _interopRequireDefault(_ListBoxMenuItem);

var _childrenOfType = require('../../prop-types/childrenOfType');

var _childrenOfType2 = _interopRequireDefault(_childrenOfType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * `ListBoxMenu` is a simple container node that isolates the `list-box__menu`
 * class into a single component. It is also being used to validate given
 * `children` components.
 */
var ListBoxMenu = function ListBoxMenu(_ref) {
  var children = _ref.children,
      rest = _objectWithoutProperties(_ref, ['children']);

  return _react2.default.createElement(
    'div',
    _extends({ className: 'bx--list-box__menu' }, rest),
    children
  );
};

ListBoxMenu.propTypes = {
  children: (0, _childrenOfType2.default)(_ListBoxMenuItem2.default)
};

exports.default = ListBoxMenu;
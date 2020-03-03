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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var categoryLabel = {
  color: '#5A6872',
  fontSize: '12px',
  fontFamily: 'ibm plex Sans',
  fontWeight: '600',
  letterSpacing: '0.2px',
  margin: '8px 16px'
};

var GroupLabel = function GroupLabel(_ref) {
  var className = _ref.className,
      children = _ref.children,
      id = _ref.id,
      other = _objectWithoutProperties(_ref, ['className', 'children', 'id']);

  var classNames = (0, _classnames2.default)('bx--group-label', className);

  return _react2.default.createElement(
    'label',
    _extends({
      htmlFor: id,
      className: 'bx--group-label',
      style: categoryLabel
    }, other),
    children
  );
};

GroupLabel.propTypes = {
  /**
   * Specify the content of the form label
   */
  children: _propTypes2.default.node,

  /**
   * Provide a custom className to be applied to the containing <label> node
   */
  className: _propTypes2.default.string,

  /**
   * Provide a unique id for the given <GroupLabel>
   */
  id: _propTypes2.default.string
};

exports.default = GroupLabel;
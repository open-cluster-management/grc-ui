var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import ListBoxMenuIcon from './ListBoxMenuIcon';
import ListBoxSelection from './ListBoxSelection';
import childrenOf from '../../prop-types/childrenOf';

/**
 * `ListBoxField` is responsible for creating the containing node for valid
 * elements inside of a field. It also provides a11y-related attributes like
 * `role` to make sure a user can focus the given field.
 */
var ListBoxField = function ListBoxField(_ref) {
  var children = _ref.children,
      tabIndex = _ref.tabIndex,
      rest = _objectWithoutProperties(_ref, ['children', 'tabIndex']);

  return React.createElement(
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
  children: childrenOf([ListBoxMenuIcon, ListBoxSelection, 'span', 'input']),
  tabIndex: PropTypes.string
};

ListBoxField.defaultProps = {
  tabIndex: '0'
};

export default ListBoxField;
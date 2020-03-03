var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

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

  var className = cx({
    'bx--list-box__menu-item': true,
    'bx--list-box__menu-item--active': isActive,
    'bx--list-box__menu-item--highlighted': isHighlighted
  });
  return React.createElement(
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
  children: PropTypes.node,

  /**
   * Specify whether the current menu item is "active".
   */
  isActive: PropTypes.bool.isRequired,

  /**
   * Specify whether the current menu item is "highlighed".
   */
  isHighlighted: PropTypes.bool.isRequired
};

ListBoxMenuItem.defaultProps = {
  isActive: false,
  isHighlighted: false
};

export default ListBoxMenuItem;
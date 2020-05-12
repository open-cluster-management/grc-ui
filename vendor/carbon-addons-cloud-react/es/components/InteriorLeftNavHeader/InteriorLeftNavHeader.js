var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

/**
 * The optional header in `<InteriorLeftNav>`.
 */
var InteriorLeftNavHeader = function InteriorLeftNavHeader(_ref) {
  var className = _ref.className,
      icon = _ref.icon,
      children = _ref.children,
      other = _objectWithoutProperties(_ref, ['className', 'icon', 'children']);

  var classNames = classnames('bx--interior-left-nav__header', className);

  return React.createElement(
    'div',
    _extends({ className: classNames }, other),
    icon,
    React.createElement(
      'div',
      { className: 'bx--interior-left-nav__header__title' },
      children
    )
  );
};

InteriorLeftNavHeader.propTypes = {
  /**
   * The CSS class names.
   */
  className: PropTypes.string,

  /**
   * The optional icon, e.g. `<Icon>`.
   */
  icon: PropTypes.node,

  /**
   * The child nodes.
   */
  children: PropTypes.node
};

export default InteriorLeftNavHeader;
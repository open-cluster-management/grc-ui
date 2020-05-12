var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

var newChild = function newChild(children, onFocus, _onClick, href) {
  var child = React.Children.only(children);
  return React.cloneElement(React.Children.only(child), {
    className: 'left-nav-list__item-link',
    onFocus: onFocus,
    onClick: function onClick(evt) {
      return _onClick(evt, href);
    },
    onKeyPress: function onKeyPress(evt) {
      return _onClick(evt, href);
    }
  });
};

var InteriorLeftNavItem = function InteriorLeftNavItem(_ref) {
  var className = _ref.className,
      href = _ref.href,
      activeHref = _ref.activeHref,
      _onClick2 = _ref.onClick,
      tabIndex = _ref.tabIndex,
      children = _ref.children,
      label = _ref.label,
      onFocus = _ref.onFocus,
      other = _objectWithoutProperties(_ref, ['className', 'href', 'activeHref', 'onClick', 'tabIndex', 'children', 'label', 'onFocus']);

  var classNames = classnames('left-nav-list__item', className, {
    'left-nav-list__item--active': activeHref === href
  });

  return React.createElement(
    'li',
    _extends({ className: classNames }, other),
    children ? newChild(children, onFocus, _onClick2, href) : React.createElement(
      'a',
      {
        className: 'left-nav-list__item-link',
        href: href,
        onClick: function onClick(evt) {
          return _onClick2(evt, href);
        } },
      label
    )
  );
};

InteriorLeftNavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  activeHref: PropTypes.string,
  tabIndex: PropTypes.number,
  onClick: PropTypes.func,
  blankTarget: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string.isRequired
};

InteriorLeftNavItem.defaultProps = {
  activeHref: '#',
  tabIndex: 0,
  label: 'InteriorLeftNavItem Label',
  onClick: /* istanbul ignore next */function onClick() {}
};

export default InteriorLeftNavItem;
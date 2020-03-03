var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CloudHeaderListItem = function CloudHeaderListItem(props) {
  var children = props.children,
      className = props.className,
      href = props.href,
      isIcon = props.isIcon,
      ariaExpanded = props.ariaExpanded,
      other = _objectWithoutProperties(props, ['children', 'className', 'href', 'isIcon', 'ariaExpanded']);

  var CloudHeaderListItemClasses = classNames('bx--cloud-header-list__item', className);

  var itemStyles = {};

  return React.createElement(
    'li',
    { className: CloudHeaderListItemClasses },
    isIcon ? React.createElement(
      'div',
      _extends({
        'aria-expanded': ariaExpanded,
        'aria-haspopup': 'true',
        role: 'button',
        tabIndex: '0',
        className: 'bx--cloud-header-list__btn'
      }, other),
      children
    ) : React.createElement(
      'a',
      _extends({ className: 'bx--cloud-header-list__link', href: href }, other),
      children
    )
  );
};

CloudHeaderListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string
};

CloudHeaderListItem.defaultProps = {
  href: ''
};

export default CloudHeaderListItem;
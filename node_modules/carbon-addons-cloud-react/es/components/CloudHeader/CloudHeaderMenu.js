var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var _ref = React.createElement(
  'svg',
  { width: '20', height: '20' },
  React.createElement(
    'title',
    null,
    'cloud header menu'
  ),
  React.createElement('path', { d: 'M3 4h14v1H3zM3 10h14v1H3zM3 16h14v1H3z' })
);

var CloudHeaderMenu = function CloudHeaderMenu(props) {
  var className = props.className,
      other = _objectWithoutProperties(props, ['className']);

  var cloudHeaderMenuClasses = classNames('bx--cloud-header__app-menu', className);

  return React.createElement(
    'button',
    _extends({ className: cloudHeaderMenuClasses, type: 'button' }, other),
    _ref
  );
};

CloudHeaderMenu.propTypes = {
  className: PropTypes.string
};

export default CloudHeaderMenu;
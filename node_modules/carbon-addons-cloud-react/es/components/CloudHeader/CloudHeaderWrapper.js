var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CloudHeaderWrapper = function CloudHeaderWrapper(props) {
  var children = props.children,
      className = props.className,
      other = _objectWithoutProperties(props, ['children', 'className']);

  var cloudHeaderWrapperClasses = classNames('bx--cloud-header__wrapper', className);

  return React.createElement(
    'div',
    _extends({ className: cloudHeaderWrapperClasses }, other),
    children
  );
};

CloudHeaderWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CloudHeaderWrapper;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CloudHeaderList = function CloudHeaderList(props) {
  var children = props.children,
      className = props.className,
      other = _objectWithoutProperties(props, ['children', 'className']);

  var cloudHeaderListClasses = classNames('bx--cloud-header-list', className);

  return React.createElement(
    'ul',
    _extends({ className: cloudHeaderListClasses }, other),
    children
  );
};

CloudHeaderList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CloudHeaderList;
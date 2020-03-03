var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

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

  var classNames = classnames('bx--group-label', className);

  return React.createElement(
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
  children: PropTypes.node,

  /**
   * Provide a custom className to be applied to the containing <label> node
   */
  className: PropTypes.string,

  /**
   * Provide a unique id for the given <GroupLabel>
   */
  id: PropTypes.string
};

export default GroupLabel;
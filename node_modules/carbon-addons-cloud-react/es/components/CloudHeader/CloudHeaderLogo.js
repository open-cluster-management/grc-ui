var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CloudHeaderLogo = function CloudHeaderLogo(props) {
  var children = props.children,
      className = props.className,
      href = props.href,
      companyName = props.companyName,
      productName = props.productName,
      other = _objectWithoutProperties(props, ['children', 'className', 'href', 'companyName', 'productName']);

  var CloudHeaderLogoClasses = classNames('bx--cloud-header-brand', className);

  return React.createElement(
    'a',
    _extends({ href: href, className: CloudHeaderLogoClasses }, other),
    children ? React.createElement(
      'div',
      { className: 'bx--cloud-header-brand__icon' },
      children
    ) : null,
    React.createElement(
      'h4',
      { className: 'bx--cloud-header-brand__text' },
      companyName,
      '\xA0',
      React.createElement(
        'span',
        null,
        productName
      )
    )
  );
};

CloudHeaderLogo.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  companyName: PropTypes.string,
  productName: PropTypes.string,
  href: PropTypes.string
};

CloudHeaderLogo.defaultProps = {
  companyName: 'IBM',
  productName: 'Cloud'
};

export default CloudHeaderLogo;
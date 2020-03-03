function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import warning from 'warning';
import { settings } from 'carbon-components';
import { ButtonTypes } from '../../prop-types/types';
import { breakingChangesX } from '../../internal/FeatureFlags';
var prefix = settings.prefix;
var didWarnAboutDeprecation = false;
var Button = React.forwardRef(function (_ref, ref) {
  var _classNames;

  var children = _ref.children,
      as = _ref.as,
      className = _ref.className,
      disabled = _ref.disabled,
      small = _ref.small,
      kind = _ref.kind,
      href = _ref.href,
      tabIndex = _ref.tabIndex,
      type = _ref.type,
      inputref = _ref.inputref,
      renderIcon = _ref.renderIcon,
      icon = _ref.icon,
      iconDescription = _ref.iconDescription,
      other = _objectWithoutProperties(_ref, ["children", "as", "className", "disabled", "small", "kind", "href", "tabIndex", "type", "inputref", "renderIcon", "icon", "iconDescription"]);

  var buttonClasses = classNames(className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefix, "--btn"), true), _defineProperty(_classNames, "".concat(prefix, "--btn--sm"), small), _defineProperty(_classNames, "".concat(prefix, "--btn--primary"), kind === 'primary'), _defineProperty(_classNames, "".concat(prefix, "--btn--danger"), kind === 'danger'), _defineProperty(_classNames, "".concat(prefix, "--btn--secondary"), kind === 'secondary'), _defineProperty(_classNames, "".concat(prefix, "--btn--ghost"), kind === 'ghost'), _defineProperty(_classNames, "".concat(prefix, "--btn--danger--primary"), kind === 'danger--primary'), _defineProperty(_classNames, "".concat(prefix, "--btn--tertiary"), kind === 'tertiary'), _defineProperty(_classNames, "".concat(prefix, "--btn--disabled"), disabled), _classNames));
  var commonProps = {
    tabIndex: tabIndex,
    className: buttonClasses,
    ref: breakingChangesX ? ref : ref || inputref
  };

  if (process.env.NODE_ENV !== "production" && breakingChangesX && icon) {
    process.env.NODE_ENV !== "production" ? warning(didWarnAboutDeprecation, 'The `icon` property in the `Button` component is being removed in the next release of ' + '`carbon-components-react`. Please use `renderIcon` instead.') : void 0;
    didWarnAboutDeprecation = true;
  }

  var hasRenderIcon = Object(renderIcon) === renderIcon;
  var ButtonImageElement = hasRenderIcon ? renderIcon : !breakingChangesX && icon && Icon;
  var buttonImage = !ButtonImageElement ? null : React.createElement(ButtonImageElement, {
    icon: !hasRenderIcon && Object(icon) === icon ? icon : undefined,
    name: !hasRenderIcon && Object(icon) !== icon ? icon : undefined,
    "aria-label": !hasRenderIcon ? undefined : iconDescription,
    description: hasRenderIcon ? undefined : iconDescription,
    className: "".concat(prefix, "--btn__icon"),
    "aria-hidden": true
  });
  var component = 'button';
  var otherProps = {
    disabled: disabled,
    type: type
  };
  var anchorProps = {
    role: 'button',
    href: href
  };

  if (as) {
    component = as;
    otherProps = _objectSpread({}, otherProps, anchorProps);
  } else if (href) {
    component = 'a';
    otherProps = anchorProps;
  }

  return React.createElement(component, _objectSpread({}, other, commonProps, otherProps), children, buttonImage);
});
Button.propTypes = {
  /**
   * Specify the content of your Button
   */
  children: PropTypes.node,

  /**
   * Specify how the button itself should be rendered.
   * Make sure to apply all props to the root node and render children appropriately
   */
  as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * Specify an optional className to be added to your Button
   */
  className: PropTypes.string,

  /**
   * Specify whether the Button should be disabled, or not
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether the Button should be a small variant
   */
  small: PropTypes.bool,

  /**
   * Specify the kind of Button you want to create
   */
  kind: ButtonTypes.buttonKind.isRequired,

  /**
   * Optionally specify an href for your Button to become an <a> element
   */
  href: PropTypes.string,

  /**
   * Optional prop to specify the tabIndex of the Button
   */
  tabIndex: PropTypes.number,

  /**
   * Optional prop to specify the type of the Button
   */
  type: PropTypes.oneOf(['button', 'reset', 'submit']),

  /**
   * Optional prop to specify the role of the Button
   */
  role: PropTypes.string,

  /**
   * Optional prop to allow overriding the icon rendering.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Specify an icon to include in the Button through a string or object
   * representing the SVG data of the icon
   */
  icon: PropTypes.oneOfType([PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
    svgData: PropTypes.object.isRequired
  }), PropTypes.string, PropTypes.node]),

  /**
   * If specifying the `icon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription: function iconDescription(props) {
    if ((props.icon || props.renderIcon) && !props.iconDescription) {
      return new Error('icon/renderIcon property specified without also providing an iconDescription property.');
    }

    return undefined;
  }
};
Button.defaultProps = {
  iconDescription: 'Provide icon description if icon is used',
  tabIndex: 0,
  type: 'button',
  disabled: false,
  small: false,
  kind: 'primary'
};
export default Button;
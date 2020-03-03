"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _warning = _interopRequireDefault(require("warning"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _carbonComponents = require("carbon-components");

var _Icon = _interopRequireDefault(require("../Icon"));

var _isRequiredOneOf = _interopRequireDefault(require("../../prop-types/isRequiredOneOf"));

var _FeatureFlags = require("../../internal/FeatureFlags");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var prefix = _carbonComponents.settings.prefix;
var didWarnAboutDeprecation = false;

var TableToolbarAction = function TableToolbarAction(_ref) {
  var className = _ref.className,
      renderIcon = _ref.renderIcon,
      icon = _ref.icon,
      iconName = _ref.iconName,
      iconDescription = _ref.iconDescription,
      rest = _objectWithoutProperties(_ref, ["className", "renderIcon", "icon", "iconName", "iconDescription"]);

  if (process.env.NODE_ENV !== "production" && _FeatureFlags.breakingChangesX && (icon || iconName)) {
    process.env.NODE_ENV !== "production" ? (0, _warning.default)(didWarnAboutDeprecation, 'The `icon`/`iconName` properties in the `TableToolbarAction` component is being removed in the next release of ' + '`carbon-components-react`. Please use `renderIcon` instead.') : void 0;
    didWarnAboutDeprecation = true;
  }

  var toolbarActionClasses = (0, _classnames.default)(className, "".concat(prefix, "--toolbar-action"));

  var tableToolbarActionIcon = function () {
    if (Object(renderIcon) === renderIcon) {
      var IconTag = renderIcon;
      return _react.default.createElement(IconTag, {
        className: "".concat(prefix, "--toolbar-action__icon"),
        "aria-label": iconDescription
      });
    } else if (!_FeatureFlags.breakingChangesX && (icon || iconName)) {
      return _react.default.createElement(_Icon.default, {
        className: "".concat(prefix, "--toolbar-action__icon"),
        icon: icon,
        name: iconName,
        description: iconDescription
      });
    }

    return null;
  }();

  return _react.default.createElement("button", _extends({
    className: toolbarActionClasses,
    title: iconDescription
  }, rest), tableToolbarActionIcon);
};

TableToolbarAction.propTypes = _objectSpread({
  children: _propTypes.default.node,
  className: _propTypes.default.string
}, (0, _isRequiredOneOf.default)({
  /**
   * Optional prop to allow overriding the toolbar icon rendering.
   * Can be a React component class
   */
  renderIcon: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),

  /**
   * Specify the icon for the toolbar action
   */
  icon: _propTypes.default.shape({
    width: _propTypes.default.string,
    height: _propTypes.default.string,
    viewBox: _propTypes.default.string.isRequired,
    svgData: _propTypes.default.object.isRequired
  }),

  /**
   * Specify the name of the icon for the toolbar action
   */
  iconName: _propTypes.default.string
}), {
  /**
   * Specify the description of the icon for the toolbar action
   */
  iconDescription: _propTypes.default.string.isRequired
});
var _default = TableToolbarAction;
exports.default = _default;
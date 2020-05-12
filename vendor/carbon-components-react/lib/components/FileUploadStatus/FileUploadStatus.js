"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FileUploadStatus;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _carbonComponents = require("carbon-components");

var _ = _interopRequireDefault(require("@carbon/icons-react/lib/close--filled/16"));

var _2 = _interopRequireDefault(require("@carbon/icons-react/lib/checkmark--filled/16"));

var _InlineLoading = _interopRequireDefault(require("../InlineLoading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var prefix = _carbonComponents.settings.prefix;

function FileUploadStatus(_ref) {
  var iconDescription = _ref.iconDescription,
      status = _ref.status,
      style = _ref.style,
      other = _objectWithoutProperties(_ref, ["iconDescription", "status", "style"]);

  switch (status) {
    case 'uploading':
      return _react.default.createElement(_InlineLoading.default, null);

    case 'edit':
      return _react.default.createElement(_.default, _extends({
        className: "".concat(prefix, "--file-close"),
        "aria-label": iconDescription,
        style: style
      }, other), iconDescription && _react.default.createElement("title", null, iconDescription));

    case 'complete':
      return _react.default.createElement(_2.default, _extends({
        className: "".concat(prefix, "--file-complete"),
        "aria-label": iconDescription,
        style: style
      }, other), iconDescription && _react.default.createElement("title", null, iconDescription));

    default:
      return null;
  }
}

FileUploadStatus.propTypes = {
  /**
   * Provide a description of the SVG icon to denote file upload status
   */
  iconDescription: _propTypes.default.string,

  /**
   * Provide an optional `onKeyDown` hook that is called if Space or Return is
   * pressed while the component is focused
   */
  onKeyDown: _propTypes.default.func,

  /**
   * Specify an optional object of styles to be applied inline to the root
   * node
   */
  style: _propTypes.default.object,

  /**
   * Specify the status of the File Upload
   */
  status: _propTypes.default.oneOf(['edit', 'complete', 'uploading']),

  /**
   * Provide a custom tabIndex value for the <FileUploadStatus>
   */
  tabIndex: _propTypes.default.string
};
FileUploadStatus.defaultProps = {
  iconDescription: 'Uploading file',
  onKeyDown: function onKeyDown() {},
  status: 'uploading',
  style: {},
  tabIndex: '0'
};
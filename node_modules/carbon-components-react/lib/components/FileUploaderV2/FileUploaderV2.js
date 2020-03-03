"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FileUploaderV2;
exports.FileUploaderButtonV2 = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _carbonComponents = require("carbon-components");

var _uniqueId = _interopRequireDefault(require("../../tools/uniqueId"));

var _types = require("../../prop-types/types");

var _FileUploadStatus = _interopRequireDefault(require("../FileUploadStatus/FileUploadStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prefix = _carbonComponents.settings.prefix;

var FileUploaderButtonV2 =
/*#__PURE__*/
function (_Component) {
  _inherits(FileUploaderButtonV2, _Component);

  function FileUploaderButtonV2() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FileUploaderButtonV2);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FileUploaderButtonV2)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "uid", _this.props.id || (0, _uniqueId.default)());

    return _this;
  }

  _createClass(FileUploaderButtonV2, [{
    key: "render",
    value: function render() {
      var _classNames,
          _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          multiple = _this$props.multiple,
          role = _this$props.role,
          tabIndex = _this$props.tabIndex,
          buttonKind = _this$props.buttonKind,
          accept = _this$props.accept,
          name = _this$props.name,
          disabled = _this$props.disabled,
          onChange = _this$props.onChange,
          labelText = _this$props.labelText,
          other = _objectWithoutProperties(_this$props, ["className", "multiple", "role", "tabIndex", "buttonKind", "accept", "name", "disabled", "onChange", "labelText"]);

      var classes = (0, _classnames.default)((_classNames = {}, _defineProperty(_classNames, "".concat(prefix, "--btn"), true), _defineProperty(_classNames, "".concat(prefix, "--btn--").concat(buttonKind), true), _defineProperty(_classNames, "".concat(prefix, "--btn--sm"), true), _defineProperty(_classNames, className, className), _classNames));
      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("label", _extends({
        tabIndex: tabIndex || 0,
        className: classes,
        onKeyDown: function onKeyDown(evt) {
          if (evt.which === 13 || evt.which === 32) {
            _this2.input.click();
          }
        },
        htmlFor: this.uid,
        role: role || 'button'
      }, other), labelText), _react.default.createElement("input", {
        className: "".concat(prefix, "--visually-hidden"),
        ref: function ref(input) {
          return _this2.input = input;
        },
        id: this.uid,
        disabled: disabled,
        type: "file",
        tabIndex: "-1",
        multiple: multiple,
        accept: accept,
        name: name,
        onChange: onChange,
        onClick: function onClick(evt) {
          evt.target.value = null;
        }
      }));
    }
  }]);

  return FileUploaderButtonV2;
}(_react.Component);

exports.FileUploaderButtonV2 = FileUploaderButtonV2;

_defineProperty(FileUploaderButtonV2, "propTypes", {
  /**
   * Provide a custom className to be applied to the container node
   */
  className: _propTypes.default.string,

  /**
   * Provide a unique id for the underlying <input> node
   */
  id: _propTypes.default.string,

  /**
   * Provide the label text to be read by screen readers when interacting with
   * this control
   */
  labelText: _propTypes.default.string,

  /**
   * Specify if the component should accept multiple files to upload
   */
  multiple: _propTypes.default.bool,

  /**
   * Provide a name for the underlying <input> node
   */
  name: _propTypes.default.string,

  /**
   * Provide an optional `onChange` hook that is called each time the <input>
   * value changes
   */
  onChange: _propTypes.default.func,

  /**
   * Provide an optional `onClick` hook that is called each time the button is
   * clicked
   */
  onClick: _propTypes.default.func,

  /**
   * Provide an accessibility role for the <FileUploaderButton>
   */
  role: _propTypes.default.string,

  /**
   * Provide a custom tabIndex value for the <FileUploaderButton>
   */
  tabIndex: _propTypes.default.number,

  /**
   * Specify the type of underlying button
   */
  buttonKind: _types.ButtonTypes.buttonKind,

  /**
   * Specify the types of files that this input should be able to receive
   */
  accept: _propTypes.default.arrayOf(_propTypes.default.string)
});

_defineProperty(FileUploaderButtonV2, "defaultProps", {
  tabIndex: 0,
  labelText: 'Add file',
  buttonKind: 'primary',
  multiple: false,
  onChange: function onChange() {},
  onClick: function onClick() {},
  accept: []
});

function FileUploaderV2(_ref) {
  var _classNames2;

  var buttonLabel = _ref.buttonLabel,
      buttonKind = _ref.buttonKind,
      labelDescription = _ref.labelDescription,
      labelTitle = _ref.labelTitle,
      className = _ref.className,
      multiple = _ref.multiple,
      accept = _ref.accept,
      name = _ref.name,
      onChange = _ref.onChange,
      _onClick = _ref.onClick,
      files = _ref.files,
      tabIndex = _ref.tabIndex,
      role = _ref.role,
      id = _ref.id,
      other = _objectWithoutProperties(_ref, ["buttonLabel", "buttonKind", "labelDescription", "labelTitle", "className", "multiple", "accept", "name", "onChange", "onClick", "files", "tabIndex", "role", "id"]);

  var handleChange = function handleChange(evt) {
    return onChange({
      evt: evt,
      multiple: multiple
    });
  };

  var classes = (0, _classnames.default)((_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefix, "--form-item"), true), _defineProperty(_classNames2, className, className), _classNames2));
  return _react.default.createElement("div", _extends({
    className: classes
  }, other), _react.default.createElement("strong", {
    className: "".concat(prefix, "--file--label")
  }, labelTitle), _react.default.createElement("p", {
    className: "".concat(prefix, "--label-description")
  }, labelDescription), _react.default.createElement(FileUploaderButtonV2, {
    labelText: buttonLabel,
    multiple: multiple,
    buttonKind: buttonKind,
    onChange: handleChange,
    accept: accept,
    name: name,
    tabIndex: tabIndex,
    role: role,
    id: id
  }), _react.default.createElement("div", {
    className: "".concat(prefix, "--file-container")
  }, files.length ? files.map(function (file, index) {
    return _react.default.createElement("span", _extends({
      key: (0, _uniqueId.default)(),
      className: "".concat(prefix, "--file__selected-file")
    }, other), _react.default.createElement("p", {
      className: "".concat(prefix, "--file-filename")
    }, file.name), _react.default.createElement("span", {
      className: "".concat(prefix, "--file__state-container")
    }, _react.default.createElement(_FileUploadStatus.default, {
      iconDescription: file.iconDescription,
      status: file.status,
      onKeyDown: function onKeyDown(evt) {
        if (evt.which === 13 || evt.which === 32) {
          _onClick({
            evt: evt,
            index: index
          });
        }
      },
      onClick: function onClick(evt) {
        if (file.status === 'edit') {
          _onClick({
            evt: evt,
            index: index
          });
        }
      }
    })));
  }) : null));
}

FileUploaderV2.propTypes = {
  /**
   * Provide a label for the <FileUploaderButton>
   */
  buttonLabel: _propTypes.default.string,

  /**
   * Specify the type of underlying button
   */
  buttonKind: _types.ButtonTypes.buttonKind,

  /**
   * Provide description text for the <FileUploaderV2> label
   */
  labelDescription: _propTypes.default.string,

  /**
   * Provide a label title for the input form
   */
  labelTitle: _propTypes.default.string,

  /**
   * Provide a unique id for the underlying <input> node
   */
  id: _propTypes.default.string,

  /**
   * Specify if the component should accept multiple files to upload
   */
  multiple: _propTypes.default.bool,

  /**
   * Provide a name for the underlying <input> node
   */
  name: _propTypes.default.string,

  /**
   * Provide an optional `onClick` hook that is called each time the button is
   * clicked
   */
  onClick: _propTypes.default.func,

  /**
   * Provide an optional `onChange` hook that is called each time the <input>
   * value changes
   */
  onChange: _propTypes.default.func,

  /**
   * Provide a custom className to be applied to the container node
   */
  className: _propTypes.default.string,

  /**
   * Specify the types of files that this input should be able to receive
   */
  accept: _propTypes.default.arrayOf(_propTypes.default.string),

  /**
   * Array of files in <FileUploaderV2>
   */
  files: _propTypes.default.arrayOf(_propTypes.default.object),

  /**
   * Provide a custom tabIndex value for the <FileUploaderButton>
   */
  tabIndex: _propTypes.default.number,

  /**
   * Provide an accessibility role for the <FileUploaderButton>
   */
  role: _propTypes.default.string
};
FileUploaderV2.defaultProps = {
  buttonLabel: 'Upload',
  buttonKind: 'primary',
  multiple: false,
  onClick: function onClick() {},
  onChange: function onChange() {},
  accept: [],
  files: [],
  tabIndex: 0
};
"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _fetchMock = _interopRequireDefault(require("fetch-mock"));

var _addonInfo = require("@storybook/addon-info");

var _addonKnobs = require("@storybook/addon-knobs");

var _FileUploaderV = _interopRequireWildcard(require("../FileUploaderV2"));

var _FileUploader = _interopRequireDefault(require("../FileUploaderSkeleton/FileUploader.Skeleton"));

var _Button = _interopRequireDefault(require("../Button"));

var _uniqueId = _interopRequireDefault(require("../../tools/uniqueId"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var coinToss = function coinToss() {
  return Math.round(Math.random());
};

_fetchMock.default.mock({
  method: 'POST',
  matcher: 'https://jsonplaceholder.typicode.com/posts/',
  response: function response() {
    return new Promise(function (resolve, reject) {
      return setTimeout(function () {
        return coinToss() ? resolve('200') : reject(500);
      }, 500);
    });
  }
});

var buttonKinds = {
  primary: 'Primary (primary)',
  secondary: 'Secondary (secondary)',
  danger: 'Danger (danger)',
  ghost: 'Ghost (ghost)',
  'danger--primary': 'Danger Primary (danger--primary)',
  tertiary: 'Tertiary (tertiary)'
};
var props = {
  FileUploaderButtonV2: function FileUploaderButtonV2() {
    var buttonKind = (0, _addonKnobs.select)('Button kind (buttonKind)', buttonKinds, '');
    return {
      labelText: (0, _addonKnobs.text)('Label text (labelText)', 'Add files'),
      name: (0, _addonKnobs.text)('Form item name: (name)', ''),
      multiple: (0, _addonKnobs.boolean)('Supports multiple files (multiple)', true),
      buttonKind: buttonKind || 'primary',
      role: (0, _addonKnobs.text)('ARIA role of the button (role)', ''),
      tabIndex: (0, _addonKnobs.number)('Tab index (tabIndex)', -1)
    };
  },
  FileUploaderV2: function FileUploaderV2() {
    var buttonKind = (0, _addonKnobs.select)('Button kind (buttonKind)', buttonKinds, '');
    return {
      labelTitle: (0, _addonKnobs.text)('The label title (labelTitle)', 'Upload'),
      labelDescription: (0, _addonKnobs.text)('The label description (labelDescription)', 'only .jpg or .png files at 500mb or less'),
      buttonLabel: (0, _addonKnobs.text)('The button label (buttonLabel)', 'Add files'),
      buttonKind: buttonKind || 'primary',
      accept: (0, _addonKnobs.array)('Accepted file extensions (accept)', ['.jpg', '.png'], ','),
      multiple: (0, _addonKnobs.boolean)('Supports multiple files (multiple)', true)
    };
  }
};

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(App)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      files: []
    });

    _defineProperty(_assertThisInitialized(_this), "upload", function (_ref) {
      var file = _ref.file;
      return fetch('https://jsonplaceholder.typicode.com/posts/', {
        method: 'POST',
        body: file
      }).then(function (res) {
        return console.log(res) || res.json();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (_ref2) {
      var evt = _ref2.evt,
          multiple = _ref2.multiple;
      evt.stopPropagation();
      var files = multiple ? _toConsumableArray(_this.state.files) : [];

      _toConsumableArray(evt.target.files).forEach(function (file) {
        var uuid = (0, _uniqueId.default)();
        files.push({
          uuid: uuid,
          name: file.name,
          size: file.size,
          status: 'uploading',
          iconDescription: 'Uploading'
        });
        var index = files.findIndex(function (file) {
          return file.uuid === uuid;
        });

        _this.upload({
          file: file
        }).then(function () {
          _fetchMock.default.resetHistory();

          files[index].status = 'complete';
          files[index].iconDescription = 'Upload complete';

          _this.setState({
            files: files
          });
        }).catch(function (error) {
          files[index].status = 'edit';
          files[index].iconDescription = 'Upload failed';

          _this.setState({
            files: files
          });

          return new Error(error);
        });
      });

      _this.setState({
        files: files
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (_ref3) {
      var evt = _ref3.evt,
          index = _ref3.index;

      if (evt) {
        evt.stopPropagation();
      }

      var filteredArray = _this.state.files.filter(function (file, i) {
        return i !== index;
      });

      _this.setState({
        files: filteredArray
      });
    });

    _defineProperty(_assertThisInitialized(_this), "clearFiles", function () {
      _this.setState({
        files: []
      });
    });

    return _this;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "bx--file__container"
      }, _react.default.createElement(_FileUploaderV.default, _extends({
        labelTitle: "Upload",
        buttonLabel: "Add files",
        name: "file",
        multiple: true,
        files: this.state.files,
        onChange: this.handleChange,
        onClick: this.handleClick
      }, props.FileUploaderV2())), _react.default.createElement(_Button.default, {
        kind: "secondary",
        small: true,
        style: {
          marginTop: '1rem'
        },
        onClick: this.clearFiles
      }, "Clear Files"));
    }
  }]);

  return App;
}(_react.default.Component);

(0, _react2.storiesOf)('FileUploaderV2', module).addDecorator(_addonKnobs.withKnobs).add('FileUploaderButton', (0, _addonInfo.withInfo)({
  text: 'The FileUploaderButton can be used as a standalone component if you do not need the extra UI that comes with FileUploader. The FileUploaderButton is used in FileUploader.'
})(function () {
  return _react.default.createElement(_FileUploaderV.FileUploaderButtonV2, _extends({
    labelText: "Add files",
    className: "bob",
    name: "file",
    onChange: function onChange() {
      return console.log('hi');
    },
    multiple: true
  }, props.FileUploaderButtonV2()));
})).add('FileUploader example application', (0, _addonInfo.withInfo)({
  text: 'example application'
})(function () {
  return _react.default.createElement(App, null);
})).add('skeleton', (0, _addonInfo.withInfo)({
  text: 'Placeholder skeleton state to use when content is loading.'
})(function () {
  return _react.default.createElement("div", {
    style: {
      width: '500px'
    }
  }, _react.default.createElement(_FileUploader.default, null));
}));
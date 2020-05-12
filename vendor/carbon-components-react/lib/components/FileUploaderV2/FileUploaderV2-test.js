"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _carbonComponents = require("carbon-components");

var _FileUploaderV = _interopRequireWildcard(require("../FileUploaderV2"));

var _FileUploader = _interopRequireDefault(require("../FileUploaderSkeleton/FileUploader.Skeleton"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = _carbonComponents.settings.prefix;
describe('FileUploaderButton', function () {
  var button = _react.default.createElement(_FileUploaderV.FileUploaderButtonV2, {
    className: "extra-class"
  });

  var mountWrapper = (0, _enzyme.mount)(button);
  describe('Renders as expected with default props', function () {
    it('renders with expected className', function () {
      expect(mountWrapper.find('label').hasClass("".concat(prefix, "--btn"))).toBe(true);
    });
    it('renders with given className', function () {
      expect(mountWrapper.hasClass('extra-class')).toBe(true);
    });
    it('renders with default labelText prop', function () {
      expect(mountWrapper.props().labelText).toEqual('Add file');
    });
    it('renders with default buttonKind prop', function () {
      expect(mountWrapper.props().buttonKind).toEqual('primary');
    });
    it('renders with expected button className', function () {
      expect(mountWrapper.find(".".concat(prefix, "--btn--primary")).exists()).toBe(true);
    });
    it('renders with default multiple prop', function () {
      expect(mountWrapper.props().multiple).toEqual(false);
    });
    it('renders with default accept prop', function () {
      expect(mountWrapper.props().accept).toEqual([]);
    });
    it('does not have default role', function () {
      expect(mountWrapper.props().role).not.toBeTruthy();
    });
    it('resets the input value onClick', function () {
      var input = mountWrapper.find(".".concat(prefix, "--visually-hidden"));
      input.instance().value = '';
      var evt = {
        target: {
          value: input.instance().value
        }
      };
      input.simulate('click', evt);
      expect(evt.target.value).toEqual(null);
    });
  });
  describe('Unique id props', function () {
    it('each FileUploaderButton should have a unique ID', function () {
      var mountedButtons = (0, _enzyme.mount)(_react.default.createElement("div", null, _react.default.createElement(_FileUploaderV.FileUploaderButtonV2, {
        className: "extra-class"
      }), _react.default.createElement(_FileUploaderV.FileUploaderButtonV2, {
        className: "extra-class"
      })));
      var firstButton = mountedButtons.find(_FileUploaderV.FileUploaderButtonV2).at(0);
      var lastButton = mountedButtons.find(_FileUploaderV.FileUploaderButtonV2).at(1);
      var isEqual = firstButton === lastButton;
      expect(isEqual).toBe(false);
    });
  });
});
describe('FileUploader', function () {
  var fileUploader = _react.default.createElement(_FileUploaderV.default, {
    className: "extra-class"
  });

  var mountWrapper = (0, _enzyme.mount)(fileUploader);
  describe('Renders as expected with defaults', function () {
    it('should render with default className', function () {
      expect(mountWrapper.children().hasClass("".concat(prefix, "--form-item"))).toEqual(true);
    });
    it('should render with given className', function () {
      expect(mountWrapper.hasClass('extra-class')).toEqual(true);
    });
    it('renders input with hidden prop', function () {
      expect(mountWrapper.find('input').props().className).toEqual("".concat(prefix, "--visually-hidden"));
    });
    it("renders with empty div.".concat(prefix, "--file-container by default"), function () {
      expect(mountWrapper.find("div.".concat(prefix, "--file-container")).text()).toEqual('');
    });
  });
});
describe('FileUploaderSkeleton', function () {
  describe('Renders as expected', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_FileUploader.default, null));
    it('Has the expected classes', function () {
      expect(wrapper.hasClass("".concat(prefix, "--form-item"))).toEqual(true);
    });
  });
});
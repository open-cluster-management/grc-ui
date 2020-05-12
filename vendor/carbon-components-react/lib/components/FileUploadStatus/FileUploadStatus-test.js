"use strict";

var _react = _interopRequireDefault(require("react"));

var _carbonComponents = require("carbon-components");

var _enzyme = require("enzyme");

var _FileUploadStatus = _interopRequireDefault(require("./FileUploadStatus"));

var _ = _interopRequireDefault(require("@carbon/icons-react/lib/close--filled/16"));

var _2 = _interopRequireDefault(require("@carbon/icons-react/lib/checkmark--filled/16"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = _carbonComponents.settings.prefix;

var rand3 = function rand3() {
  var n = Math.random();

  switch (n) {
    case n < 0.33:
      return 0;

    case 0.33 < n < 0.66:
      return 1;

    default:
      return 2;
  }
};

var possibleProps = {
  classNames: ['bx--loading', 'bx--file-close', 'bx--file-complete'],
  icons: [_react.default.createElement("div", {
    className: "".concat(prefix, "--loading"),
    style: {
      width: '1rem',
      height: '1rem'
    }
  }, _react.default.createElement("svg", {
    className: "".concat(prefix, "--loading__svg"),
    viewBox: "-42 -42 84 84"
  }, _react.default.createElement("circle", {
    cx: "0",
    cy: "0",
    r: "37.5"
  }))), _.default, _2.default],
  statuses: ['uploading', 'edit', 'complete']
};
describe('FileUploadStatus', function () {
  describe('Renders as expected', function () {
    var n = rand3();

    var element = _react.default.createElement(_FileUploadStatus.default, {
      iconDescription: "Upload complete",
      status: possibleProps.statuses[n]
    });

    var shallowWrapper = (0, _enzyme.shallow)(element);
    it('renders upload status icon as expected', function () {
      expect(shallowWrapper.length).toBe(1);

      switch (n) {
        case 0:
          expect(shallowWrapper.find("div.".concat(prefix, "--loading")).length).toBe(1);
          break;

        case 1:
          expect(shallowWrapper.find(_.default).length).toBe(1);
          break;

        case 2:
          expect(shallowWrapper.find(_2.default).length).toBe(1);
          break;

        default:
          break;
      }
    });
    it('has the expected classes', function () {
      expect(possibleProps.classNames).toContain(shallowWrapper.props().className);
    });
  });
  describe('Check that functions passed in as props are called', function () {
    var onClick = jest.fn();
    var onKeyDown = jest.fn();
    var wrapper = (0, _enzyme.mount)(_react.default.createElement(_FileUploadStatus.default, {
      onClick: onClick,
      onKeyDown: onKeyDown,
      status: "complete"
    }));
    it('should call onClick', function () {
      wrapper.simulate('click');
      expect(onClick).toBeCalled();
    });
    it('should call onKeyDown', function () {
      wrapper.simulate('keydown');
      expect(onKeyDown).toBeCalled();
    });
  });
});
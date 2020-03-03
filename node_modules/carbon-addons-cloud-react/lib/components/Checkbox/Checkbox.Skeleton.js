"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxSkeleton = function (_React$Component) {
  _inherits(CheckboxSkeleton, _React$Component);

  function CheckboxSkeleton() {
    _classCallCheck(this, CheckboxSkeleton);

    return _possibleConstructorReturn(this, (CheckboxSkeleton.__proto__ || Object.getPrototypeOf(CheckboxSkeleton)).apply(this, arguments));
  }

  _createClass(CheckboxSkeleton, [{
    key: "render",
    value: function render() {
      var id = this.props.id;

      return _react2.default.createElement(
        "div",
        { className: "bx--form-item bx--checkbox-wrapper" },

        // eslint-disable-next-line jsx-a11y/label-has-for,jsx-a11y/label-has-associated-control
        _react2.default.createElement("label", { className: "bx--checkbox-label bx--skeleton", htmlFor: id })
      );
    }
  }]);

  return CheckboxSkeleton;
}(_react2.default.Component);

exports.default = CheckboxSkeleton;
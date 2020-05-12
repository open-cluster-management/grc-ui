var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Icon } from 'carbon-components-react';

var TYPES = {
  functional: 'Functional'
};

var Tag = function (_Component) {
  _inherits(Tag, _Component);

  function Tag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tag.__proto__ || Object.getPrototypeOf(Tag)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      removed: false
    }, _this.handleRemove = function (event) {
      var _this$props = _this.props,
          onRemove = _this$props.onRemove,
          children = _this$props.children;

      event.stopPropagation();
      _this.setState({
        removed: true
      });

      if (onRemove) {
        onRemove(children);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tag, [{
    key: 'render',
    value: function render() {
      var _classNames,
          _this2 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          type = _props.type,
          isRemovable = _props.isRemovable,
          maxCharacters = _props.maxCharacters,
          onRemove = _props.onRemove,
          other = _objectWithoutProperties(_props, ['children', 'className', 'type', 'isRemovable', 'maxCharacters', 'onRemove']);

      var shortenedName = children;
      if (typeof children === 'string' && maxCharacters && children.length > maxCharacters) {
        var shorten = children.substring(0, maxCharacters).trim();
        shortenedName = shorten + '...';
      }
      var tagClasses = classNames((_classNames = {
        'bx--tag': true
      }, _defineProperty(_classNames, 'bx--tag--' + type, true), _defineProperty(_classNames, 'bx--tag__removed', this.state.removed), _defineProperty(_classNames, className, className), _classNames));

      var tagProps = _extends({}, other, {
        className: tagClasses
      });

      var closeIcon = React.createElement(Icon, {
        className: 'bx--tag-close',
        name: 'close',
        tabIndex: '0',
        role: 'button',
        description: 'detach the tag',
        onClick: this.handleRemove,
        onKeyDown: function onKeyDown(evt) {
          if (evt.which === 13 || evt.which === 32) _this2.handleRemove(evt);
        }
      });

      return React.createElement(
        'span',
        tagProps,
        shortenedName || TYPES[type],
        isRemovable && closeIcon
      );
    }
  }]);

  return Tag;
}(Component);

Tag.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
  isRemovable: PropTypes.bool,
  onRemove: PropTypes.func,
  maxCharacters: PropTypes.number
};
Tag.defaultProps = {
  onRemove: function onRemove() {},
  isRemovable: false
};
export default Tag;


export var types = Object.keys(TYPES);
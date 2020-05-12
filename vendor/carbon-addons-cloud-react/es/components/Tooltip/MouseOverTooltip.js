function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Tooltip } from 'carbon-components-react';

var MouseOverTooltip = function (_Tooltip) {
  _inherits(MouseOverTooltip, _Tooltip);

  function MouseOverTooltip() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MouseOverTooltip);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MouseOverTooltip.__proto__ || Object.getPrototypeOf(MouseOverTooltip)).call.apply(_ref, [this].concat(args))), _this), _this._handleHover = function (state, relatedTarget) {
      if (state === 'over') {
        if (!_this.state.open) {
          _this.getTriggerPosition();
          _this.setState({ open: true });
        }
      } else {
        if (_this.state.open) {
          _this.setState({ open: false });
        }
      }
    }, _this._debouncedHandleHover = debounce(_this._handleHover, 500), _this.handleMouse = function (evt) {
      var state = {
        mouseover: 'over',
        mouseout: 'out',
        focus: _this.props.clickToOpen ? 'over' : 'out',
        blur: 'out',
        click: _this.props.clickToOpen ? 'click' : 'out'
      }[evt.type];

      if (!_this.props.clickToOpen && (evt.target === _this._tooltipEl || evt.relatedTarget === _this._tooltipEl)) {
        state = 'out';
      }

      var hadContextMenu = _this._hasContextMenu;
      _this._hasContextMenu = evt.type === 'contextmenu';
      if (_this.props.clickToOpen) {
        if (state === 'click') {
          evt.stopPropagation();
          var shouldOpen = !_this.state.open;
          if (shouldOpen) {
            _this.getTriggerPosition();
          }
          _this.setState({ open: shouldOpen });
        }
      } else if (state && (state !== 'out' || !hadContextMenu)) {
        if (state === 'out') {
          _this._debouncedHandleHover.cancel();
          _this._handleHover(state, evt.relatedTarget);
        } else {
          _this._debouncedHandleHover(state, evt.relatedTarget);
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * Handles `mouseover`/`mouseout`/`focus`/`blur` event.
   * @param {string} state `over` to show the tooltip, `out` to hide the tooltip.
   * @param {Element} [relatedTarget] For handing `mouseout` event, indicates where the mouse pointer is gone.
   */


  return MouseOverTooltip;
}(Tooltip);

export default MouseOverTooltip;
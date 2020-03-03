var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

var Selection = function (_React$Component) {
  _inherits(Selection, _React$Component);

  function Selection(props) {
    _classCallCheck(this, Selection);

    var _this = _possibleConstructorReturn(this, (Selection.__proto__ || Object.getPrototypeOf(Selection)).call(this, props));

    _this.internalSetState = function (stateToSet, callback) {
      return _this.setState(stateToSet, function () {
        if (callback) {
          callback();
        }
        if (_this.props.onChange) {
          _this.props.onChange(_this.state);
        }
      });
    };

    _this.handleClearSelection = function () {
      _this.internalSetState({
        selectedItems: []
      });
    };

    _this.handleSelectItem = function (item) {
      _this.internalSetState(function (prevState) {
        return {
          selectedItems: [].concat(_toConsumableArray(prevState.selectedItems), [item])
        };
      });
    };

    _this.handleRemoveItem = function (item) {
      _this.internalSetState(function (prevState) {
        return {
          selectedItems: prevState.selectedItems.filter(function (itemOnState) {
            return itemOnState !== item;
          })
        };
      });
    };

    _this.handleOnItemChange = function (item) {
      var selectedItems = _this.state.selectedItems;


      var selectedIndex = void 0;
      selectedItems.forEach(function (selectedItem, index) {
        if (isEqual(selectedItem, item)) {
          selectedIndex = index;
        }
      });

      if (selectedIndex === undefined) {
        _this.handleSelectItem(item);
        return;
      }
      _this.handleRemoveItem(item);
    };

    _this.state = {
      selectedItems: props.initialSelectedItems
    };
    return _this;
  }

  _createClass(Selection, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          render = _props.render;
      var selectedItems = this.state.selectedItems;

      var renderProps = {
        selectedItems: selectedItems,
        onItemChange: this.handleOnItemChange,
        clearSelection: this.handleClearSelection
      };

      if (render !== undefined) {
        return render(renderProps);
      }

      if (children !== undefined) {
        return children(renderProps);
      }

      return null;
    }
  }]);

  return Selection;
}(React.Component);

Selection.propTypes = {
  initialSelectedItems: PropTypes.array.isRequired
};
Selection.defaultProps = {
  initialSelectedItems: []
};
export default Selection;
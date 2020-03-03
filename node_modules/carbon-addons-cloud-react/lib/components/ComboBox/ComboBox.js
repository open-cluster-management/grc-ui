'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _downshift = require('downshift');

var _downshift2 = _interopRequireDefault(_downshift);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ListBox = require('../ListBox');

var _ListBox2 = _interopRequireDefault(_ListBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultItemToString = function defaultItemToString(item) {
  if (typeof item === 'string') {
    return item;
  }

  return item && item.label;
};

var defaultShouldFilterItem = function defaultShouldFilterItem(_ref) {
  var inputValue = _ref.inputValue,
      item = _ref.item,
      itemToString = _ref.itemToString;
  return !inputValue || itemToString(item).toLowerCase().includes(inputValue.toLowerCase());
};

var getInputValue = function getInputValue(props, state) {
  if (props.initialSelectedItem) {
    return props.itemToString(props.initialSelectedItem);
  }

  return state.inputValue || '';
};

var ComboBox = function (_React$Component) {
  _inherits(ComboBox, _React$Component);

  function ComboBox(props) {
    _classCallCheck(this, ComboBox);

    var _this = _possibleConstructorReturn(this, (ComboBox.__proto__ || Object.getPrototypeOf(ComboBox)).call(this, props));

    _this.filterItems = function (items, itemToString, inputValue) {
      return items.filter(function (item) {
        return _this.props.shouldFilterItem({
          item: item,
          itemToString: itemToString,
          inputValue: inputValue
        });
      });
    };

    _this.handleOnChange = function (selectedItem) {
      if (_this.props.onChange) {
        _this.props.onChange({ selectedItem: selectedItem });
      }
    };

    _this.handleOnInputKeyDown = function (event) {
      event.stopPropagation();
    };

    _this.handleOnInputValueChange = function (inputValue) {
      var onInputChange = _this.props.onInputChange;

      _this.setState(function () {
        return {
          // Default to empty string if we have a false-y `inputValue`
          inputValue: inputValue || ''
        };
      }, function () {
        if (onInputChange) {
          onInputChange(inputValue);
        }
      });
    };

    _this.state = {
      inputValue: getInputValue(props, {})
    };
    return _this;
  }

  _createClass(ComboBox, [{
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState(function (state) {
        return {
          inputValue: getInputValue(nextProps, state)
        };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          containerClassName = _props.className,
          disabled = _props.disabled,
          id = _props.id,
          items = _props.items,
          itemToString = _props.itemToString,
          placeholder = _props.placeholder,
          initialSelectedItem = _props.initialSelectedItem,
          ariaLabel = _props.ariaLabel,
          translateWithId = _props.translateWithId,
          invalid = _props.invalid,
          invalidText = _props.invalidText,
          light = _props.light,
          type = _props.type,
          shouldFilterItem = _props.shouldFilterItem,
          onChange = _props.onChange,
          onInputChange = _props.onInputChange,
          rest = _objectWithoutProperties(_props, ['className', 'disabled', 'id', 'items', 'itemToString', 'placeholder', 'initialSelectedItem', 'ariaLabel', 'translateWithId', 'invalid', 'invalidText', 'light', 'type', 'shouldFilterItem', 'onChange', 'onInputChange']);

      var className = (0, _classnames2.default)('bx--combo-box', containerClassName);

      return _react2.default.createElement(
        _downshift2.default,
        {
          onChange: this.handleOnChange,
          onInputValueChange: this.handleOnInputValueChange,
          inputValue: this.state.inputValue || '',
          itemToString: itemToString,
          defaultSelectedItem: initialSelectedItem },
        function (_ref2) {
          var getButtonProps = _ref2.getButtonProps,
              getInputProps = _ref2.getInputProps,
              getItemProps = _ref2.getItemProps,
              getRootProps = _ref2.getRootProps,
              isOpen = _ref2.isOpen,
              inputValue = _ref2.inputValue,
              selectedItem = _ref2.selectedItem,
              highlightedIndex = _ref2.highlightedIndex,
              clearSelection = _ref2.clearSelection;
          return _react2.default.createElement(
            _ListBox2.default,
            _extends({
              className: className,
              disabled: disabled,
              invalid: invalid,
              invalidText: invalidText,
              light: light
            }, getRootProps({ refKey: 'innerRef' })),
            _react2.default.createElement(
              _ListBox2.default.Field,
              getButtonProps({ disabled: disabled }),
              _react2.default.createElement('input', _extends({
                className: 'bx--text-input',
                'aria-label': ariaLabel
              }, rest, getInputProps({
                disabled: disabled,
                id: id,
                placeholder: placeholder,
                onKeyDown: _this2.handleOnInputKeyDown
              }))),
              inputValue && isOpen && _react2.default.createElement(_ListBox2.default.Selection, {
                clearSelection: clearSelection,
                translateWithId: translateWithId
              }),
              _react2.default.createElement(_ListBox2.default.MenuIcon, {
                isOpen: isOpen,
                translateWithId: translateWithId
              })
            ),
            isOpen && _react2.default.createElement(
              _ListBox2.default.Menu,
              null,
              _this2.filterItems(items, itemToString, inputValue).map(function (item, index) {
                return _react2.default.createElement(
                  _ListBox2.default.MenuItem,
                  _extends({
                    key: itemToString(item),
                    isActive: selectedItem === item,
                    isHighlighted: highlightedIndex === index
                  }, getItemProps({ item: item, index: index })),
                  itemToString(item)
                );
              })
            )
          );
        }
      );
    }
  }]);

  return ComboBox;
}(_react2.default.Component);

ComboBox.propTypes = {
  /**
   * An optional className to add to the container node
   */
  className: _propTypes2.default.string,

  /**
   * Specify if the control should be disabled, or not
   */
  disabled: _propTypes2.default.bool,

  /**
   * Specify a custom `id` for the input
   */
  id: _propTypes2.default.string,

  /**
   * Allow users to pass in an arbitrary item or a string (in case their items are an array of strings)
   * from their collection that are pre-selected
   */
  initialSelectedItem: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  items: _propTypes2.default.array.isRequired,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list
   */
  itemToString: _propTypes2.default.func,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component when a specific dropdown item is selected.
   * @param {{ selectedItem }}
   */
  onChange: _propTypes2.default.func.isRequired,

  /**
   * Used to provide a placeholder text node before a user enters any input.
   * This is only present if the control has no items selected
   */
  placeholder: _propTypes2.default.string.isRequired,

  /**
   * Specify your own filtering logic by passing in a `shouldFilterItem`
   * function that takes in the current input and an item and passes back
   * whether or not the item should be filtered.
   */
  shouldFilterItem: _propTypes2.default.func,

  /**
   * Specify if the currently selected value is invalid.
   */
  invalid: _propTypes2.default.bool,

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: _propTypes2.default.string,

  /**
   * Specify a custom translation function that takes in a message identifier
   * and returns the localized string for the message
   */
  translateWithId: _propTypes2.default.func,

  /**
   * Currently supports either the default type, or an inline variant
   */
  type: _ListBox.PropTypes.ListBoxType,

  /**
   * Callback function to notify consumer when the text input changes.
   * This provides support to change available items based on the text.
   * @param {string} inputText
   */
  onInputChange: _propTypes2.default.func,

  /**
   * should use "light theme" (white background)?
   */
  light: _propTypes2.default.bool
};
ComboBox.defaultProps = {
  disabled: false,
  itemToString: defaultItemToString,
  shouldFilterItem: defaultShouldFilterItem,
  type: 'default',
  ariaLabel: 'ListBox input field',
  light: false
};
exports.default = ComboBox;
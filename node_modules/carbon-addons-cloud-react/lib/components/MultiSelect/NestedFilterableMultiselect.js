'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _downshift = require('downshift');

var _downshift2 = _interopRequireDefault(_downshift);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isequal');

var _lodash4 = _interopRequireDefault(_lodash3);

var _ListBox = require('../ListBox');

var _ListBox2 = _interopRequireDefault(_ListBox);

var _Checkbox = require('../Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _GroupLabel = require('../GroupLabel');

var _GroupLabel2 = _interopRequireDefault(_GroupLabel);

var _Selection = require('../../internal/Selection');

var _Selection2 = _interopRequireDefault(_Selection);

var _MultiSelectPropTypes = require('./MultiSelectPropTypes');

var _itemToString = require('./tools/itemToString');

var _groupedByCategory = require('./tools/groupedByCategory');

var _sorting = require('./tools/sorting');

var _filter = require('./tools/filter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedFilterableMultiselect = function (_React$Component) {
  _inherits(NestedFilterableMultiselect, _React$Component);

  function NestedFilterableMultiselect(props) {
    _classCallCheck(this, NestedFilterableMultiselect);

    var _this = _possibleConstructorReturn(this, (NestedFilterableMultiselect.__proto__ || Object.getPrototypeOf(NestedFilterableMultiselect)).call(this, props));

    _this.handleOnChange = function (changes) {
      if (_this.props.onChange) {
        _this.props.onChange(changes);
      }
    };

    _this.handleOnChangeSubOption = function (option) {
      if (!option.checked) {
        _this.setState(function (prevState) {
          return {
            checkedSuboptions: [].concat(_toConsumableArray(prevState.checkedSuboptions), [option])
          };
        });
      } else {
        _this.setState(function (prevState) {
          return {
            checkedSuboptions: prevState.checkedSuboptions.filter(function (selectedOption) {
              return selectedOption !== option;
            })
          };
        });
      }
      option.checked = !option.checked;
    };

    _this.onToggle = function (item) {
      !_this.state.openSections.includes(item) ? _this.setState({ openSections: [].concat(_toConsumableArray(_this.state.openSections), [item]) }) : _this.setState(function (prevState) {
        return {
          openSections: prevState.openSections.filter(function (itemOnState) {
            return itemOnState !== item;
          })
        };
      });
    };

    _this.handleOnOuterClick = function () {
      _this.setState({
        isOpen: false,
        inputValue: ''
      });
    };

    _this.handleOnStateChange = function (changes) {
      var type = changes.type;

      switch (type) {
        case _downshift2.default.stateChangeTypes.changeInput:
          _this.setState({ inputValue: changes.inputValue });
          break;
        case _downshift2.default.stateChangeTypes.keyDownArrowUp:
        case _downshift2.default.stateChangeTypes.itemMouseEnter:
          _this.setState({ highlightedIndex: changes.highlightedIndex });
          break;
        case _downshift2.default.stateChangeTypes.keyDownArrowDown:
          _this.setState({
            highlightedIndex: changes.highlightedIndex,
            isOpen: true
          });
          break;
        case _downshift2.default.stateChangeTypes.keyDownEscape:
        case _downshift2.default.stateChangeTypes.mouseUp:
          _this.setState({ isOpen: false });
          break;
        // Opt-in to some cases where we should be toggling the menu based on
        // a given key press or mouse handler
        // Reference: https://github.com/paypal/downshift/issues/206
        case _downshift2.default.stateChangeTypes.clickButton:
        case _downshift2.default.stateChangeTypes.keyDownSpaceButton:
          _this.setState(function () {
            var nextIsOpen = changes.isOpen || false;
            if (changes.isOpen === false) {
              // If Downshift is trying to close the menu, but we know the input
              // is the active element in thedocument, then keep the menu open
              if (_this.inputNode === document.activeElement) {
                nextIsOpen = true;
              }
            }
            return {
              isOpen: nextIsOpen
            };
          });
          break;
      }
    };

    _this.handleOnInputValueChange = (0, _lodash2.default)(function (value, _ref) {
      var type = _ref.type;

      if (type === _downshift2.default.stateChangeTypes.changeInput) {
        var _this$props = _this.props,
            items = _this$props.items,
            initialSelectedItems = _this$props.initialSelectedItems,
            filterItems = _this$props.filterItems,
            itemToString = _this$props.itemToString;
        var _this$state = _this.state,
            openSections = _this$state.openSections,
            prevInputValue = _this$state.inputValue;


        var inputValue = Array.isArray(value) ? prevInputValue : value;
        var itemsToProcess = initialSelectedItems ? items.map(function (obj) {
          return initialSelectedItems.find(function (o) {
            return o.id === obj.id;
          }) || obj;
        }) : items;
        var matchedItems = itemsToProcess.filter(function (item) {
          if (!item.options || openSections.includes(item) || !inputValue) {
            return false;
          }
          var filteredItems = filterItems(item.options, {
            itemToString: itemToString,
            inputValue: inputValue
          });
          return filteredItems.length > 0;
        });

        var itemsToExpand = matchedItems.length > 0 ? [].concat(_toConsumableArray(openSections), _toConsumableArray(matchedItems)) : openSections;

        _this.setState(function () {
          return {
            openSections: itemsToExpand,
            inputValue: inputValue || ''
          };
        });
      }
    }, 200);

    _this.clearInputValue = function (event) {
      event.stopPropagation();
      _this.setState({ inputValue: '' });
      _this.inputNode && _this.inputNode.focus && _this.inputNode.focus();
    };

    _this.getParentItem = function (item) {
      var items = _this.props.items;


      var parent = void 0;
      items.some(function (thisItem) {
        if (thisItem.options && thisItem.options.includes(item)) {
          parent = thisItem;
          return true;
        }
        return false;
      });

      return parent;
    };

    _this.handleSelectSubOptions = function (supOptions) {
      supOptions.map(function (option) {
        _this.handleOnChangeSubOption(option);
      });
    };

    _this.onItemChange = function (item, selectedItems, onItemChange) {
      var parent = _this.getParentItem(item);

      var options = parent ? parent.options : item.options;
      var myCheckedOptions = options ? options.filter(function (subOption) {
        return subOption.checked;
      }) : null;
      var myUncheckedOptions = options ? options.filter(function (subOption) {
        return !subOption.checked;
      }) : null;

      if (parent) {
        _this.handleOnChangeSubOption(item);

        var onlySupOpChecked = myCheckedOptions.length == 1 && myCheckedOptions.includes(item);
        if (onlySupOpChecked || myCheckedOptions.length == 0) {
          onItemChange(parent);
        } else {
          _this.handleOnChange({ selectedItems: selectedItems });
        }
      } else {
        onItemChange(item);
        if (item.options) {
          var includesItem = selectedItems.includes(item);
          if (myCheckedOptions.length == 0 && !includesItem) {
            _this.handleSelectSubOptions(myUncheckedOptions);
          } else {
            _this.handleSelectSubOptions(myCheckedOptions);
          }
        }
      }
    };

    _this.state = {
      highlightedIndex: null,
      isOpen: false,
      inputValue: '',
      openSections: [],
      checkedSuboptions: []
    };
    return _this;
  }

  _createClass(NestedFilterableMultiselect, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          highlightedIndex = _state.highlightedIndex,
          isOpen = _state.isOpen,
          inputValue = _state.inputValue,
          openSections = _state.openSections;
      var _props = this.props,
          containerClassName = _props.className,
          disabled = _props.disabled,
          filterItems = _props.filterItems,
          items = _props.items,
          itemToString = _props.itemToString,
          initialSelectedItems = _props.initialSelectedItems,
          id = _props.id,
          locale = _props.locale,
          placeholder = _props.placeholder,
          sortItems = _props.sortItems,
          compareItems = _props.compareItems,
          light = _props.light,
          customCategorySorting = _props.customCategorySorting,
          showTooltip = _props.showTooltip;


      var itemsToProcess = initialSelectedItems ? items.map(function (obj) {
        return initialSelectedItems.find(function (o) {
          return o.id === obj.id;
        }) || obj;
      }) : items;
      var className = (0, _classnames2.default)('bx--multi-select', 'bx--combo-box', containerClassName, {
        'bx--list-box--light': light
      });

      var currentIndex = -1;
      var highlighted = void 0;

      return _react2.default.createElement(_Selection2.default, {
        onChange: this.handleOnChange,
        initialSelectedItems: initialSelectedItems,
        render: function render(_ref2) {
          var selectedItems = _ref2.selectedItems,
              onItemChange = _ref2.onItemChange,
              _clearSelection = _ref2.clearSelection;
          return _react2.default.createElement(_downshift2.default, {
            highlightedIndex: highlightedIndex,
            isOpen: isOpen,
            inputValue: inputValue,
            onInputValueChange: _this2.handleOnInputValueChange,
            onChange: function onChange(item) {
              _this2.onItemChange(item, selectedItems, onItemChange);
            },
            itemToString: itemToString,
            onStateChange: _this2.handleOnStateChange,
            onOuterClick: _this2.handleOnOuterClick,
            selectedItem: selectedItems,
            render: function render(_ref3) {
              var getButtonProps = _ref3.getButtonProps,
                  getInputProps = _ref3.getInputProps,
                  getItemProps = _ref3.getItemProps,
                  getRootProps = _ref3.getRootProps,
                  isOpen = _ref3.isOpen,
                  inputValue = _ref3.inputValue,
                  selectedItem = _ref3.selectedItem;
              return _react2.default.createElement(
                _ListBox2.default,
                _extends({
                  className: className,
                  disabled: disabled
                }, getRootProps({ refKey: 'innerRef' })),
                _react2.default.createElement(
                  _ListBox2.default.Field,
                  _extends({ tabIndex: '-1' }, getButtonProps({ disabled: disabled })),
                  selectedItem.length > 0 && _react2.default.createElement(_ListBox2.default.Selection, {
                    clearSelection: function clearSelection(e) {
                      {
                        selectedItems.forEach(function (item) {
                          if (item.options) {
                            var myCheckedOptions = item.options.filter(function (subOption) {
                              return subOption.checked == true;
                            });
                            _this2.handleSelectSubOptions(myCheckedOptions);
                          }
                        });
                        _clearSelection(e);
                      }
                    },
                    selectionCount: selectedItems.reduce(function (total, item) {
                      if (item.options) {
                        return total + item.options.filter(function (option) {
                          return option.checked;
                        }).length;
                      }
                      return total + 1;
                    }, 0)
                  }),
                  _react2.default.createElement('input', _extends({
                    className: 'bx--text-input',
                    'aria-label': placeholder,
                    ref: function ref(el) {
                      return _this2.inputNode = el;
                    }
                  }, getInputProps({
                    disabled: disabled,
                    id: id,
                    placeholder: placeholder,
                    onKeyDown: function onKeyDown(e) {
                      e.stopPropagation();
                      var highlightedItem = highlighted && highlighted.item;
                      if (highlightedItem) {
                        if (e.which === 40) {
                          // Down arrow
                          if (highlightedItem.options && !openSections.includes(highlightedItem)) {
                            _this2.onToggle(highlightedItem);
                          }
                        } else if (e.which === 38) {
                          // Up arrow
                          var parentItem = _this2.getParentItem(highlightedItem);
                          if (parentItem && highlighted.index === 0 && openSections.includes(parentItem)) {
                            _this2.onToggle(parentItem);
                          }
                        }
                      }
                    },
                    onKeyUp: function onKeyUp(e) {
                      var which = e.which;
                      if (which === 27) {
                        _this2.setState({ isOpen: false });
                      }
                    }
                  }))),
                  inputValue && isOpen && _react2.default.createElement(_ListBox2.default.Selection, { clearSelection: _this2.clearInputValue }),
                  _react2.default.createElement(_ListBox2.default.MenuIcon, { isOpen: isOpen })
                ),
                isOpen && _react2.default.createElement(
                  _ListBox2.default.Menu,
                  {
                    style: {
                      maxHeight: '424px',
                      overflowX: 'hidden',
                      paddingTop: '8px'
                    } },
                  (0, _groupedByCategory.groupedByCategory)(itemsToProcess, customCategorySorting).map(function (group, index) {
                    var hasGroups = group[0] !== 'undefined' ? true : false;
                    var filteredItems = filterItems(group[1], {
                      itemToString: itemToString,
                      inputValue: inputValue
                    });
                    var categoryName = '';
                    hasGroups ? categoryName = group[0].toUpperCase() : null;

                    return _react2.default.createElement(
                      _react.Fragment,
                      { key: group[0] || index },
                      hasGroups && filteredItems.length > 0 && _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                          _GroupLabel2.default,
                          { key: index },
                          categoryName
                        )
                      ),
                      sortItems(filteredItems, {
                        selectedItems: selectedItems,
                        itemToString: itemToString,
                        compareItems: compareItems,
                        locale: locale
                      }).map(function (item) {
                        currentIndex++;

                        if (highlightedIndex === currentIndex) {
                          highlighted = { item: item, index: index };
                        }

                        var itemProps = getItemProps({
                          item: item,
                          index: currentIndex
                        });
                        var itemText = itemToString(item);

                        var isChecked = selectedItem.filter(function (selected) {
                          return selected.id == item.id;
                        }).length > 0;
                        var subOptions = item.options;
                        var groupIsOpen = openSections.filter(function (groupOpen) {
                          return (0, _lodash4.default)(groupOpen, item);
                        }).length > 0;

                        var myCheckedOptions = subOptions ? item.options.filter(function (subOption) {
                          return subOption.checked;
                        }) : null;
                        var myUncheckedOptions = subOptions ? item.options.filter(function (subOption) {
                          return !subOption.checked;
                        }) : null;

                        return _react2.default.createElement(
                          _react.Fragment,
                          { key: itemProps.id },
                          _react2.default.createElement(
                            _ListBox2.default.MenuItem,
                            _extends({
                              isActive: isChecked,
                              isHighlighted: highlightedIndex === currentIndex
                            }, itemProps, {
                              onClick: function onClick(e) {
                                {
                                  var clickOutOfCheckBox = subOptions && e.target.localName !== 'label' && e.target.localName !== 'input';
                                  if (clickOutOfCheckBox) {
                                    _this2.onToggle(item);
                                  } else {
                                    _this2.onItemChange(item, selectedItems, onItemChange);
                                  }
                                }
                              } }),
                            _react2.default.createElement(_Checkbox2.default, {
                              id: itemProps.id,
                              name: itemText,
                              checked: isChecked,
                              indeterminate: myCheckedOptions && myUncheckedOptions && myCheckedOptions.length > 0 && myUncheckedOptions.length > 0,
                              readOnly: true,
                              tabIndex: '-1',
                              labelText: itemText,
                              tooltipText: showTooltip && itemText,
                              hasGroups: subOptions,
                              isExpanded: groupIsOpen
                            })
                          ),
                          groupIsOpen && subOptions != undefined && sortItems(filterItems(subOptions, {
                            itemToString: itemToString,
                            inputValue: inputValue,
                            parent: item
                          }), {
                            selectedItems: selectedItems,
                            itemToString: itemToString,
                            compareItems: compareItems,
                            locale: locale,
                            parent: item
                          }).map(function (item, index) {
                            var myIndex = ++currentIndex;

                            if (highlightedIndex === currentIndex) {
                              highlighted = { item: item, index: index };
                            }

                            var optionsProps = getItemProps({
                              item: item,
                              index: currentIndex
                            });
                            var isCheckedSub = myCheckedOptions.includes(item);
                            var subOpText = itemToString(item);
                            var checkBoxIndex = index.toString();
                            return _react2.default.createElement(
                              _ListBox2.default.MenuItem,
                              _extends({
                                key: optionsProps.id,
                                style: { paddingLeft: '35px' },
                                isActive: isCheckedSub,
                                isHighlighted: highlightedIndex === myIndex
                              }, optionsProps, {
                                onClick: function onClick(e) {
                                  _this2.onItemChange(item, selectedItems, onItemChange);
                                },
                                onMouseMove: function onMouseMove() {
                                  _this2.setState({
                                    highlightedIndex: myIndex
                                  });
                                } }),
                              _react2.default.createElement(_Checkbox2.default, {
                                id: checkBoxIndex,
                                name: subOpText,
                                checked: isCheckedSub,
                                tabIndex: '-1',
                                labelText: subOpText,
                                tooltipText: showTooltip && subOpText,
                                readOnly: true
                              })
                            );
                          })
                        );
                      })
                    );
                  })
                )
              );
            }
          });
        }
      });
    }
  }]);

  return NestedFilterableMultiselect;
}(_react2.default.Component);

NestedFilterableMultiselect.propTypes = _extends({}, _MultiSelectPropTypes.sortingPropTypes, {

  /**
   * Disable the control
   */
  disabled: _propTypes2.default.bool,

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  items: _propTypes2.default.array.isRequired,

  /**
   * Allow users to pass in arbitrary items from their collection that are
   * pre-selected
   */
  initialSelectedItems: _propTypes2.default.array,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list.
   */
  itemToString: _propTypes2.default.func,

  /**
   * Specify the locale of the control. Used for the default `compareItems`
   * used for sorting the list of items in the control.
   */
  locale: _propTypes2.default.string,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component what kind of internal state changes are occuring.
   */
  onChange: _propTypes2.default.func,

  /**
   * Generic `placeholder` that will be used as the textual representation of
   * what this field is for
   */
  placeholder: _propTypes2.default.string.isRequired,

  /**
   * `true` to use the light version.
   */
  light: _propTypes2.default.bool,

  /**
   * `customCategorySorting` is use to sort the items by category, aphabetic order if not specify
   */
  customCategorySorting: _propTypes2.default.func,

  /**
   * `true` to show tooltip.
   */
  showTooltip: _propTypes2.default.bool
});
NestedFilterableMultiselect.defaultProps = {
  compareItems: _sorting.defaultCompareItems,
  disabled: false,
  filterItems: _filter.defaultFilterItems,
  initialSelectedItems: [],
  itemToString: _itemToString.defaultItemToString,
  locale: 'en',
  sortItems: _sorting.defaultSortItems,
  light: false,
  showTooltip: true
};
exports.default = NestedFilterableMultiselect;
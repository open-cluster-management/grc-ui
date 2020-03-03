var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import ListBox from '../ListBox';
import Checkbox from '../Checkbox';
import GroupLabel from '../GroupLabel';
import Selection from '../../internal/Selection';
import { sortingPropTypes } from './MultiSelectPropTypes';
import { defaultItemToString } from './tools/itemToString';
import { groupedByCategory } from './tools/groupedByCategory';
import { defaultSortItems, defaultCompareItems } from './tools/sorting';
import { defaultFilterItems } from './tools/filter';

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
        case Downshift.stateChangeTypes.changeInput:
          _this.setState({ inputValue: changes.inputValue });
          break;
        case Downshift.stateChangeTypes.keyDownArrowUp:
        case Downshift.stateChangeTypes.itemMouseEnter:
          _this.setState({ highlightedIndex: changes.highlightedIndex });
          break;
        case Downshift.stateChangeTypes.keyDownArrowDown:
          _this.setState({
            highlightedIndex: changes.highlightedIndex,
            isOpen: true
          });
          break;
        case Downshift.stateChangeTypes.keyDownEscape:
        case Downshift.stateChangeTypes.mouseUp:
          _this.setState({ isOpen: false });
          break;
        // Opt-in to some cases where we should be toggling the menu based on
        // a given key press or mouse handler
        // Reference: https://github.com/paypal/downshift/issues/206
        case Downshift.stateChangeTypes.clickButton:
        case Downshift.stateChangeTypes.keyDownSpaceButton:
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

    _this.handleOnInputValueChange = debounce(function (value, _ref) {
      var type = _ref.type;

      if (type === Downshift.stateChangeTypes.changeInput) {
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
      var className = cx('bx--multi-select', 'bx--combo-box', containerClassName, {
        'bx--list-box--light': light
      });

      var currentIndex = -1;
      var highlighted = void 0;

      return React.createElement(Selection, {
        onChange: this.handleOnChange,
        initialSelectedItems: initialSelectedItems,
        render: function render(_ref2) {
          var selectedItems = _ref2.selectedItems,
              onItemChange = _ref2.onItemChange,
              _clearSelection = _ref2.clearSelection;
          return React.createElement(Downshift, {
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
              return React.createElement(
                ListBox,
                _extends({
                  className: className,
                  disabled: disabled
                }, getRootProps({ refKey: 'innerRef' })),
                React.createElement(
                  ListBox.Field,
                  _extends({ tabIndex: '-1' }, getButtonProps({ disabled: disabled })),
                  selectedItem.length > 0 && React.createElement(ListBox.Selection, {
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
                  React.createElement('input', _extends({
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
                  inputValue && isOpen && React.createElement(ListBox.Selection, { clearSelection: _this2.clearInputValue }),
                  React.createElement(ListBox.MenuIcon, { isOpen: isOpen })
                ),
                isOpen && React.createElement(
                  ListBox.Menu,
                  {
                    style: {
                      maxHeight: '424px',
                      overflowX: 'hidden',
                      paddingTop: '8px'
                    } },
                  groupedByCategory(itemsToProcess, customCategorySorting).map(function (group, index) {
                    var hasGroups = group[0] !== 'undefined' ? true : false;
                    var filteredItems = filterItems(group[1], {
                      itemToString: itemToString,
                      inputValue: inputValue
                    });
                    var categoryName = '';
                    hasGroups ? categoryName = group[0].toUpperCase() : null;

                    return React.createElement(
                      Fragment,
                      { key: group[0] || index },
                      hasGroups && filteredItems.length > 0 && React.createElement(
                        'div',
                        null,
                        React.createElement(
                          GroupLabel,
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
                          return isEqual(groupOpen, item);
                        }).length > 0;

                        var myCheckedOptions = subOptions ? item.options.filter(function (subOption) {
                          return subOption.checked;
                        }) : null;
                        var myUncheckedOptions = subOptions ? item.options.filter(function (subOption) {
                          return !subOption.checked;
                        }) : null;

                        return React.createElement(
                          Fragment,
                          { key: itemProps.id },
                          React.createElement(
                            ListBox.MenuItem,
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
                            React.createElement(Checkbox, {
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
                            return React.createElement(
                              ListBox.MenuItem,
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
                              React.createElement(Checkbox, {
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
}(React.Component);

NestedFilterableMultiselect.propTypes = _extends({}, sortingPropTypes, {

  /**
   * Disable the control
   */
  disabled: PropTypes.bool,

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  items: PropTypes.array.isRequired,

  /**
   * Allow users to pass in arbitrary items from their collection that are
   * pre-selected
   */
  initialSelectedItems: PropTypes.array,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list.
   */
  itemToString: PropTypes.func,

  /**
   * Specify the locale of the control. Used for the default `compareItems`
   * used for sorting the list of items in the control.
   */
  locale: PropTypes.string,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component what kind of internal state changes are occuring.
   */
  onChange: PropTypes.func,

  /**
   * Generic `placeholder` that will be used as the textual representation of
   * what this field is for
   */
  placeholder: PropTypes.string.isRequired,

  /**
   * `true` to use the light version.
   */
  light: PropTypes.bool,

  /**
   * `customCategorySorting` is use to sort the items by category, aphabetic order if not specify
   */
  customCategorySorting: PropTypes.func,

  /**
   * `true` to show tooltip.
   */
  showTooltip: PropTypes.bool
});
NestedFilterableMultiselect.defaultProps = {
  compareItems: defaultCompareItems,
  disabled: false,
  filterItems: defaultFilterItems,
  initialSelectedItems: [],
  itemToString: defaultItemToString,
  locale: 'en',
  sortItems: defaultSortItems,
  light: false,
  showTooltip: true
};
export default NestedFilterableMultiselect;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultFilterItems = exports.defaultFilterItems = function defaultFilterItems(items, _ref) {
  var itemToString = _ref.itemToString,
      inputValue = _ref.inputValue,
      parent = _ref.parent;
  return items.filter(function (item) {
    if (!inputValue) {
      return true;
    }
    if (item.options) {
      // if any of the child item matches, the parent item should be shown
      var isMatch = item.options.filter(function (option) {
        return itemToString(option).toLowerCase().includes(inputValue.toLowerCase());
      }).length > 0;
      if (isMatch) {
        return true;
      }
    }
    if (parent) {
      // if it matches the parent, all sub items should be shown
      var _isMatch = itemToString(parent).toLowerCase().includes(inputValue.toLowerCase());
      if (_isMatch) {
        return true;
      }
    }
    return itemToString(item).toLowerCase().includes(inputValue.toLowerCase());
  });
};
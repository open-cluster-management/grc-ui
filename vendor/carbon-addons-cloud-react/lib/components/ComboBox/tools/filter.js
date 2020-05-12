"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultFilterItems = exports.defaultFilterItems = function defaultFilterItems(items, _ref) {
  var itemToString = _ref.itemToString,
      inputValue = _ref.inputValue;
  return items.filter(function (item) {
    if (!inputValue) {
      return true;
    }
    return itemToString(item).toLowerCase().includes(inputValue.toLowerCase());
  });
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultItemToString = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var itemToString = function itemToString(item) {
  (0, _invariant2.default)(typeof item.label === 'string', '[MultiSelect] the default `itemToString` method expected to receive ' + 'an item with a `label` field of type `string`. Instead received: `%s`', _typeof(item.label));
  return item.label || '';
};

var defaultItemToString = exports.defaultItemToString = function defaultItemToString(item) {
  if (Array.isArray(item)) {
    return item.map(itemToString);
  }
  return itemToString(item);
};
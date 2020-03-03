'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonTypes = undefined;

var _propTypes = require('prop-types');

var ButtonTypes = exports.ButtonTypes = {
  buttonKind: (0, _propTypes.oneOf)(['primary', 'secondary', 'danger', 'ghost', 'danger--primary', 'tertiary'])
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _createChainableTypeChecker = require('./tools/createChainableTypeChecker');

var _createChainableTypeChecker2 = _interopRequireDefault(_createChainableTypeChecker);

var _getDisplayName = require('./tools/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `childrenOf` is used for asserting that the children of a given React
 * component are of a given set of types. Currently, this will work with types
 * that are Stateless Functional and Class-based components
 *
 * This prop validator also supports chaining through `isRequired`
 */
var childrenOf = function childrenOf(expectedChildTypes) {
  // Support both React elements and components by using `type` if it exists
  var expectedDisplayNames = expectedChildTypes.map(function (child) {
    return (0, _getDisplayName2.default)(child.type || child);
  }).join(', ');

  var validate = function validate(props, propName, componentName) {
    _react.Children.forEach(props[propName], function (child) {
      if (!child) {
        return;
      }
      var childDisplayName = (0, _getDisplayName2.default)(child.type || child);
      if (!expectedChildTypes.includes(child.type)) {
        throw new Error('Invalid prop `children` of type `' + childDisplayName + '` ' + ('supplied to `' + componentName + '`, expected each child to be one ') + ('of: `[' + expectedDisplayNames + ']`.'));
      }
    });
  };

  return (0, _createChainableTypeChecker2.default)(validate);
};

exports.default = childrenOf;
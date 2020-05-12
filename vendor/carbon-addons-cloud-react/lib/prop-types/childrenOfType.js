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
 * `childrenOfType` is used for asserting that children of a given React
 * component are only of a given type. Currently, this supports React elements,
 * Stateless Functional Components, and Class-based components.
 *
 * This prop validator also supports chaining through `isRequired`
 */
var childrenOfType = function childrenOfType(expectedChildType) {
  var expectedDisplayName = (0, _getDisplayName2.default)(
  // Support both React elements and components by using `type` if it exists
  expectedChildType.type || expectedChildType);
  var validate = function validate(props, propName, componentName) {
    _react.Children.forEach(props[propName], function (child) {
      var childDisplayName = (0, _getDisplayName2.default)(child.type);
      if (child.type !== expectedChildType.type && child.type !== expectedChildType) {
        throw new Error('Invalid prop `children` of type `' + childDisplayName + '` ' + ('supplied to `' + componentName + '`, expected each child to be a ') + ('`' + expectedDisplayName + '` component.'));
      }
    });
  };

  return (0, _createChainableTypeChecker2.default)(validate);
};

exports.default = childrenOfType;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param {Object<string, Function>} propTypes The list of type checkers, keyed by prop names.
 * @returns {Object<string, Function>}
 *   The new prop type checkers that checks if one of the given props exist,
 *   in addition to the original type checkings.
 */
export default function isRequiredOneOf(propTypes) {
  var names = Object.keys(propTypes);
  var checker = function checker(propType) {
    return function (props, propName, componentName) {
      for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        rest[_key - 3] = arguments[_key];
      }

      if (__DEV__ && names.every(function (name) {
        return !props.hasOwnProperty(name);
      })) {
        return new Error(componentName + ' requires one of the following props: ' + names.join(', '));
      }
      return propType.apply(undefined, [props, propName, componentName].concat(rest));
    };
  };
  return names.reduce(function (o, name) {
    return _extends({}, o, _defineProperty({}, name, checker(propTypes[name])));
  }, {});
}
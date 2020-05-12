function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */


var _require = require('node-sass'),
    types = _require.types;

var _require2 = require('../../../../tools/jest/scss'),
    convert = _require2.convert,
    renderSass = _require2.renderSass;

describe('_grid.scss', function () {
  it('should export grid variables',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _ref2, calls, variables;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return renderSass("\n@import './src/globals/grid/grid';\n\n$variables: (\n  'max-width': $max-width,\n  'columns': $max-width,\n  'grid-breakpoints': $grid-breakpoints,\n  'gutter-breakpoints': $gutter-breakpoints,\n  'grid-gutter-breakpoints': $grid-gutter-breakpoints,\n);\n\n@each $key, $value in $variables {\n  $t: test($key, $value);\n}\n");

          case 2:
            _ref2 = _context.sent;
            calls = _ref2.calls;
            variables = calls.reduce(function (acc, _ref3) {
              var _ref4 = _slicedToArray(_ref3, 2),
                  key = _ref4[0],
                  value = _ref4[1];

              return _objectSpread({}, acc, _defineProperty({}, key.getValue(), convert(value)));
            }, {});
            expect(variables).toMatchInlineSnapshot("\nObject {\n  \"columns\": \"1600px\",\n  \"grid-breakpoints\": Object {\n    \"lg\": \"992px\",\n    \"md\": \"768px\",\n    \"sm\": \"576px\",\n    \"xl\": \"1200px\",\n    \"xxl\": \"1600px\",\n  },\n  \"grid-gutter-breakpoints\": Object {\n    \"sm\": \"5%\",\n    \"xs\": \"3%\",\n  },\n  \"gutter-breakpoints\": Object {\n    \"sm\": \"10px\",\n    \"xs\": \"5px\",\n  },\n  \"max-width\": \"1600px\",\n}\n");

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it('should support the grid mixin',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var _ref6, result;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return renderSass("\n$css--reset: false;\n$css--helpers: false;\n@import './src/globals/grid/grid';\n\n@include grid();\n");

          case 2:
            _ref6 = _context2.sent;
            result = _ref6.result;
            expect(result.css.toString()).toMatchSnapshot();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it('should support the breakpoint function',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var _ref8, calls, error, output, i;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return renderSass("\n@import './src/globals/grid/grid';\n\n@each $key, $value in $grid-breakpoints {\n  $t: test($key, breakpoint($key));\n}\n$t: test('unknown', breakpoint('unknown'));\n");

          case 2:
            _ref8 = _context3.sent;
            calls = _ref8.calls;
            error = _ref8.error;
            output = _ref8.output; // We want to check valid breakpoints up to the last call, which was
            // unknown

            for (i = 0; i < calls.length - 1; i++) {
              expect(calls[i][0]).toBeInstanceOf(types.String);
              expect(calls[i][1]).toBeInstanceOf(types.Number);
            } // `breakpoint` is expected to warn on the unknown test case


            expect(output.warn).toHaveBeenCalledTimes(1); // This should fail because `breakpoint('unknown')` does not return a
            // value

            expect(error).toBeDefined();

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  describe('grid--x', function () {
    it('should generate grid code when the grid feature flag is on',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _ref10, result;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return renderSass("\n$feature-flags: (grid: true);\n@import './src/globals/grid/grid';\n");

            case 2:
              _ref10 = _context4.sent;
              result = _ref10.result;
              expect(result.css.toString()).toMatchSnapshot();

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
    it('should export a 12 column grid by default',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var _ref12, result, output, breakpoints, _i2, breakpoint;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return renderSass("\n$feature-flags: (grid: true);\n@import './src/globals/grid/grid';\n");

            case 2:
              _ref12 = _context5.sent;
              result = _ref12.result;
              output = result.css.toString();
              breakpoints = ['lg', 'xlg', 'max'];

              for (_i2 = 0; _i2 < breakpoints.length; _i2++) {
                breakpoint = breakpoints[_i2];
                expect(output).toEqual(expect.stringContaining("col-".concat(breakpoint, "-12")));
                expect(output).not.toEqual(expect.stringContaining("col-".concat(breakpoint, "-13")));
                expect(output).toEqual(expect.stringContaining("--offset-".concat(breakpoint, "-11")));
                expect(output).not.toEqual(expect.stringContaining("--offset-".concat(breakpoint, "-12")));
              }

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should export a 16 column grid behind a flag',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var _ref14, result, output, breakpoints, _i3, breakpoint;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return renderSass("\n$feature-flags: (grid: true, grid-columns-16: true);\n@import './src/globals/grid/grid';\n");

            case 2:
              _ref14 = _context6.sent;
              result = _ref14.result;
              output = result.css.toString();
              breakpoints = ['lg', 'xlg', 'max'];

              for (_i3 = 0; _i3 < breakpoints.length; _i3++) {
                breakpoint = breakpoints[_i3];
                expect(output).toEqual(expect.stringContaining("col-".concat(breakpoint, "-16")));
                expect(output).not.toEqual(expect.stringContaining("col-".concat(breakpoint, "-17")));
                expect(output).toEqual(expect.stringContaining("--offset-".concat(breakpoint, "-15")));
                expect(output).not.toEqual(expect.stringContaining("--offset-".concat(breakpoint, "-16")));
              }

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });
});
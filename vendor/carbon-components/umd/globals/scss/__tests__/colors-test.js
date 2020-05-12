(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.colorsTest = mod.exports;
  }
})(this, function () {
  "use strict";

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


  var _require = require('../../../../tools/jest/scss'),
      renderSass = _require.renderSass;

  var classic = [// UI color scheme
  'blue-20', 'blue-30', 'blue-40', 'blue-50', 'blue-90', 'navy-gray-1', 'navy-gray-2', 'navy-gray-3', 'navy-gray-4', 'navy-gray-5', 'navy-gray-6', 'navy-gray-7', 'navy-gray-8', 'navy-gray-9', 'white', // Light UI color scheme
  'blue-51', 'gray-1', 'gray-2', 'gray-3', // Accent colors
  'blue-10', 'blue-60', 'teal-10', 'teal-20', 'teal-30', 'teal-40', 'teal-50', 'teal-60', 'green-10', 'green-20', 'green-30', 'green-40', 'green-50', 'green-60', 'yellow-10', 'yellow-20', 'yellow-30', 'yellow-60', 'orange-10', 'orange-20', 'orange-30', 'orange-60', 'red-10', 'red-30', 'red-40', 'red-50', 'red-60', 'purple-10', 'purple-20', 'purple-30', 'purple-40', 'purple-60'];
  describe('_colors.scss', function () {
    describe.each(classic)('%s', function (name) {
      it("should be exported as $color__".concat(name),
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _ref2, calls;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return renderSass("\n@import './src/globals/scss/colors';\n$c: test(global-variable-exists(color__".concat(name, "));\n"));

              case 2:
                _ref2 = _context.sent;
                calls = _ref2.calls; // Check that global-variable-exists returned true

                expect(calls[0][0].getValue()).toBe(true);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })));
    });
  });
});
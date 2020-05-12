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
    global.cssPlexCoreTest = mod.exports;
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
      convert = _require.convert,
      renderSass = _require.renderSass;

  var variables = ['font-path', 'unicodes', 'families', 'fallbacks', 'weights'];
  describe('_css--plex-core', function () {
    it.each(variables)('should export the variable $%s',
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(name) {
        var _ref2, calls;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return renderSass("\n@import './src/globals/scss/css--plex-core';\n\n$c: test(global-variable-exists(".concat(name, "));\n$value: test($").concat(name, ");\n"));

              case 2:
                _ref2 = _context.sent;
                calls = _ref2.calls; // Check that global-variable-exists returned true

                expect(calls[0][0].getValue()).toBe(true);
                expect(convert(calls[1][0])).toMatchSnapshot();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    describe('check-default-font-path', function () {
      it('should warn if the default $font-path uses unpkg',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _ref4, output;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return renderSass("\n@import './src/globals/scss/css--plex-core';\n\n@include check-default-font-path() {\n  $test: true;\n};\n");

              case 2:
                _ref4 = _context2.sent;
                output = _ref4.output;
                expect(output.warn).toHaveBeenCalledTimes(1);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
      it('should not warn if $font-path is set and does not contain unpkg',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _ref6, output;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return renderSass("\n$font-path: 'https://my-custom-cdn.com';\n@import './src/globals/scss/css--plex-core';\n\n@include check-default-font-path() {\n  $test: true;\n};\n");

              case 2:
                _ref6 = _context3.sent;
                output = _ref6.output;
                expect(output.warn).not.toHaveBeenCalled();

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));
    });
    describe('plex-font-face', function () {
      it('should output @font-face files based on families, weights, and unicodes',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var _ref8, result;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return renderSass("\n@import './src/globals/scss/css--plex-core';\n\n@include plex-font-face();\n");

              case 2:
                _ref8 = _context4.sent;
                result = _ref8.result;
                expect(result.css.toString()).toMatchSnapshot();

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
    });
  });
});
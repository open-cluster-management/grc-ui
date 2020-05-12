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
    global.typographyTest = mod.exports;
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

  var variables = ['font-family-mono', 'font-family-sans-serif', 'font-family-serif', 'font-family-helvetica', 'base-font-size', 'typescale-map', 'font-size-map'];
  describe('_typography.scss', function () {
    describe.each(variables)('$%s', function (name) {
      it('should be exported',
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
                return renderSass("\n@import './src/globals/scss/typography';\n$t: test(global-variable-exists(".concat(name, "));\n"));

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
      it('should match export value',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _ref4, calls;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n$t: test($".concat(name, ");\n"));

              case 2:
                _ref4 = _context2.sent;
                calls = _ref4.calls;
                expect(convert(calls[0][0])).toMatchSnapshot();

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
    });
    describe('typescale mixin', function () {
      it('should return a font-size value for a valid size',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var sizes, tests, _ref6, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                sizes = ['giga', 'mega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'omega', 'caption', 'legal', 'p'];
                tests = sizes.map(function (size) {
                  return "\n.test-".concat(size, " {\n  @include typescale('").concat(size, "');\n}\n");
                });
                _context3.next = 4;
                return renderSass("\n@import './src/globals/scss/typography';\n".concat(tests.join('\n'), "\n"));

              case 4:
                _ref6 = _context3.sent;
                result = _ref6.result;
                expect(result.css.toString()).toMatchSnapshot();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));
      it('should warn if given invalid size',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var _ref8, output;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n.test {\n  @include typescale('<unknown>');\n}\n");

              case 2:
                _ref8 = _context4.sent;
                output = _ref8.output;
                expect(output.warn).toHaveBeenCalledTimes(1);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
    });
    describe('unit mixin', function () {
      it('should output the appropriate unit derived from a pixel value',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        var _ref10, calls;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n\n$t: test(rem(16px));\n$t: test(em(16px));\n");

              case 2:
                _ref10 = _context5.sent;
                calls = _ref10.calls;
                expect(convert(calls[0][0])).toBe('1rem');
                expect(convert(calls[1][0])).toBe('1em');

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      })));
    });
    describe('helvetica mixin', function () {
      it('should output a font-family value',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        var _ref12, result;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n.test {\n  @include helvetica();\n}\n");

              case 2:
                _ref12 = _context6.sent;
                result = _ref12.result;
                expect(result.css.toString()).toMatchSnapshot();

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      })));
    });
    describe('font-family mixin', function () {
      it('should output IBM Plex if css--plex is set to true',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        var _ref14, result;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n$css--plex: true;\n\n.test {\n  @include font-family();\n}\n");

              case 2:
                _ref14 = _context7.sent;
                result = _ref14.result;
                expect(result.css.toString()).toEqual(expect.stringContaining('ibm-plex-sans'));

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      })));
      it('should output IBM Helvetica if css--plex is set to false',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var _ref16, result;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n$css--plex: false;\n\n.test {\n  @include font-family();\n}\n");

              case 2:
                _ref16 = _context8.sent;
                result = _ref16.result;
                expect(result.css.toString()).toEqual(expect.stringContaining('IBM Helvetica'));

              case 5:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      })));
    });
    describe('line-height', function () {
      it('should output valid line-heights for specific elements, otherwise it should warn',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        var _ref18, output, result;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n\n.test-heading {\n  @include line-height('heading');\n}\n\n.test-body {\n  @include line-height('body');\n}\n\n.test-unknown {\n  @include line-height('<unknown>');\n}\n");

              case 2:
                _ref18 = _context9.sent;
                output = _ref18.output;
                result = _ref18.result;
                expect(result.css.toString()).toMatchSnapshot();
                expect(output.warn).toHaveBeenCalledTimes(1);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      })));
    });
    describe('font-smoothing mixin', function () {
      it('should output font-smoothing properties',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10() {
        var _ref20, result;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n\n.test {\n  @include font-smoothing();\n}\n");

              case 2:
                _ref20 = _context10.sent;
                result = _ref20.result;
                expect(result.css.toString()).toMatchSnapshot();

              case 5:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      })));
    });
    describe('letter-spacing mixin', function () {
      it('should output letter-spacing properties',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11() {
        var _ref22, result;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return renderSass("\n@import './src/globals/scss/typography';\n\n.test {\n  @include letter-spacing();\n}\n");

              case 2:
                _ref22 = _context11.sent;
                result = _ref22.result;
                expect(result.css.toString()).toMatchSnapshot();

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      })));
    });
    describe('font-size mixin', function () {
      it('should output a font-size property if given a valid size',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12() {
        var sizes, tests, _ref24, output, result;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                sizes = ['76', '54', '36', '28', '20', '18', '16', '14', '12', '11'];
                tests = sizes.map(function (size) {
                  return "\n.test-".concat(size, " {\n  @include font-size('").concat(size, "');\n}\n");
                });
                _context12.next = 4;
                return renderSass("\n@import './src/globals/scss/typography';\n".concat(tests.join('\n'), "\n\n.test-unknown {\n  @include font-size('<unknown>');\n}\n"));

              case 4:
                _ref24 = _context12.sent;
                output = _ref24.output;
                result = _ref24.result;
                expect(result.css.toString()).toMatchSnapshot();
                expect(output.warn).toHaveBeenCalledTimes(1);

              case 9:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      })));
    });
  });
});
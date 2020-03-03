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
    global.cssFontFaceTest = mod.exports;
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

  describe('_css--font-face.scss', function () {
    it('should not output CSS if $css--font-face is false',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _ref2, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return renderSass("\n$css--font-face: false;\n@import './src/globals/scss/css--font-face';\n");

            case 2:
              _ref2 = _context.sent;
              result = _ref2.result; // Should be an empty string, currently will output only @keyframes that are
              // not wrapped around a css flag

              expect(result.css.toString()).toMatchSnapshot();

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('should output helvetica if $css--font-face is true and $css--plex is false',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _ref4, result;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return renderSass("\n$css--font-face: true;\n$css--plex: false;\n@import './src/globals/scss/css--font-face';\n");

            case 2:
              _ref4 = _context2.sent;
              result = _ref4.result;
              expect(result.css.toString()).toEqual(expect.stringContaining('@font-face'));
              expect(result.css.toString()).toEqual(expect.stringContaining("font-family: 'IBM Helvetica'"));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
    it('should output plex if $css--font-face and $css--plex are true',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var _ref6, result;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return renderSass("\n$css--font-face: true;\n$css--plex: true;\n@import './src/globals/scss/css--font-face';\n");

            case 2:
              _ref6 = _context3.sent;
              result = _ref6.result;
              expect(result.css.toString()).toEqual(expect.stringContaining('@font-face'));
              expect(result.css.toString()).toEqual(expect.stringContaining("font-family: 'ibm-plex-sans'"));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
    describe('experimental', function () {
      it('should output @font-face blocks from elements if components-x flag is enabled',
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
                return renderSass("\n$css--font-face: true;\n$css--plex: true;\n$feature-flags: (components-x: true);\n@import './src/globals/scss/css--font-face';\n");

              case 2:
                _ref8 = _context4.sent;
                result = _ref8.result;
                expect(result.css.toString()).toMatchSnapshot();
                expect(result.css.toString()).toEqual(expect.stringContaining('@font-face'));
                expect(result.css.toString()).toEqual(expect.stringContaining("font-family: 'IBM Plex Mono'"));
                expect(result.css.toString()).toEqual(expect.stringContaining("font-family: 'IBM Plex Sans'"));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
    });
  });
});
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

var variables = ['carbon--ease-in', 'carbon--ease-out', 'carbon--standard-easing', 'transition--base', 'transition--expansion', 'bx--ease-in', 'bx--ease-out', 'bx--standard-easing'];
describe('motion', function () {
  describe.each(variables)('$%s',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(name) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Temporarily test for regression since these variables were initially
              // under _vars.scss
              it('should be exported through _vars.scss',
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                var _ref3, calls;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return renderSass("\n@import './src/globals/scss/vars';\n\n$c: test(global-variable-exists(".concat(name, "));\n"));

                      case 2:
                        _ref3 = _context.sent;
                        calls = _ref3.calls; // Check that global-variable-exists returned true

                        expect(calls[0][0].getValue()).toBe(true);

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }))); // New location

              it('should be exported through _motion.scss',
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                var _ref5, calls;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return renderSass("\n@import './src/globals/scss/motion';\n\n$c: test(global-variable-exists(".concat(name, "));\n"));

                      case 2:
                        _ref5 = _context2.sent;
                        calls = _ref5.calls; // Check that global-variable-exists returned true

                        expect(calls[0][0].getValue()).toBe(true);

                      case 5:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              })));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  describe('motion function', function () {
    it('should be exported',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _ref7, calls;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return renderSass("\n@import './src/globals/scss/motion';\n\n$c: test(function-exists(motion));\n$c: test(function-exists(carbon--motion));\n");

            case 2:
              _ref7 = _context4.sent;
              calls = _ref7.calls; // Check that global-variable-exists returned true

              expect(calls[0][0].getValue()).toBe(true);
              expect(calls[1][0].getValue()).toBe(true);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
  describe('motion mixin', function () {
    it('should be exported',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var _ref9, calls;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return renderSass("\n@import './src/globals/scss/motion';\n\n$c: test(mixin-exists(motion));\n$c: test(mixin-exists(carbon--motion));\n");

            case 2:
              _ref9 = _context5.sent;
              calls = _ref9.calls; // Check that global-variable-exists returned true

              expect(calls[0][0].getValue()).toBe(true);
              expect(calls[1][0].getValue()).toBe(true);

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
  });
});
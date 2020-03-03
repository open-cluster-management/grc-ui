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
    global.breadcrumbConfig = mod.exports;
  }
})(this, function () {
  /**
   * Copyright IBM Corp. 2016, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  'use strict';

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

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var featureFlags = require('../../globals/js/feature-flags');

  var items = [{
    label: 'Breadcrumb 1'
  }, {
    label: 'Breadcrumb 2'
  }, {
    label: 'Breadcrumb 3'
  }];
  module.exports = {
    context: {
      featureFlags: featureFlags,
      prefix: prefix,
      items: items
    },
    variants: [{
      name: 'default',
      label: 'Breadcrumb',
      notes: "\n        Breadcrumb enables users to quickly see their location within a path of navigation\n        and move up to a parent level if desired.\n      "
    }, {
      name: 'current-page',
      label: 'with current page',
      context: {
        items: items.map(function (item, i) {
          if (i !== items.length - 1) {
            return item;
          }

          return _objectSpread({}, item, {
            current: true
          });
        })
      }
    }]
  };
});
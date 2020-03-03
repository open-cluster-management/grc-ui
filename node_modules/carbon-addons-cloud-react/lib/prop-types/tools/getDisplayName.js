'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var cachedDisplayNames = new WeakMap();

/**
 * `getDisplayName` is a utility function for getting a name from a given
 * component type. It supports names from React elements, Stateless Functional
 * Components, and Class-based Components
 */
var getDisplayName = function getDisplayName(type) {
  if (typeof type === 'string') {
    return type;
  }

  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  var displayName = void 0;

  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  }
  if (!displayName) {
    displayName = type.name || 'Unknown';
  }

  cachedDisplayNames.set(type, displayName);

  return displayName;
};

exports.default = getDisplayName;
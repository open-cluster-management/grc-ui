"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sliderValuePropSync = exports.componentsX = exports.breakingChangesX = void 0;

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file contains the list of the default values of compile-time feature flags.
 *
 * Build toolchain can replace variable here and/or the references
 * in order to apply non-default values to those feature flags.
 *
 * @example Render `foo` if `aFeatureFlag` is `true`, render `bar` otherwise.
 * import { aFeatureFlag } from '/path/to/FeatureFlags';
 * ...
 * const MyComponent = props => (<div {...props}>{aFeatureFlag ? 'foo' : 'bar'}</div>);
 */

/**
 * Breaking changes for next release.
 */
var breakingChangesX = false;
/**
 * Next gen of Carbon component design.
 */

exports.breakingChangesX = breakingChangesX;
var componentsX = false;
/**
 * Support for prop -> state sync of `<Slider>` value.
 */

exports.componentsX = componentsX;
var sliderValuePropSync = breakingChangesX;
exports.sliderValuePropSync = sliderValuePropSync;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ListBoxField from './ListBoxField';
import ListBoxMenu from './ListBoxMenu';
import { ListBoxType } from './ListBoxPropTypes';
import childrenOf from '../../prop-types/childrenOf';

var handleOnKeyDown = function handleOnKeyDown(event) {
  if (event.keyCode === 27) {
    event.stopPropagation();
  }
};

var handleClick = function handleClick(event) {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * `ListBox` is a generic container component that handles creating the
 * container class name in response to certain props.
 */
var ListBox = function ListBox(_ref) {
  var _cx;

  var ariaLabel = _ref.ariaLabel,
      children = _ref.children,
      containerClassName = _ref.className,
      disabled = _ref.disabled,
      innerRef = _ref.innerRef,
      type = _ref.type,
      invalid = _ref.invalid,
      invalidText = _ref.invalidText,
      light = _ref.light,
      rest = _objectWithoutProperties(_ref, ['ariaLabel', 'children', 'className', 'disabled', 'innerRef', 'type', 'invalid', 'invalidText', 'light']);

  var className = cx((_cx = {}, _defineProperty(_cx, containerClassName, !!containerClassName), _defineProperty(_cx, 'bx--list-box', true), _defineProperty(_cx, 'bx--list-box--inline', type === 'inline'), _defineProperty(_cx, 'bx--list-box--disabled', disabled), _defineProperty(_cx, 'bx--list-box--light', light), _cx));
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      _extends({}, rest, {
        role: 'listbox',
        'aria-label': ariaLabel,
        className: className,
        ref: innerRef,
        onKeyDown: handleOnKeyDown,
        onClick: handleClick,
        'data-invalid': invalid || undefined,
        'aria-invalid': invalid || undefined }),
      children
    ),
    invalid ? React.createElement(
      'div',
      { className: 'bx--form-requirement' },
      invalidText
    ) : null
  );
};

ListBox.propTypes = {
  children: childrenOf([ListBoxField, ListBoxMenu]),

  /**
   * Specify a class name to be applied on the containing list box node
   */
  className: PropTypes.string,

  /**
   * `innerRef` hook used for libraries like Downshift that require a reference
   * on a container node when it is not a native element
   */
  innerRef: PropTypes.func.isRequired,

  /**
   * Specify whether the ListBox is currently disabled
   */
  disabled: PropTypes.bool.isRequired,

  /**
   * Specify the "type" of the ListBox. Currently supports either `default` or
   * `inline` as an option.
   */
  type: ListBoxType.isRequired,

  /**
   * Specify the "aria-label" of the ListBox.
   */
  ariaLabel: PropTypes.string
};

ListBox.defaultProps = {
  innerRef: function innerRef() {},
  disabled: false,
  type: 'default',
  ariaLabel: 'Choose an item'
};

export default ListBox;
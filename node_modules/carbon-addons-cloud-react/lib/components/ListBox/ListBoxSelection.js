'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translationIds = undefined;

var _defaultTranslations;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _carbonIcons = require('carbon-icons');

var _carbonComponentsReact = require('carbon-components-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * `ListBoxSelection` is used to provide controls for clearing a selection, in
 * addition to conditionally rendering a badge if the control has more than one
 * selection.
 */
var ListBoxSelection = function ListBoxSelection(_ref) {
  var clearSelection = _ref.clearSelection,
      selectionCount = _ref.selectionCount,
      t = _ref.translateWithId;

  var className = (0, _classnames2.default)({
    'bx--list-box__selection': true,
    'bx--list-box__selection--multi': selectionCount
  });
  var handleOnClick = function handleOnClick(event) {
    // If we have a mult-select badge, clicking it shouldn't open the menu back
    // up. However, if we have a clear badge then we want the click to have this
    // behavior.
    if (selectionCount) {
      event.stopPropagation();
    }
    clearSelection(event);
  };
  var handleOnKeyDown = function handleOnKeyDown(event) {
    // When a user hits ENTER, we'll clear the selection
    if (event.keyCode === 13) {
      clearSelection(event);
    }
  };
  var description = selectionCount ? t('clear.all') : t('clear.selection');
  return _react2.default.createElement(
    'div',
    {
      role: 'button',
      className: className,
      tabIndex: '0',
      onClick: handleOnClick,
      onKeyDown: handleOnKeyDown,
      title: description },
    selectionCount,
    _react2.default.createElement(_carbonComponentsReact.Icon, {
      icon: _carbonIcons.iconClose,
      description: description,
      focusable: 'false',
      name: 'icon--close'
    })
  );
};

var translationIds = exports.translationIds = {
  'clear.all': 'clear.all',
  'clear.selection': 'clear.selection'
};

var defaultTranslations = (_defaultTranslations = {}, _defineProperty(_defaultTranslations, translationIds['clear.all'], 'Clear all selected items'), _defineProperty(_defaultTranslations, translationIds['clear.selection'], 'Clear selected item'), _defaultTranslations);

ListBoxSelection.propTypes = {
  /**
   * Specify a function to be invoked when a user interacts with the clear
   * selection element.
   */
  clearSelection: _propTypes2.default.func.isRequired,

  /**
   * Specify an optional `selectionCount` value that will be used to determine
   * whether the selection should display a badge or a single clear icon.
   */
  selectionCount: _propTypes2.default.number,

  /**
   * i18n hook used to provide the appropriate description for the given menu
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: _propTypes2.default.func.isRequired
};

ListBoxSelection.defaultProps = {
  translateWithId: function translateWithId(id) {
    return defaultTranslations[id];
  }
};

exports.default = ListBoxSelection;
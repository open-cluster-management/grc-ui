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

var translationIds = exports.translationIds = {
  'close.menu': 'close.menu',
  'open.menu': 'open.menu'
};

var defaultTranslations = (_defaultTranslations = {}, _defineProperty(_defaultTranslations, translationIds['close.menu'], 'Close menu'), _defineProperty(_defaultTranslations, translationIds['open.menu'], 'Open menu'), _defaultTranslations);

/**
 * `ListBoxMenuIcon` is used to orient the icon up or down depending on the
 * state of the menu for a given `ListBox`
 */
var ListBoxMenuIcon = function ListBoxMenuIcon(_ref) {
  var isOpen = _ref.isOpen,
      t = _ref.translateWithId;

  var className = (0, _classnames2.default)({
    'bx--list-box__menu-icon': true,
    'bx--list-box__menu-icon--open': isOpen
  });
  var description = isOpen ? t('close.menu') : t('open.menu');
  return _react2.default.createElement(
    'div',
    { className: className },
    _react2.default.createElement(_carbonComponentsReact.Icon, {
      icon: _carbonIcons.iconCaretDown,
      description: description,
      name: 'icon--caret--down',
      alt: description
    })
  );
};

ListBoxMenuIcon.propTypes = {
  /**
   * Specify whether the menu is currently open, which will influence the
   * direction of the menu icon
   */
  isOpen: _propTypes2.default.bool.isRequired,

  /**
   * i18n hook used to provide the appropriate description for the given menu
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: _propTypes2.default.func.isRequired
};

ListBoxMenuIcon.defaultProps = {
  translateWithId: function translateWithId(id) {
    return defaultTranslations[id];
  }
};

exports.default = ListBoxMenuIcon;
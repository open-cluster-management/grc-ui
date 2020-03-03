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
  'collapse.group': 'collapse.group',
  'expand.group': 'expand.group'
};

var defaultTranslations = (_defaultTranslations = {}, _defineProperty(_defaultTranslations, translationIds['collapse.group'], 'Collapse group'), _defineProperty(_defaultTranslations, translationIds['expand.group'], 'Expand group'), _defaultTranslations);

var CheckBoxIcon = function CheckBoxIcon(_ref) {
  var isExpanded = _ref.isExpanded,
      t = _ref.translateWithId;

  var className = (0, _classnames2.default)({
    'bx--list-box__menu-icon': true,
    'bx--list-box__menu-icon--open': isExpanded
  });
  var description = isExpanded ? t('collapse.group') : t('expand.group');
  return _react2.default.createElement(
    'div',
    { className: className, style: { marginRight: '-18px' } },
    _react2.default.createElement(_carbonComponentsReact.Icon, {
      icon: _carbonIcons.iconChevronDown,
      description: description,
      alt: description,
      name: 'icon--chevron--down'
    })
  );
};

CheckBoxIcon.propTypes = {
  /**
   * Specify whether the group is currently expanded, which will influence the
   * direction of the icon
   */
  isExpanded: _propTypes2.default.bool.isRequired,

  /**
   * i18n hook used to provide the appropriate description for the given
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: _propTypes2.default.func.isRequired
};

CheckBoxIcon.defaultProps = {
  translateWithId: function translateWithId(id) {
    return defaultTranslations[id];
  }
};

exports.default = CheckBoxIcon;
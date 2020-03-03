var _defaultTranslations;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { iconChevronDown } from 'carbon-icons';
import { Icon } from 'carbon-components-react';

export var translationIds = {
  'collapse.group': 'collapse.group',
  'expand.group': 'expand.group'
};

var defaultTranslations = (_defaultTranslations = {}, _defineProperty(_defaultTranslations, translationIds['collapse.group'], 'Collapse group'), _defineProperty(_defaultTranslations, translationIds['expand.group'], 'Expand group'), _defaultTranslations);

var CheckBoxIcon = function CheckBoxIcon(_ref) {
  var isExpanded = _ref.isExpanded,
      t = _ref.translateWithId;

  var className = cx({
    'bx--list-box__menu-icon': true,
    'bx--list-box__menu-icon--open': isExpanded
  });
  var description = isExpanded ? t('collapse.group') : t('expand.group');
  return React.createElement(
    'div',
    { className: className, style: { marginRight: '-18px' } },
    React.createElement(Icon, {
      icon: iconChevronDown,
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
  isExpanded: PropTypes.bool.isRequired,

  /**
   * i18n hook used to provide the appropriate description for the given
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: PropTypes.func.isRequired
};

CheckBoxIcon.defaultProps = {
  translateWithId: function translateWithId(id) {
    return defaultTranslations[id];
  }
};

export default CheckBoxIcon;
function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'carbon-components-react';

var _ref = React.createElement(
  'svg',
  {
    className: 'bx--resource-header__button--icon',
    width: '20',
    height: '24',
    viewBox: '0 0 20 24',
    fillRule: 'evenodd' },
  React.createElement('path', { d: 'M12.2 4.6L12 4V0H8v4l-.2.6C3.4 5.6.2 9.5.2 14.2.2 19.7 4.6 24 10 24s9.8-4.4 9.8-9.8c0-4.7-3.3-8.6-7.6-9.6zM10 21.8c-4.3 0-7.6-3.4-7.6-7.6 0-3.5 2.2-6.3 5.5-7.3L8 7v7h4V7l.2-.1c3.3 1 5.5 3.8 5.5 7.3-.1 4.2-3.4 7.6-7.7 7.6z' })
);

var _ref2 = React.createElement(
  'svg',
  { className: 'bx--resource-header__button--icon', width: '16', height: '16' },
  React.createElement('path', { d: 'M0 0h16v2H0z' }),
  React.createElement('path', { d: 'M10.5 7.5c-.3.3-.7.3-1 0-.3-.3-.3-.7 0-1l1.3-1.3c-.4-.1-.7-.2-1.1-.2-1.2 0-2.2 1-2.2 2.3 0 .2 0 .4.1.6l-3.3 3.3c-.4.4-.4 1.1 0 1.5.4.4 1.1.4 1.5 0l3.3-3.3c.2.1.4.1.6.1 1.2 0 2.3-1 2.3-2.3 0-.4-.1-.7-.2-1l-1.3 1.3z' }),
  React.createElement('path', { d: 'M14 4v10H2V4h12m2-2H0v14h16V2z' })
);

function renderActionButtons(type, onClick) {
  var reboot = _ref;

  var maintenance = _ref2;

  var svg = void 0;
  if (type === 'Stop') {
    svg = stop;
    return React.createElement(
      Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        small: true,
        icon: 'stop--glyph',
        kind: 'ghost' },
      type
    );
  } else if (type === 'Reboot') {
    svg = reboot;
    return React.createElement(
      Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        icon: 'power--glyph',
        small: true,
        kind: 'ghost' },
      type
    );
  } else if (type === 'Maintenance') {
    svg = maintenance;
    return React.createElement(
      Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        small: true,
        kind: 'ghost' },
      type,
      svg
    );
  }
}

var _ref3 = React.createElement(
  'div',
  { className: 'bx--resource-header__status-item bx--resource-header__status-item--active' },
  'Active'
);

function renderTitleStatus() {
  return _ref3;
}

function renderStatus(status) {
  return status.map(function (item, i) {
    var statusClasses = classNames({
      'bx--resource-header__status-item--active': item.isTrue
    }, 'bx--resource-header__status-item');

    return React.createElement(
      'div',
      { key: i, className: statusClasses },
      item.text
    );
  });
}

var _ref5 = React.createElement(
  'div',
  { className: 'bx--resource-header__status-item bx--resource-header__status-item--active' },
  'Active'
);

var ResourceHeader = function ResourceHeader(_ref4) {
  var className = _ref4.className,
      icon = _ref4.icon,
      isActive = _ref4.isActive,
      renderActions = _ref4.renderActions,
      renderBreadcrumbs = _ref4.renderBreadcrumbs,
      renderMaintenance = _ref4.renderMaintenance,
      renderReboot = _ref4.renderReboot,
      renderStop = _ref4.renderStop,
      status = _ref4.status,
      subtitle = _ref4.subtitle,
      title = _ref4.title,
      other = _objectWithoutProperties(_ref4, ['className', 'icon', 'isActive', 'renderActions', 'renderBreadcrumbs', 'renderMaintenance', 'renderReboot', 'renderStop', 'status', 'subtitle', 'title']);

  var resourceHeaderClasses = classNames('bx--resource-header', className);

  return React.createElement(
    'header',
    { className: resourceHeaderClasses },
    React.createElement(
      'section',
      { className: 'bx--resource-header__container' },
      React.createElement(
        'div',
        { className: 'bx--resource-header__container--left' },
        renderBreadcrumbs && renderBreadcrumbs(),
        React.createElement(
          'div',
          { className: 'bx--resource-header__content-container' },
          icon && React.createElement(
            'div',
            { className: 'bx--resource-header__icon' },
            icon
          ),
          React.createElement(
            'div',
            { className: 'bx--resource-header__content' },
            title && React.createElement(
              'div',
              { className: 'bx--resource-header__title' },
              React.createElement(
                'h3',
                null,
                title
              ),
              isActive && _ref5
            ),
            React.createElement(
              'div',
              { className: 'bx--resource-header__subtitle' },
              subtitle && subtitle.map(function (item, key) {
                return React.createElement(
                  'span',
                  { key: key },
                  item,
                  ' \xA0'
                );
              })
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'bx--resource-header__container--right' },
        React.createElement(
          'div',
          { className: 'bx--resource-header__status' },
          status && renderStatus(status)
        ),
        React.createElement(
          'div',
          { className: 'bx--resource-header__actions' },
          renderStop && renderActionButtons('Stop', renderStop),
          renderReboot && renderActionButtons('Reboot', renderReboot),
          renderMaintenance && renderActionButtons('Maintenance', renderMaintenance),
          renderActions && renderActions()
        )
      )
    )
  );
};

ResourceHeader.propTypes = {
  /**
   * The CSS class names of the resource header
   */
  className: PropTypes.string,
  /**
   * The icon to be rendered in the header.
   */
  icon: PropTypes.node,
  /**
   * `true` to show the status text next to the resource header title.
   */
  isActive: PropTypes.bool,
  /**
   * The function used to create and show an action dropdown.
   */
  renderActions: PropTypes.func,
  /**
   * The function used to create and show breadcrumbs.
   */
  renderBreadcrumbs: PropTypes.func,
  /**
   * The function used to show and attach actions to the maintenance icon
   */
  renderMaintenance: PropTypes.func,
  /**
   * The function used to show and attach actions to the reboot icon
   */
  renderReboot: PropTypes.func,
  /**
   * The function used to show and attach actions to the stop icon
   */
  renderStop: PropTypes.func,
  /**
   * The array used to show status text above the action icons
   */
  status: PropTypes.array,
  /**
   * The array used to show subtitle text below the resource header title
   */
  subtitle: PropTypes.array,
  /**
   * The title of the resource header
   */
  title: PropTypes.string
};

export default ResourceHeader;
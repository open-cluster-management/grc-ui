/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import { renderAnsibleHistory } from './AnsibleHistory'
import { renderAnsibleCredentialsSelection } from './AnsibleCredentialsSelection'

import '../../../scss/ansible-modal.scss'

export const renderAnsiblePanelContent = ({
  data, activeItem, locale, handleTabClick,
  credentialName, credentialIsOpen,
  setCredentialsSelectionValue, onCredentialsSelectionToggle,
  renderAnsibleJobTemplatesSelection, getAnsibleConnection,
}) => {
  return <React.Fragment>
    <Tabs className='ansible-switch' isFilled activeKey={activeItem} onSelect={handleTabClick}>
        <Tab
          eventKey={0}
          title={<TabTitleText>{msgs.get('table.actions.automation.configure', locale)}</TabTitleText>}
        >
        {data &&
        <div className='ansible-configure-table'>
          {renderAnsibleCredentialsSelection({
            data, locale, credentialName, credentialIsOpen,
            setCredentialsSelectionValue, onCredentialsSelectionToggle,
            renderAnsibleJobTemplatesSelection, getAnsibleConnection,
          })}
        </div>}
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>{msgs.get('table.actions.automation.history', locale)}</TabTitleText>}
        >
        {data &&
          <div className='ansible-history-table'>
            {renderAnsibleHistory(data, locale)}
          </div>
        }
        </Tab>
    </Tabs>
  </React.Fragment>
}

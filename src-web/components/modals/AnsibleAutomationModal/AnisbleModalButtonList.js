/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { AcmButton } from '@open-cluster-management/ui-components'
import { ButtonVariant } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'

export const buildModalButtonList = ({
    activeItem, opInstalled, policyAutoName, locale,
    handleSubmitClick, handleCloseClick, handleOpenDelModal
}) => {
    const actions = []
    if (!activeItem && opInstalled) {
      actions.push(
        <AcmButton
          key="confirm"
          variant={ButtonVariant.primary}
          onClick={handleSubmitClick}
        >
            {msgs.get('modal.button.save', locale)}
        </AcmButton>
      )
      actions.push(
        <AcmButton
          key="cancel"
          variant={ButtonVariant.secondary}
          onClick={handleCloseClick}
        >
            {msgs.get('modal.button.cancel', locale)}
        </AcmButton>
      )
      if (policyAutoName) {
        actions.push(
          <AcmButton
          key="delete"
          variant={ButtonVariant.danger}
          onClick={handleOpenDelModal}
          >
            {msgs.get('modal.button.delete', locale)}
          </AcmButton>
        )
      }
    }
    return actions
  }


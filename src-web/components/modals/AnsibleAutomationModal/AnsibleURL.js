/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import {
  AcmLaunchLink, AcmIcon, AcmIconVariant
} from '@open-cluster-management/ui-components'
import TruncateText from '../../common/TruncateText'

import '../../../scss/ansible-modal.scss'

export const renderAnsibleURL = (id, text, URL, truncateLength) => {
  if (!text || text !== '-') {
    let linkText = text
    if (truncateLength) {
      linkText = <TruncateText maxCharacters={truncateLength} text={linkText} />
    }
    const link = {
      id,
      text: linkText,
      href: URL,
      noIcon: false,
      icon: <AcmIcon icon={AcmIconVariant.openNewTab} />
    }
    return <AcmLaunchLink links={[link]} />
  } else {
    return text
  }
}

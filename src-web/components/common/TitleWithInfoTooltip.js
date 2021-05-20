/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Title } from '@patternfly/react-core'
import createInfoTooltip from './InfoTooltip'

const renderTitleWithTooltip = (title, toolTipContent, className, headingLevel, position) => {
  return <div className={className}>
      <Title headingLevel={headingLevel}>
        {title}
      </Title>
      {createInfoTooltip(toolTipContent, position)}
    </div>
}

export default renderTitleWithTooltip

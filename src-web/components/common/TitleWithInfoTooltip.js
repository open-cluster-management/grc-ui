/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Title } from '@patternfly/react-core'
import { GrayOutlinedQuestionCircleIcon } from '../common/Icons'

const renderTitleWithTooltip = (title, toolTipContent, className, headingLevel, position) => {
  return <div className={className}>
      <Title headingLevel={headingLevel}>
        {title}
      </Title>
      {GrayOutlinedQuestionCircleIcon(toolTipContent, position)}
    </div>
}

export default renderTitleWithTooltip

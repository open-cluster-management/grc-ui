/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Tooltip } from '@patternfly/react-core'
import config from '../../../server/lib/shared/config'
// import OutlinedQuestionCircleIcon from '@patternfly/react-icons'

const createInfoTooltip = (content, position) => <Tooltip
    position={position}
    content={content}
    key={'info-tooltip'}
  >
    <span>
      {/* <OutlinedQuestionCircleIcon /> */}
      <img
        src={`${config.contextPath}/graphics/fa-question-circle.svg`}
        alt={''}
      />
    </span>
  </Tooltip>

export default createInfoTooltip

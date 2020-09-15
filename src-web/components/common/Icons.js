/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons'
import dangerColor from '@patternfly/react-tokens/dist/js/global_danger_color_100'
import okColor from '@patternfly/react-tokens/dist/js/global_palette_green_500'
import warningColor from '@patternfly/react-tokens/dist/js/global_warning_color_100'

export const GreenCheckCircleIcon = () => {
  return <CheckCircleIcon color={okColor.value} />
}

export const RedExclamationCircleIcon = () => {
  return <ExclamationCircleIcon color={dangerColor.value} />
}

export const YellowExclamationTriangleIcon = () => {
  return  <ExclamationTriangleIcon color={warningColor.value} />
}

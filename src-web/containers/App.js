/* Copyright (c) 2021 Red Hat, Inc. */
'use strict'

import React from 'react'
import { Route } from 'react-router-dom'
import loadable from '@loadable/component'
import config from '../../lib/shared/config'
import resources from '../../lib/shared/resources'
resources(() => {
  require('../../scss/common.scss')
})

const GrcApp = loadable(() => import(/* webpackChunkName: "GrcApp" */ './GrcApp.js'))

export const App = () => (
  <Route path={config.contextPath} component={GrcApp} />
)

/* eslint-disable no-unused-vars */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

const thunkMiddleware = require('redux-thunk').default,
      redux = require('redux'),
      express = require('express'),
      context = require('../../lib/shared/context'),
      msgs = require('../../nls/platform.properties'),
      config = require('../../config'),
      appUtil = require('../../lib/server/app-util'),
      router = express.Router({ mergeParams: true }),
      request = require('../../lib/server/request')

import _ from 'lodash'

let App, Login, reducers, access  //laziy initialize to reduce startup time seen on k8s

const targetAPIGroups = [
  'policy.open-cluster-management.io',
  'apps.open-cluster-management.io',
]

router.get('*', (req, res) => {
  reducers = reducers === undefined ? require('../../src-web/reducers') : reducers

  const store = redux.createStore(redux.combineReducers(reducers), redux.applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
  ))

  const ctx = getContext(req)
      return res.render('home', Object.assign({
        manifest: appUtil.app().locals.manifest,
        contextPath: config.get('contextPath'),
        state: store.getState(),
        props: ctx,
      }, ctx))
})

function getContext(req) {
  const reqContext = context(req)
  return {
    title: msgs.get('common.app.name', reqContext.locale),
    context: reqContext,
    xsrfToken: req.csrfToken(),
  }
}

module.exports = router

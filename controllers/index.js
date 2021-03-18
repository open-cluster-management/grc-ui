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
const express = require('express'),
      router = express.Router(),
      config = require('../config'),
      security = require('@open-cluster-management/security-middleware'),
      oauth = require('./oauth-info'),
      user = require('./userinfo'),
      version = require('./acmversion')

//controllers
const status = require('./status'),
      ui = require('./ui')

router.all(['/', '/status', '/livenessProbe', '/readinessProbe'], status)
router.get('/multicloud/logout', security.logout)
router.get('/multicloud/common/configure', oauth.oauthInfo)
router.get('/multicloud/common/username', user.userInfo)
router.get('/multicloud/common/version', version.version)
router.use('/multicloud/welcome', ui)
router.use(config.get('contextPath'), ui)

module.exports = router

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'
const express = require('express'),
      router = express.Router(),
      config = require('../config'),
      securityMW = require('security-middleware')


//controllers
const status = require('./status'),
      ui = require('./ui')

router.all(['/', '/status', '/livenessProbe', '/readinessProbe'], status)
router.use(config.get('contextPath'), ui)
router.get('/logout', securityMW.logout)

module.exports = router

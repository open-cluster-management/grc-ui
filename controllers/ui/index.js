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
      app = require('./app'),
      inspect = require('@stolostron/security-middleware')

router.all(['/', '/*'], inspect.ui(), app)

module.exports = router

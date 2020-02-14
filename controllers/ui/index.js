/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    baseconfig = require('../../config/auth-config'),
    app = require('./app'),
    passport = require('passport'),
    securityMW = require('security-middleware')

securityMW.initializePassport(passport)

router.use(session({ secret: baseconfig.ocp.oauth2_clientsecret, resave: true, saveUninitialized: true  }))
router.use(bodyParser.urlencoded({ extended: false }))
router.use(passport.initialize())
router.use(passport.session())

router.get('/auth/login', securityMW.auth(passport))

router.get('/auth/callback', securityMW.auth(passport), securityMW.callback)

router.get('/logout', securityMW.logout)

router.all(['/', '/*'], securityMW.validate, app)

module.exports = router

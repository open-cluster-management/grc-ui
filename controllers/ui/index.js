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
    app = require('./app'),
    passport = require('passport'),
    config = require('../../config'),
    securityMW = require('security-middleware')

securityMW.initializePassport(passport, `${config.get('contextPath')}/policies`)

router.use(session({ secret: 'grc-ui', resave: true, saveUninitialized: false  }))
router.use(bodyParser.urlencoded({ extended: false }))
router.use(passport.initialize())
router.use(passport.session())

router.get('/policies/auth/login', securityMW.auth0(passport))

router.get('/policies/auth/callback', securityMW.auth(passport), securityMW.callback)

router.get('/policies/logout', securityMW.logout)

router.all(['/', '/*'], securityMW.validate, app)

module.exports = router

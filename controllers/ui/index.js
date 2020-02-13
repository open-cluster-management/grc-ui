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
    log4js = require('log4js'),
    logger = log4js.getLogger('server'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    baseconfig = require('../../config/auth-config'),
    app = require('./app'),
    passport = require('passport'),
    securityMW = require('../../auth-mw/inspect')

var log4js_config = process.env.LOG4JS_CONFIG ? JSON.parse(process.env.LOG4JS_CONFIG) : undefined
log4js.configure(log4js_config || 'config/log4js.json')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

securityMW.initializePassport(passport)

router.use(session({ secret: baseconfig.ocp.oauth2_clientsecret }))
router.use(bodyParser.urlencoded({ extended: false }))
router.use(passport.initialize())
router.use(passport.session())

router.get('/auth/login', securityMW.login(passport))

// Callback service parsing the authorization token and asking for the access token
router.get('/auth/callback', securityMW.callback(passport))

router.get('/login', (req, res) => {
  logger.info('redirecting to login..')
  res.redirect('/multicloud/auth/login')
})

router.get('/logout', securityMW.logout)

router.all(['/', '/*'], securityMW.validate, app)

module.exports = router

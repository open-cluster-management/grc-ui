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
    logger = log4js.getLogger('server')

//controllers
//var app = require('./app')

var log4js_config = process.env.LOG4JS_CONFIG ? JSON.parse(process.env.LOG4JS_CONFIG) : undefined
log4js.configure(log4js_config || 'config/log4js.json')

var config = require('../../config/auth-config.js')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

logger.info(config.ocp.serviceaccount_token)
logger.info(config.ocp.apiserver_url)

//token review api to validate Bearer token/ retrieve user info
const request = require('request').defaults({ rejectUnauthorized: false })
const options = {
  url: `${config.ocp.apiserver_url}/apis/authentication.k8s.io/v1/tokenreviews`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${config.ocp.serviceaccount_token}`
  },
  json: true,
  body: {
    'apiVersion': 'authentication.k8s.io/v1',
    'kind': 'TokenReview',
    'spec': {
      'token': config.ocp.serviceaccount_token
    }
  }
}

// passport for oauth2
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')

const callbackUrl = `${config.ocp.app_host}/multicloud/auth/callback`
logger.info('callback url: ' + callbackUrl)

passport.use(new OAuth2Strategy({
  //state: true,
  authorizationURL: `${config.ocp.oauth2_host}${config.ocp.oauth2_authorizepath}`,
  tokenURL: `${config.ocp.oauth2_host}${config.ocp.oauth2_tokenpath}`,
  clientID: config.ocp.oauth2_clientid,
  clientSecret: config.ocp.oauth2_clientsecret,
  callbackURL: callbackUrl,
  scope: 'user:full',
},
async (accessToken, refreshToken, profile, cb) => {
  logger.info('accessToken',accessToken)
  options.body.spec.token=accessToken

  //retrieving user info through token review api
  request.post(options, (err, resp2, reviewbody) => {
    if (err) {
      return cb(err)
    }
    return cb(null, reviewbody.status.user)
  })
}
))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

router.use(passport.initialize())

//router.all(['/', '/*'], inspect.ui, app)

/* GET home page. */
router.get('/auth/login', (passport.authenticate('oauth2')))

// Callback service parsing the authorization token and asking for the access token
router.get('/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/multicloud/login' }),
  (req, res) => {
    logger.info('in callback!')
    // Successful authentication, redirect home.
    return res.redirect('/multicloud/')
  })
//router.get('/auth/callback', (passport.authenticate('oauth2', {successRedirect: '/dashboard', failureRedirect: '/login'})))


router.get('/login', (req, res) => {
  logger.info('redirecting to login..')
  res.redirect('/multicloud/auth/login')
})

/* GET home page. */
router.get('/',  (req, res) => {
  logger.info('redirect to auth login.. ' + config.ocp.app_host + '/multicloud/auth/login')
  res.redirect('/multicloud/auth/login')
})

/* GET home page. */
router.get('/dashboard/*',  (req, res) => {
  const username = req.params[0]
  logger.info('dashboard user :', username)
  res.render('index', { username: username })
})

// router.use(csrf) TODO: Revisit csrf

module.exports = router

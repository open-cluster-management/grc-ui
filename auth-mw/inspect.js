'use strict'

var log4js = require('log4js'),
    logger = log4js.getLogger('server'),
    configjs = require('./config/init-auth-config.js'),
    OAuth2Strategy = require('passport-oauth2'),
    inspectClient = require('./inspect-client')

var log4js_config = process.env.LOG4JS_CONFIG ? JSON.parse(process.env.LOG4JS_CONFIG) : undefined
log4js.configure(log4js_config || 'config/log4js.json')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

module.exports.initializePassport = (passport) => {
  configjs.initialize((err, config) => {

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

    const callbackUrl = `${config.ocp.oauth2_redirecturl}`

    passport.use(new OAuth2Strategy({
      //state: true,
      authorizationURL: `${config.ocp.oauth2_authorizepath}`,
      tokenURL: `${config.ocp.oauth2_tokenpath}`,
      clientID: config.ocp.oauth2_clientid,
      clientSecret: config.ocp.oauth2_clientsecret,
      callbackURL: callbackUrl,
      scope: 'user:full',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      options.body.spec.token=accessToken

      //retrieving user info through token review api
      request.post(options, (err, resp2, reviewbody) => {
        if (err) {
          return cb(err)
        }
        if (reviewbody.status && reviewbody.status.user){
          reviewbody.status.user.token = accessToken
          return cb(null, reviewbody.status.user)
        }
        return cb(new Error('Server Error'))
      })
    }
    ))

    passport.serializeUser((user, done) => {
      done(null, user)
    })

    passport.deserializeUser((user, done) => {
      done(null, user)
    })
  })
}

module.exports.login = (passport) => {
  passport.authenticate('oauth2')
}

module.exports.callback = (passport) => {
  passport.authenticate('oauth2', { failureRedirect: '/multicloud/login' }),
  (req, res) => {
    res.cookie('acm-access-token-cookie', req.session.passport.user.token)
    req.user = req.session.passport.user
    const redirectURL = req.cookies.redirectURL == '' ? '/multicloud/welcome' : req.cookies.redirectURL
    res.clearCookie('redirectURL')
    res.redirect(redirectURL)
  }
}

module.exports.validate = (req, res, next) => {
  if ((!req.session.passport || !req.session.passport.user) && !req.cookies['acm-access-token-cookie']) {
    res.cookie('redirectURL', req.originalUrl)
    res.redirect('/multicloud/auth/login')
  } else {
    //cookie exists, need to validate before proceeding
    const token = req.cookies['acm-access-token-cookie'] || req.session.passport.user.token
    inspectClient.inspect(req, token, (err, response, body) => {
      if (err) {
        return res.status(500).send(err.details)
      } else if (body && body.status && body.status.user && response.statusCode == 201) {
        req.user = body.status.user
        logger.info('Security middleware check passed')
        return next()
      }
      logger.info('Security middleware check failed; redirecting to login')
      res.redirect('/multicloud/auth/login')
    })
  }
}

module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return logger.error(err)
    }
    res.clearCookie('connect.sid')
    res.redirect('/multicloud/login')
  })
}



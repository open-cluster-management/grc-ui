/* Copyright (c) 2020 Red Hat, Inc. */
const request = require('request').defaults({ rejectUnauthorized: false }),
      config = require('../../config'),
      fs = require('fs'),
      log4js = require('log4js'),
      logger = log4js.getLogger('service-account'),
      serviceAccountPath = '/var/run/secrets/kubernetes.io/serviceaccount'

const kversionCB = (err, body, cb) => {
    let serviceaccountToken = null
    try {
      if(process.env.NODE_ENV === 'production'){
        serviceaccountToken = fs.readFileSync(`${serviceAccountPath}/token`, 'utf8')
      } else {
        serviceaccountToken = process.env.SERVICEACCT_TOKEN || ''
      }
    } catch (err) {
      logger.error('Error reading service account token', err && err.message)
    }
    if (body['token_endpoint']) {
        const options = {
            url: `${body['token_endpoint']}/api/kubernetes/version`,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${serviceaccountToken}`,
            },
            json: true,
          }
        request.get(options, (err, response, body) => {
            if (err) {
                console.log('error')
                console.log(err)
                logger.error(body['token_endpoint'])
                logger.error('Error hitting ocp', err && err.message)
              return cb(err)
            }
            if (response.statusCode === 200 && body) {
                return cb(null, body)
            }
          })
      }
}

module.exports.getKubeVersion = (req, cb) => {
  let serviceaccountToken = null
  try {
    if(process.env.NODE_ENV === 'production'){
      serviceaccountToken = fs.readFileSync(`${serviceAccountPath}/token`, 'utf8')
    } else {
      serviceaccountToken = process.env.SERVICEACCT_TOKEN || ''
    }
  } catch (err) {
    logger.error('Error reading service account token', err && err.message)
  }

  // for both running local and inside cluster, the below endpoint can be used to
  // get the oauth2 server and authorizepath  and tokenpath endpoints.
  const options = {
    url: `${config.get('API_SERVER_URL')}/.well-known/oauth-authorization-server`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${serviceaccountToken}`,
    },
    json: true,
  }

  request.get(options, (err, response, body) => {
    if (err) {
        console.log('error')
        console.log(err)
        logger.error('Error getting token', err && err.message)
      return cb(err)
    }
    if (response.statusCode === 200 && body) {
        return kversionCB(null, body, cb)
    }
    return cb(new Error(`Server Error: ${response.statusCode}`))
  })
}

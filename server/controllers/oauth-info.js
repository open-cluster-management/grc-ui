/* Copyright (c) 2021 Red Hat, Inc. */

const oauthInfoClient = require('../lib/server/oauth-info-client')

module.exports.oauthInfo = (req, res) => {
  oauthInfoClient.getOauthInfo(req, (err, response) => {
    if(err) {
      return res.status(500).send(err)
    }
    return res.status(200).json({ token_endpoint: response['token_endpoint'] })
  })
}

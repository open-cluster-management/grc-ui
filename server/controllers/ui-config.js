/* Copyright (c) 2021 Red Hat, Inc. */

const uiConfigClient = require('../lib/server/ui-config')

module.exports.uiConfig = (req, res) => {
  uiConfigClient.getUIConfig(req, (err, response) => {
    if(err) {
      return res.status(500).send(err)
    }
    return res.status(200).json({ data: response })
  })
}

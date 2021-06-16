/* Copyright (c) 2021 Red Hat, Inc. */

const linksClient = require('../lib/server/console-links')

module.exports.consoleLinks = (req, res) => {
  linksClient.getConsoleLinks(req, (err, response) => {
    if(err) {
      return res.status(500).send(err)
    }
    return res.status(200).json({ data: response })
  })
}

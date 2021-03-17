/* Copyright (c) 2021 Red Hat, Inc. */

const kubeversionClient = require('../lib/server/kubeversion')

module.exports.version = (req, res) => {
  kubeversionClient.getKubeVersion(req, (err, response) => {
    if(err) {
        console.log('---- error in client -----')
        console.log(err)
      return res.status(500).send(err)
    }
    return res.status(200).json({ gitVersion: response['gitVersion'] })
  })
}

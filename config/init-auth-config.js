var oauthserver = require('./oauthserver')
var config  = require('./auth-config')

module.exports.initialize = (cb) => {
  // eslint-disable-next-line no-console
  console.log(config)
  oauthserver.info((err, authserverinfo) => {
    if (err) {
      return cb(err)
    }
    config.ocp.oauth2_tokenpath = authserverinfo.token_endpoint
    config.ocp.oauth2_authorizepath = authserverinfo.authorization_endpoint

    return cb(null,config)
  })
}

// var config = {}

// config.ocp = {}

// config.ocp.oauth2_host=process.env.OAUTH2_HOST
// config.ocp.oauth2_tokenpath='/oauth/token'
// config.ocp.oauth2_authorizepath='/oauth/authorize'
// config.ocp.oauth2_clientid=process.env.OAUTH2_CLIENT_ID
// config.ocp.oauth2_clientsecret=process.env.OAUTH2_CLIENT_SECRET

// //for testing
// config.ocp.app_host = 'https://localhost:3000'
// config.ocp.apiserver_url='https://api.straits.os.fyre.ibm.com:6443'
// config.ocp.serviceaccount_token=process.env.SERVICEACCT_TOKEN
// config.ocp.user_token=process.env.SERVICEACCT_TOKEN

// //for production
// //config.ocp.app_host = 'http://icp-console.apps.straits.os.fyre.ibm.com'
// //config.ocp.apiserver_url='https://kubernetes.default'
// //config.ocp.serviceaccount_tokenpath='/var/run/secrets/kubernetes.io/serviceaccount/token'
// //config.ocp.user_token='yZUy3FTY3fqc1Grw5ub7kemGCnGsXThv0dsT_YJzfWA'

// module.exports = config

var fs = require('fs')

const config = {}
config.ocp = {}

config.ocp.oauth2_clientid= process.env.OAUTH2_CLIENT_ID
config.ocp.oauth2_clientsecret= process.env.OAUTH2_CLIENT_SECRET
config.ocp.oauth2_redirecturl = process.env.OAUTH2_REDIRECT_URL

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('in dev if branch')
  config.ocp.apiserver_url=process.env.API_SERVER_URL
  config.ocp.serviceaccount_token=process.env.SERVICEACCT_TOKEN
} else {
  // SERVICE ACCOUNT TOKEN needed to review user token
  config.ocp.apiserver_url='https://kubernetes.default.svc'
  config.ocp.serviceaccount_token =  fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token').toString()
}

module.exports = config

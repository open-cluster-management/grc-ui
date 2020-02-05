var config = {}

config.ocp = {}

config.ocp.oauth2_host=process.env.OAUTH2_HOST
config.ocp.oauth2_tokenpath='/oauth/token'
config.ocp.oauth2_authorizepath='/oauth/authorize'
config.ocp.oauth2_clientid=process.env.OAUTH2_CLIENT_ID
config.ocp.oauth2_clientsecret=process.env.OAUTH2_CLIENT_SECRET

//config.ocp.apiserver_url='https://kubernetes.default'
//config.ocp.serviceaccount_tokenpath='/var/run/secrets/kubernetes.io/serviceaccount/token'
config.ocp.grc_ui_app_host = 'http://icp-console.apps.straits.os.fyre.ibm.com'


config.ocp.apiserver_url='https://api.straits.os.fyre.ibm.com:6443'

//TODO : should be obtained from the service token, not set
config.ocp.serviceaccount_token='yZUy3FTY3fqc1Grw5ub7kemGCnGsXThv0dsT_YJzfWA'
//TODO : some user token to validate/review
config.ocp.user_token='yZUy3FTY3fqc1Grw5ub7kemGCnGsXThv0dsT_YJzfWA'

module.exports = config

config.ocp.app_host = 'http://localhost:3000'

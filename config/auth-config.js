var config = {}

config.ocp = {}

config.ocp.oauth2_host=process.env.OAUTH2_HOST
config.ocp.oauth2_tokenpath='/oauth/token'
config.ocp.oauth2_authorizepath='/oauth/authorize'
config.ocp.oauth2_clientid=process.env.OAUTH2_CLIENT_ID
config.ocp.oauth2_clientsecret=process.env.OAUTH2_CLIENT_SECRET

config.ocp.apiserver_url='https://kubernetes.default'
config.ocp.serviceaccount_tokenpath='/var/run/secrets/kubernetes.io/serviceaccount/token'
config.ocp.grc_ui_app_host = 'http://sample-webui-app-default.apps.cktestenv2.os.fyre.ibm.com'


//config.ocp.apiserver_url='https://api.scuzzy.os.fyre.ibm.com:6443'

//TODO : should be obtained from the service token, not set
config.ocp.serviceaccount_token='eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJzZXJ2aWNlcyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZWZhdWx0LXRva2VuLW1yZjJsIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlZmF1bHQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI5M2Y4ZjQ4ZS0xNzc1LTExZWEtOTI1NS0wMDAwMGExMDEyOWQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6c2VydmljZXM6ZGVmYXVsdCJ9.L8O5OZoZpwON5gcOJ-jUTRKI7A-bUK0XlGDFnA459urwqhBzCOJiXk21cmrAMJ97hIHeFCLtWvstMKEaKX5dislL0C6m2ElOUxA1kZPKF3aqcsz50vVUZAjxzlyq31ok7Oj7_6MNEgc8bKJE2jOp64UgCOth3bwLnXCtehupSKt5TRX5h1TPWQspdWvU-MK9IaYt5puy4Y05UxcvlzMmrCv24Zm15dFVeg3Wvu3p3uPmAm6H2Y8omZa4W9W4NQvqP5HoJxATkKXO3ujM_ujyg2FFmDlhm18WH4NwOLSZvUzQlByY_JpOZJwS6HBSfVq_BzGUxwVoe80a3QsVYpd2sg'
//TODO : some user token to validate/review
config.ocp.user_token='9brCoKDA33Gqr6v2DsFiNyUGHprCtIVZahsUNp7V8Mw'

module.exports = config

config.ocp.app_host = 'http://localhost:3000/'

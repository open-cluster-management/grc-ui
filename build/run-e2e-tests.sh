#!/bin/bash
docker network create --subnet 10.10.0.0/16 test-network
docker pull quay.io/open-cluster-management/grc-ui:3.6.0-PR36-fcc3b830b0c0cf89cb26f5d04da254aca2261c10
docker pull quay.io/open-cluster-management/grc-ui-api:3.6.0-PR10-0f126ba12cb0b059f37b54e418225fa0e27ffd5d
export SELENIUM_USER=$OC_CLUSTER_USER
export SELENIUM_PASSWORD=$OC_CLUSTER_PASS
echo ${OC}
# $(OC) whoami --show-token
# export SERVICEACCT_TOKEN="$(/home/travis/build/open-cluster-management/grc-ui/build-harness/vendor/oc whoami --show-token)"
# $(OC) whoami --show-token | (read token; export SERVICEACCT_TOKEN=$token;)
export SERVICEACCT_TOKEN=`${OC} whoami --show-token`
echo $SERVICEACCT_TOKEN
docker run --network test-network -d -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e API_SERVER_URL=https://api.chocolate.dev08.red-chesterfield.com:6443 --name grcuiapi --ip 10.10.0.5 -t -i -p 4000:4000 quay.io/open-cluster-management/grc-ui-api:3.6.0-PR10-0f126ba12cb0b059f37b54e418225fa0e27ffd5d
docker run --network test-network --ip 10.10.0.6 -d -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e headerUrl=$headerUrl -e OAUTH2_REDIRECT_URL=$OAUTH2_REDIRECT_URL -e grcUiApiUrl=https://10.10.0.5:4000/grcuiapi -e OAUTH2_CLIENT_ID=$OAUTH2_CLIENT_ID -e OAUTH2_CLIENT_SECRET=$OAUTH2_CLIENT_SECRET -e API_SERVER_URL=$API_SERVER_URL --name grcui -t -i -p 3000:3000 quay.io/open-cluster-management/grc-ui:3.6.0-PR36-fcc3b830b0c0cf89cb26f5d04da254aca2261c10
docker container ls -a
npm run test:e2e-headless
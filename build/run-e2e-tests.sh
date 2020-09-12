#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2020. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.
# Copyright (c) 2020 Red Hat, Inc.
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

$DIR/install-cert-manager.sh $OC_MANAGED_CLUSTER_URL kubeadmin $OC_MANAGED_CLUSTER_PASS

echo "Login hub again"
export OC_CLUSTER_URL=$OC_HUB_CLUSTER_URL
export OC_CLUSTER_PASS=$OC_HUB_CLUSTER_PASS
make oc/login
export SERVICEACCT_TOKEN=`${BUILD_HARNESS_PATH}/vendor/oc whoami --show-token`
echo "SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN"

echo "Create RBAC users"
source $DIR/rbac-setup.sh

$DIR/cluster-clean.sh

make docker/login
export DOCKER_URI=quay.io/open-cluster-management/grc-ui-api:latest-dev
make docker/pull

export SELENIUM_USER=${SELENIUM_USER:-${OC_CLUSTER_USER}}
export SELENIUM_PASSWORD=${SELENIUM_PASSWORD:-${OC_HUB_CLUSTER_PASS}}

docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e API_SERVER_URL=$OC_HUB_CLUSTER_URL $DOCKER_URI
export NODE_ENV=development 
export API_SERVER_URL=$OC_HUB_CLUSTER_URL
npm run build
npm run start:instrument &>/dev/null &
sleep 10
npm run test:e2e-headless

# kill the node process to let nyc generate coverage report
ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}' | xargs kill
sleep 10

sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/server/coverage/lcov.info

#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2020. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Login hub"
# Set cluster URL and password (the defaults are the ones generated in Prow)
HUB_NAME=${HUB_NAME:-"hub-1"}
export OC_CLUSTER_URL=${OC_CLUSTER_URL:-"$(jq -r '.api_url' ${SHARED_DIR}/${HUB_NAME}.json)"}
# This credential file is created in run-e2e-setup.sh
export OC_CLUSTER_USER=${OC_CLUSTER_USER:-"$(jq -r '.rbac_user' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
export OC_CLUSTER_PASS=${OC_CLUSTER_PASS:-"$(jq -r '.rbac_pass' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
make oc/login

echo "Set up default envs for hub"
$DIR/setup-env.sh
source $DIR/../.env

echo "Export envs to run E2E"
acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`
export CYPRESS_BASE_URL="https://localhost:3000"
export CYPRESS_coverage=${CYPRESS_coverage:-"true"}
export FAIL_FAST=${FAIL_FAST:-"true"}

GRCUIAPI_VERSION=${GRCUIAPI_VERSION:-"latest"}
echo "Starting grcuiapi:${GRCUIAPI_VERSION}"
export DOCKER_URI=quay.io/open-cluster-management/grc-ui-api:${GRCUIAPI_VERSION}
docker pull ${DOCKER_URI}
docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e API_SERVER_URL=$API_SERVER_URL $DOCKER_URI

echo "Building and running grcui"
npm run build
npm run start:instrument &>/dev/null &
sleep 10

echo "Launching Cypress E2E test"
npm run test:cypress-headless

# kill the node process to let nyc generate coverage report
ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}' | xargs kill
sleep 10

sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/server/coverage/lcov.info
sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/cypress/coverage/lcov.info

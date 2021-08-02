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

HUB_KUBE=${HUB_KUBE:-"${SHARED_DIR}/hub-1.kc"}
MANAGED_KUBE=${MANAGED_KUBE:-"${SHARED_DIR}/managed-1.kc"}

echo "Login managed"
if (ls "${MANAGED_KUBE}" &>/dev/null); then
  export KUBECONFIG=${MANAGED_KUBE}
else
  echo "* Managed cluster not found. Continuing using Hub as managed."
  export KUBECONFIG=${HUB_KUBE}
fi

$DIR/install-cert-manager.sh
$DIR/cluster-clean-up.sh managed

echo "Login hub"
export KUBECONFIG=${HUB_KUBE}

$DIR/cluster-clean-up.sh hub

echo "Set up default envs"
$DIR/setup-env.sh
source $DIR/../.env

echo "Create RBAC users"
export RBAC_PASS=$(head /dev/urandom | tr -dc 'A-Za-z0-9' | head -c $((32 + RANDOM % 8)))
source $DIR/rbac-setup.sh

echo "Set up cluster for test"
$DIR/cluster-setup.sh

echo "Export envs to run E2E"
acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`
export CYPRESS_BASE_URL="https://localhost:3000"
export CYPRESS_coverage=${CYPRESS_coverage:-"true"}

docker pull quay.io/open-cluster-management/grc-ui-api:${GRCUIAPI_VERSION:-"latest"}

docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e API_SERVER_URL=$API_SERVER_URL $DOCKER_URI

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

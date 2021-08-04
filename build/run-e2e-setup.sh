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

echo "===== E2E Cluster Setup ====="

# Specify kubeconfig files (the defaults are the ones generated in Prow)
HUB_NAME=${HUB_NAME:-"hub-1"}
HUB_KUBE=${HUB_KUBE:-"${SHARED_DIR}/${HUB_NAME}.kc"}
MANAGED_KUBE=${MANAGED_KUBE:-"${SHARED_DIR}/managed-1.kc"}

echo "* Clean up managed"
if (ls "${MANAGED_KUBE}" &>/dev/null); then
  export KUBECONFIG=${MANAGED_KUBE}
else
  echo "* Managed cluster not found. Continuing using Hub as managed."
  export KUBECONFIG=${HUB_KUBE}
fi

$DIR/install-cert-manager.sh
$DIR/cluster-clean-up.sh managed

echo "* Clean up hub"
export KUBECONFIG=${HUB_KUBE}

$DIR/cluster-clean-up.sh hub

echo "* Create RBAC users"
export RBAC_PASS=$(head /dev/urandom | tr -dc 'A-Za-z0-9' | head -c $((32 + RANDOM % 8)))
source $DIR/rbac-setup.sh

echo "* Set up cluster for test"
$DIR/cluster-setup.sh

echo "===== E2E Environment Setup ====="

echo "* Login hub"
# Set cluster URL and password (the defaults are the ones generated in Prow)
HUB_NAME=${HUB_NAME:-"hub-1"}
export OC_CLUSTER_URL=${OC_CLUSTER_URL:-"$(jq -r '.api_url' ${SHARED_DIR}/${HUB_NAME}.json)"}
# The RBAC credential file in the default is created in run-e2e-setup.sh
export OC_CLUSTER_USER=${OC_CLUSTER_USER:-"$(jq -r '.rbac_user' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
export RBAC_PASS=${RBAC_PASS:-"$(jq -r '.rbac_pass' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
export OC_CLUSTER_PASS=${OC_CLUSTER_PASS:-"${RBAC_PASS}"}
export OC_IDP=${OC_IDP:-"$(jq -r '.rbac_idp' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
# log in to hub
if [ -z "${OC_CLUSTER_TOKEN}" ]; then
  oc login ${OC_CLUSTER_URL} --insecure-skip-tls-verify=true -u ${OC_CLUSTER_USER} -p ${OC_CLUSTER_PASS}
else
  oc login ${OC_CLUSTER_URL} --insecure-skip-tls-verify=true --token=${OC_CLUSTER_TOKEN}
fi

echo "* Set up default envs for hub"
$DIR/setup-env.sh
source $DIR/../.env

acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`

GRCUIAPI_VERSION=${GRCUIAPI_VERSION:-"latest"}
DOCKER_URI=quay.io/open-cluster-management/grc-ui-api:${GRCUIAPI_VERSION}
if [[ "${RUN_LOCAL}" == "true" ]]; then
  docker pull ${DOCKER_URI}
  docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN -e API_SERVER_URL=$API_SERVER_URL $DOCKER_URI
else
  echo "* Patching GRC UI API with grcuiapi:${GRCUIAPI_VERSION}"
  GRCUIAPI_LABEL="component=ocm-grcuiapi"
  GRCUIAPI=$(oc get deployment -l ${GRCUIAPI_LABEL} -n ${acm_installed_namespace} -o=jsonpath='{.items[*].metadata.name}')
  oc patch deployment ${GRCUIAPI} -n ${acm_installed_namespace} -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"grc-ui-api\",\"image\":\"${DOCKER_URI}\"}]}}}}"
  oc delete pod -l ${GRCUIAPI_LABEL} -n ${acm_installed_namespace}
  i=0
  while (oc get pod -l ${GRCUIAPI_LABEL} -n ${acm_installed_namespace} -o json | jq -r '.items[].status.phase' | grep -v "Running"); do
    sleep 10
    echo "* Waiting for the API to be running"
    # Try for up to 5 minutes
    i=$[i + 1]
    if [[ "$i" == '30' ]]; then
      echo "* ERROR: Timeout waiting for the API"
      exit 1
    fi
  done
fi

echo "* Export envs to run E2E"
export CYPRESS_coverage=${CYPRESS_coverage:-"true"}
export FAIL_FAST=${FAIL_FAST:-"true"}

if [[ "${RUN_LOCAL}" == "true" ]]; then
  echo "* Building and running grcui"
  export CYPRESS_BASE_URL="https://localhost:3000"
  npm run build
  npm run start:instrument &>/dev/null &
  sleep 10
else
  export CYPRESS_BASE_URL=https://`oc get route multicloud-console -n ${acm_installed_namespace} -o=jsonpath='{.spec.host}'`
fi

echo "===== E2E Test ====="
echo "* Launching Cypress E2E test"
npm run test:cypress-headless

# kill the node process to let nyc generate coverage report
ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}' | xargs kill
sleep 10

sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/server/coverage/lcov.info
sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/cypress/coverage/lcov.info

exit 1
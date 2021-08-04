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

echo "===== E2E Environment Setup ====="

echo "* Login hub"
# Set cluster URL and password (the defaults are the ones generated in Prow)
HUB_NAME=${HUB_NAME:-"hub-1"}
export OC_CLUSTER_URL=${OC_CLUSTER_URL:-"$(jq -r '.api_url' ${SHARED_DIR}/${HUB_NAME}.json)"}
# The RBAC credential file in the default is created in run-e2e-setup.sh
export OC_CLUSTER_USER=${OC_CLUSTER_USER:-"$(jq -r '.rbac_user' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
export OC_CLUSTER_PASS=${OC_CLUSTER_PASS:-"$(jq -r '.rbac_pass' ${SHARED_DIR}/${HUB_NAME}.rbac)"}
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

echo "* Export envs to run E2E"
acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`
export CYPRESS_BASE_URL="https://localhost:3000"
export CYPRESS_coverage=${CYPRESS_coverage:-"true"}
export FAIL_FAST=${FAIL_FAST:-"true"}

GRCUIAPI_VERSION=${GRCUIAPI_VERSION:-"latest"}
echo "* Patching GRC UI API with grcuiapi:${GRCUIAPI_VERSION}"
DOCKER_URI=quay.io/open-cluster-management/grc-ui-api:${GRCUIAPI_VERSION}
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

echo "* Building and running grcui"
npm run build
npm run start:instrument &>/dev/null &
sleep 10

echo "===== E2E Test ====="
echo "* Launching Cypress E2E test"
npm run test:cypress-headless

# kill the node process to let nyc generate coverage report
ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}' | xargs kill
sleep 10

sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/server/coverage/lcov.info
sed -i 's|SF:|SF:'"$(pwd)"/'|g' test-output/cypress/coverage/lcov.info

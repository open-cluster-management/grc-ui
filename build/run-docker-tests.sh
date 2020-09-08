#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

# log into hub
oc login ${OC_CLUSTER_URL} --insecure-skip-tls-verify=true -u ${OC_CLUSTER_USER} -p ${OC_CLUSTER_PASS}

# setup RBAC roles
source ./build/rbac-setup.sh
export SELENIUM_CLUSTER=https://`oc get route multicloud-console -n open-cluster-management -o=jsonpath='{.spec.host}'`
export SELENIUM_USER=${SELENIUM_USER:-${OC_CLUSTER_USER}}
export SELENIUM_PASSWORD=${SELENIUM_PASSWORD:-${OC_CLUSTER_PASS}}

# setup other test envs
export SKIP_NIGHTWATCH_COVERAGE=${SKIP_NIGHTWATCH_COVERAGE:-true}
export SKIP_LOG_DELETE=${SKIP_LOG_DELETE:-true}

# run test
npm run test:e2e-headless
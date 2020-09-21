#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

# log into hub
oc login ${OC_CLUSTER_URL} --insecure-skip-tls-verify=true -u ${OC_CLUSTER_USER} -p ${OC_CLUSTER_PASS}

# setup RBAC roles
if [ -z ${RBAC_PASS} ]; then
  echo "RBAC_PASS not set. Skipping RBAC test"
else
  source ./build/rbac-setup.sh
fi

export SELENIUM_CLUSTER=https://`oc get route multicloud-console -n open-cluster-management -o=jsonpath='{.spec.host}'`
export SELENIUM_USER=${SELENIUM_USER:-${OC_CLUSTER_USER}}
export SELENIUM_PASSWORD=${SELENIUM_PASSWORD:-${OC_CLUSTER_PASS}}

# setup other test envs
export SKIP_NIGHTWATCH_COVERAGE=${SKIP_NIGHTWATCH_COVERAGE:-true}
export SKIP_LOG_DELETE=${SKIP_LOG_DELETE:-true}
export DISABLE_CANARY_TEST=${DISABLE_CANARY_TEST:-false}

# show all envs
printenv
# test oauth server and see if idp has been setup
i=0
while true; do 
  IDP=`curl -L -k ${SELENIUM_CLUSTER} | grep ${SELENIUM_USER_SELECT}` || true
  if [ -z ${IDP// /} ]; then
    echo "wait for idp ${SELENIUM_USER_SELECT} to take effect..."
    sleep 10
  else
    echo "idp ${SELENIUM_USER_SELECT} has taken effect..."
    break
  fi
  i=$[i + 1]
  if [[ "$i" == '12' ]]; then
    echo "timeout waiting for idp ${SELENIUM_USER_SELECT}..."
    exit 1
  fi
done

# run test
sleep 10
npm run test:e2e-headless
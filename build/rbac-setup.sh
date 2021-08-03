#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project



# Description:
#     Sets up cluster users and resources for RBAC tests
# From the grc-ui project directory, invoke as:
#     ./build/rbac-setup.sh
# Be sure to export the desired password beforehand:
#     export RBAC_PASS=<your-password>

set -e
RBAC_DIR=./tests/cypress/config/rbac-setup
# Set WORK_DIR to the default Prow directory
if [[ -n "${ARTIFACT_DIR}" ]]; then
  WORK_DIR="/tmp"
else
  WORK_DIR=${RBAC_DIR}
fi

if [ ! -d ${RBAC_DIR} ]; then
  echo "Error: Directory ${RBAC_DIR} does not exist. Not creating RBAC resources."
  exit 1
fi

if [ -z ${RBAC_PASS} ]; then
  echo "Error: RBAC password not set in variable RBAC_PASS."
  exit 1
fi

if ! which htpasswd &>/dev/null; then
  if which apt-get &>/dev/null; then
    sudo apt-get update
    sudo apt-get install -y apache2-utils
  elif which yum &>/dev/null; then
    sudo yum update
    sudo yum install -y httpd-tools
  else
    echo "Error: Package manager not found. Failed to find or install htpasswd."
    exit 1
  fi
fi

touch ${WORK_DIR}/htpasswd
for access in cluster ns; do
  for role in cluster-admin admin edit view group; do
    htpasswd -b ${WORK_DIR}/htpasswd e2e-${role}-${access} ${RBAC_PASS}
  done
done

set +e
oc create secret generic e2e-users --from-file=htpasswd=${WORK_DIR}/htpasswd -n openshift-config
rm ${WORK_DIR}/htpasswd
if [[ -z "$(oc -n openshift-config get oauth cluster -o jsonpath='{.spec.identityProviders}')" ]]; then
  oc patch -n openshift-config oauth cluster --type json --patch '[{"op":"add","path":"/spec/identityProviders","value":[]}]'
fi
if [ ! $(oc -n openshift-config get oauth cluster -o jsonpath='{.spec.identityProviders[*].name}' | grep -o 'grc-e2e-htpasswd') ]; then
  oc patch -n openshift-config oauth cluster --type json --patch "$(cat ${RBAC_DIR}/e2e-rbac-auth.json)"
fi
oc apply --validate=false -k ${RBAC_DIR}
set -e

export OC_CLUSTER_USER=e2e-cluster-admin-cluster
export OC_HUB_CLUSTER_PASS=${RBAC_PASS}
export OC_CLUSTER_PASS=${RBAC_PASS}
export OC_IDP=grc-e2e-htpasswd

acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`
export CYPRESS_BASE_URL=https://`oc get route multicloud-console -n $acm_installed_namespace -o=jsonpath='{.spec.host}'`
# test oauth server and see if idp has been setup
i=0
while true; do
  IDP=`curl -sSL -k ${CYPRESS_BASE_URL} | grep ${OC_IDP}` || true
  if [ -z ${IDP// /} ]; then
    echo "* Wait for IDP ${OC_IDP} to take effect..."
    sleep 10
  else
    echo "* IDP ${OC_IDP} has taken effect..."
    echo ${IDP}
    break
  fi
  # Try for up to 5 minutes
  i=$[i + 1]
  if [[ "$i" == '30' ]]; then
    echo "* Timeout waiting for IDP ${OC_IDP}..."
    exit 1
  fi
done

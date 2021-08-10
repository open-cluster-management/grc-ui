#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project



set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "===== E2E Environment Setup ====="

oc create ns duplicatetest || true

acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`

VERSION_TAG=${VERSION_TAG:-"latest"}
DOCKER_URI="quay.io/open-cluster-management"
COMPONENT="grc-ui-api"
if [[ "${RUN_LOCAL}" == "true" ]]; then
  docker pull ${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}
  docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=${SERVICEACCT_TOKEN} -e API_SERVER_URL=${API_SERVER_URL} ${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}
else
  echo "* Patching hub cluster to ${VERSION_TAG}"
  oc annotate MultiClusterHub multiclusterhub -n open-cluster-management mch-pause=true --overwrite
  
  # Patch the API on the hub
  LABEL="component=ocm-grcuiapi"
  DEPLOYMENT=$(oc get deployment -l ${LABEL} -n ${acm_installed_namespace} -o=jsonpath='{.items[*].metadata.name}')
  oc patch deployment ${DEPLOYMENT} -n ${acm_installed_namespace} -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"${COMPONENT}\",\"image\":\"${DOCKER_URI}/${COMPONENT}:${LABEL}\"}]}}}}"
  oc delete pod -l ${LABEL} -n ${acm_installed_namespace}
  
  # Patch the propagator on the hub
  COMPONENT="governance-policy-propagator"
  LABEL="component=ocm-policy-propagator"
  DEPLOYMENT=$(oc get deployment -l ${POLICYPROPAGATOR_LABEL} -n ${acm_installed_namespace} -o=jsonpath='{.items[*].metadata.name}')
  oc patch deployment ${DEPLOYMENT} -n ${acm_installed_namespace} -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"${COMPONENT}\",\"image\":\"${DOCKER_URI}/${COMPONENT}:${LABEL}\"}]}}}}"
  
  # Patch managed cluster components
  echo "* Patching managed clusters to ${VERSION_TAG}"
  managedclusters=$(oc get managedcluster -o=jsonpath='{.items[*].metadata.name}')
  for managedcluster in $managedclusters
  do
      oc annotate klusterletaddonconfig -n $managedcluster $managedcluster klusterletaddonconfig-pause=true --overwrite=true
      for COMPONENT in $(ls ${DIR}/patches); do
        oc patch manifestwork -n $managedcluster $managedcluster-klusterlet-addon-${COMPONENT} --type='json' -p=`cat $DIR/patches/${COMPONENT} | sed 's/:latest/:'${VERSION_TAG}'/'` || true
      done
  done

  echo "* Deleting pods and waiting for restart"
  oc delete pod -l app=grc -A
  oc delete pod -l component=governance -A
  oc delete pod -l app=klusterlet-addon-iampolicyctrl -A
  oc delete pod -l app=cert-policy-controller -A

  ./build/wait_for.sh pod -l app=grc -A
  ./build/wait_for.sh pod -l component=governance -A
  ./build/wait_for.sh pod -l app=klusterlet-addon-iampolicyctrl -A
  ./build/wait_for.sh pod -l app=cert-policy-controller -A

fi

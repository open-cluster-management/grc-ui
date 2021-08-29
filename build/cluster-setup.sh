#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project



set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "===== E2E Environment Setup ====="

oc create ns duplicatetest || true

echo "* Check for a running ACM"
acm_installed_namespace=`oc get subscriptions.operators.coreos.com --all-namespaces | grep advanced-cluster-management | awk '{print $1}'`
while UNFINISHED="$(oc -n ${acm_installed_namespace} get pods | grep -v -e "Completed" -e "1/1     Running" -e "2/2     Running" -e "3/3     Running" -e "4/4     Running" -e "READY   STATUS" | wc -l)" && [[ "${UNFINISHED}" != "0" ]]; do
  echo "* Waiting on ${UNFINISHED} pods in namespace ${acm_installed_namespace}..."
  sleep 5
done

VERSION_TAG=${VERSION_TAG:-"latest"}
DOCKER_URI="quay.io/open-cluster-management"
COMPONENT="grc-ui-api"
if [[ "${RUN_LOCAL}" == "true" ]]; then
  docker pull ${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}
  docker run -d -t -i -p 4000:4000 --name grcuiapi -e NODE_ENV=development -e SERVICEACCT_TOKEN=${SERVICEACCT_TOKEN} -e API_SERVER_URL=${API_SERVER_URL} ${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}
else
  echo "* Patching hub cluster to ${VERSION_TAG}"
  oc annotate MultiClusterHub multiclusterhub -n ${acm_installed_namespace} mch-pause=true --overwrite
  
  # Patch the API on the hub
  LABEL="component=ocm-grcuiapi"
  DEPLOYMENT=$(oc get deployment -l ${LABEL} -n ${acm_installed_namespace} -o=jsonpath='{.items[*].metadata.name}')
  oc patch deployment ${DEPLOYMENT} -n ${acm_installed_namespace} -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"${COMPONENT}\",\"image\":\"${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}\"}]}}}}"
  
  # Patch the propagator on the hub
  COMPONENT="governance-policy-propagator"
  LABEL="component=ocm-policy-propagator"
  DEPLOYMENT=$(oc get deployment -l ${LABEL} -n ${acm_installed_namespace} -o=jsonpath='{.items[*].metadata.name}')
  oc patch deployment ${DEPLOYMENT} -n ${acm_installed_namespace} -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"${COMPONENT}\",\"image\":\"${DOCKER_URI}/${COMPONENT}:${VERSION_TAG}\"}]}}}}"
  
  # Patch managed cluster components
  echo "* Patching managed clusters to ${VERSION_TAG}"
  MANAGED_CLUSTERS=$(oc get managedcluster -o=jsonpath='{.items[*].metadata.name}')
  
  for MANAGED_CLUSTER in ${MANAGED_CLUSTERS}; do      
      FOUND="false"
      while [[ "${FOUND}" == "false" ]]; do
        echo "* Wait for manifestwork on ${MANAGED_CLUSTER}:"
        FOUND="true"
        for COMPONENT in $(ls ${DIR}/patches); do
          if (! oc get manifestwork -n ${MANAGED_CLUSTER} ${MANAGED_CLUSTER}-klusterlet-addon-${COMPONENT}); then
            FOUND="false"
          fi
        done
        sleep 5
      done
      oc annotate klusterletaddonconfig -n ${MANAGED_CLUSTER} ${MANAGED_CLUSTER} klusterletaddonconfig-pause=true --overwrite=true
      for COMPONENT in $(ls ${DIR}/patches); do
        oc patch manifestwork -n ${MANAGED_CLUSTER} ${MANAGED_CLUSTER}-klusterlet-addon-${COMPONENT} --type='json' -p=`cat $DIR/patches/${COMPONENT} | sed 's/:latest/:'${VERSION_TAG}'/g'` || true
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

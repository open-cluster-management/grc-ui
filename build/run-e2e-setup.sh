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

# Specify kubeconfig files (the defaults are the ones generated in Prow)
HUB_NAME=${HUB_NAME:-"hub-1"}
HUB_KUBE=${HUB_KUBE:-"${SHARED_DIR}/${HUB_NAME}.kc"}
MANAGED_KUBE=${MANAGED_KUBE:-"${SHARED_DIR}/managed-1.kc"}

echo "Clean up managed"
if (ls "${MANAGED_KUBE}" &>/dev/null); then
  export KUBECONFIG=${MANAGED_KUBE}
else
  echo "* Managed cluster not found. Continuing using Hub as managed."
  export KUBECONFIG=${HUB_KUBE}
fi

$DIR/install-cert-manager.sh
$DIR/cluster-clean-up.sh managed

echo "Clean up hub"
export KUBECONFIG=${HUB_KUBE}

$DIR/cluster-clean-up.sh hub

echo "Create RBAC users"
export RBAC_PASS=$(head /dev/urandom | tr -dc 'A-Za-z0-9' | head -c $((32 + RANDOM % 8)))
source $DIR/rbac-setup.sh
if [[ -n "${SHARED_DIR}" ]]; then
  jq -n '{ "rbac_user":  env.OC_CLUSTER_USER, "rbac_pass": env.RBAC_PASS }' > ${SHARED_DIR}/${HUB_NAME}.rbac
fi

echo "Set up cluster for test"
$DIR/cluster-setup.sh

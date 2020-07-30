#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2020. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.
# Copyright (c) 2020 Red Hat, Inc.

# From the grc-ui project directory, invoke as:
#     ./build/rbac-clean.sh

RBAC_DIR=${1:-.}/tests/e2e/yaml/rbac_test

if [ ! -d ${RBAC_DIR} ]; then
  echo "Error: Directory ${RBAC_DIR} does not exist."
  exit 1
fi

oc delete -n openshift-config secret e2e-users || true
oc delete -k ${RBAC_DIR} || true
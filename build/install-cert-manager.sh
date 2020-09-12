#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Install cert manager on managed"
echo "Logging in $1 $2 $3"

OC_CLUSTER_URL=$1 OC_CLUSTER_USER=$2 OC_CLUSTER_PASS=$3make oc/login
oc apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.1/cert-manager.yaml

echo "Logout"
export OC_COMMAND=logout
make oc/command
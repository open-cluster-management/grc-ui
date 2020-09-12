#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Install cert manager on managed"
echo "Logging in $1 $2 $3"

oc login $1 --insecure-skip-tls-verify=true -u $2 -p $3
oc apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.1/cert-manager.yaml
oc logout
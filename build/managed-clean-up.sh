#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Managed: clean up"
oc delete pod --all -n default || true
oc delete issuers.cert-manager.io -l e2e=true -n default || true
oc delete certificates.cert-manager.io -l e2e=true -n default || true
oc delete secret -n default rsa-ca-sample-secret || true 
oc delete clusterrolebinding -l e2e=true || true
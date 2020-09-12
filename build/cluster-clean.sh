#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Login hub to clean up"
export OC_CLUSTER_URL=$OC_HUB_CLUSTER_URL
export OC_CLUSTER_PASS=$OC_HUB_CLUSTER_PASS
make oc/login
for ns in default e2e-rbac-test-1 e2e-rbac-test-2
do
    oc delete policies.policy.open-cluster-management.io -n $ns --all || true
    oc delete placementbindings.policy.open-cluster-management.io  -n $ns --all || true
    oc delete placementrules.apps.open-cluster-management.io -n $ns --all || true
done

echo "Logout"
export OC_COMMAND=logout
make oc/command

echo "Login managed to clean up"
export OC_CLUSTER_URL=$OC_MANAGED_CLUSTER_URL
export OC_CLUSTER_PASS=$OC_MANAGED_CLUSTER_PASS
make oc/login
oc delete pod --all -n default || true
oc delete issuers.cert-manager.io -l e2e=true -n default || true
oc delete certificates.cert-manager.io -l e2e=true -n default || true
oc delete secret -n default rsa-ca-sample-secret || true 
oc delete clusterrolebinding -l e2e=true || true
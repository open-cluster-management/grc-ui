#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.


function hub() {
    echo "Hub: clean up"
    for ns in default e2e-rbac-test-1 e2e-rbac-test-2
        do
            oc delete policies.policy.open-cluster-management.io -n $ns --all || true
            oc delete placementbindings.policy.open-cluster-management.io  -n $ns --all || true
            oc delete placementrules.apps.open-cluster-management.io -n $ns --all || true
        done
}

function managed() {
    echo "Managed: clean up"
    oc delete pod --all -n default || true
    oc delete issuers.cert-manager.io -l e2e=true -n default || true
    oc delete certificates.cert-manager.io -l e2e=true -n default || true
    oc delete secret -n default rsa-ca-sample-secret || true 
    oc delete clusterrolebinding -l e2e=true || true
}

case $1 in
    hub)
        hub
        ;;
    managed)
        managed
        ;;
    *)
        hub
        managed
        ;;
esac

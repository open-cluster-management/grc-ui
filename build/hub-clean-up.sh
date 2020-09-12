#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Hub: clean up"
for ns in default e2e-rbac-test-1 e2e-rbac-test-2
do
    oc delete policies.policy.open-cluster-management.io -n $ns --all || true
    oc delete placementbindings.policy.open-cluster-management.io  -n $ns --all || true
    oc delete placementrules.apps.open-cluster-management.io -n $ns --all || true
done

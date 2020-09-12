#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.

echo "Install cert manager on managed"

oc apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.1/cert-manager.yaml

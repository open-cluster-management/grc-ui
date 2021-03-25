#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project




if [ ! -z $CYPRESS_TAGS_INCLUDE ] || [ "$CYPRESS_TAGS_INCLUDE" = "@extended" ]; then
  unset CI; # unset for nightwatch
  npm run test:e2e-headless;
fi


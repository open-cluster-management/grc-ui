#!/bin/bash

# Run our build target and set IMAGE_NAME_AND_VERSION
export DOCKER_IMAGE_NAME=${1}
make build
make lint
make prune
make docker/build
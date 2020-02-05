#!/bin/bash

export DOCKER_IMAGE_NAME=${1}
make build
make lint
make prune
make docker/build
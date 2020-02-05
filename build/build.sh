#!/bin/bash

export DOCKER_IMAGE_AND_TAG=${1}
echo "DOCKER_IMAGE_AND_TAG=${DOCKER_IMAGE_AND_TAG}"

npm ci
npm run build:production
npm run lint
npm prune --production
make docker/build
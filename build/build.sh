#!/bin/bash

export DOCKER_IMAGE_NAME=${1}
npm run build:production
npm run lint
npm prune --production
make docker/build
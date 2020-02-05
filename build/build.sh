#!/bin/bash

export IMAGE_NAME_AND_VERSION=${1}
npm ci
npm run build:production
npm run lint
npm prune --production
make docker/build
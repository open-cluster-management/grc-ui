###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include build/Configfile

-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

# Find component name and component version from repo artifacts
QUAYSCAN_IMAGE_NAME := $(shell cat ${BUILD_HARNESS_PATH}/../COMPONENT_NAME 2> /dev/null)
QUAYSCAN_IMAGE_VERSION := $(shell cat ${BUILD_HARNESS_PATH}/../COMPONENT_VERSION 2> /dev/null)
QUAYSCAN_IMAGE_TAG_EXTENSION := ${COMPONENT_TAG_EXTENSION}

# Build the details for the remote destination repo for the image
QUAYSCAN_DOCKER_REPO := "quay.io/open-cluster-management"

.PHONY : quayscan\:status
quayscan\:status:
	@echo "---quayscan status---"
	@echo "${QUAYSCAN_DOCKER_REPO}/${QUAYSCAN_IMAGE_NAME}:${QUAYSCAN_IMAGE_VERSION}${QUAYSCAN_IMAGE_TAG_EXTENSION}"

default::
	@echo "Build Harness Bootstrapped"

install:
	npm install

lint:
	npm run lint

prune:
	npm prune --production

build-prod:
	npm run build:production

unit-test:
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm test

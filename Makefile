###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include Configfile

SHELL := /bin/bash

ifneq ($(ARCH), x86_64)
DOCKER_FILE = Dockerfile.$(ARCH)
else
DOCKER_FILE = Dockerfile
endif
@echo "using DOCKER_FILE: $(DOCKER_FILE)"

init::
-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

lint:
	npm run lint

prune:
	npm prune --production

build:
	npm run build:production

.PHONY: run
run: 
ifeq ($(ARCH), x86_64)
	# Both containers grc-ui and grc-ui-api must be on the same network.
	docker network create --subnet 10.10.0.0/16 $(NETWORK_NAME)
	make docker:info DOCKER_NETWORK_OP=$(NETWORK_OP) DOCKER_NETWORK=$(NETWORK_NAME)
	make docker:run DOCKER_NETWORK_OP=$(NETWORK_OP) DOCKER_NETWORK=$(NETWORK_NAME)
endif

.PHONY: unit-test
unit-test:
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm test

.PHONY: e2e-test
e2e-test:
ifeq ($(SELENIUM_TESTS), TRUE)
ifeq ($(ARCH), x86_64)
	make docker:pull DOCKER_URI=$(GRC_UI_API_DOCKER_URI)
	docker image ls -a
	make docker:run DOCKER_NETWORK_OP=$(NETWORK_OP) DOCKER_NETWORK=$(NETWORK_NAME) DOCKER_IP_OP=$(IP_OP) DOCKER_IP=$(GRC_UI_API_DOCKER_IP) DOCKER_CONTAINER_NAME=$(GRC_UI_API_DOCKER_CONTAINER_NAME) DOCKER_BIND_PORT=$(GRC_UI_API_DOCKER_BIND_PORT) DOCKER_IMAGE=$(GRC_UI_API_DOCKER_URI) DOCKER_BUILD_TAG=$(RELEASE_TAG)
	npm install selenium-standalone@6.17.0 nightwatch@0.9.21
ifeq ($(A11Y_TESTS), TRUE)
	nightwatch
else
	nightwatch --env no-a11y
endif
endif
endif
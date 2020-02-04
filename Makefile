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

.PHONY: init\:
init::
-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

.PHONY: copyright-check
copyright-check:
	./copyright-check.sh

lint:
	npm run lint

prune:
	npm prune --production

.PHONY: build
build:
	npm run build:production

local:: build lint prune

#Check default DOCKER_BUILD_OPTS/DOCKER_RUN_OPTS/DOCKER_REGISTRY/DOCKER_BUILD_TAG/SCRATCH_TAG/DOCKER_TAG 
# values in Configfile. Only new value other than default need to be set here.
.PHONY: docker-logins
docker-logins:
	make docker:login DOCKER_REGISTRY=$(DOCKER_EDGE_REGISTRY)
	make docker:login DOCKER_REGISTRY=$(DOCKER_SCRATCH_REGISTRY)
	make docker:login

.PHONY: image
image:: docker-logins
	make docker:info
	make docker:build
	docker image ls -a

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
ifeq ($(UNIT_TESTS), TRUE)
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm test
endif

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

.PHONY: push
push:
	make docker:login DOCKER_REGISTRY=$(DOCKER_SCRATCH_REGISTRY)
	make docker:tag-arch DOCKER_REGISTRY=$(DOCKER_SCRATCH_REGISTRY) DOCKER_TAG=$(SCRATCH_TAG)
	make docker:push-arch DOCKER_REGISTRY=$(DOCKER_SCRATCH_REGISTRY) DOCKER_TAG=$(SCRATCH_TAG)

.PHONY: release
release:
	make docker:login
	make docker:tag-arch
	make docker:push-arch
	make docker:tag-arch DOCKER_TAG=$(SEMVERSION)
	make docker:push-arch DOCKER_TAG=$(SEMVERSION)
ifeq ($(ARCH), x86_64)
	make docker:tag-arch DOCKER_TAG=$(RELEASE_TAG_RED_HAT)
	make docker:push-arch DOCKER_TAG=$(RELEASE_TAG_RED_HAT)
	make docker:tag-arch DOCKER_TAG=$(SEMVERSION_RED_HAT)
	make docker:push-arch DOCKER_TAG=$(SEMVERSION_RED_HAT)
endif

.PHONY: multi-arch
multi-arch:
	make docker:manifest-tool
	make docker:multi-arch
	make docker:multi-arch DOCKER_TAG=$(SEMVERSION)

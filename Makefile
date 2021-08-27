###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################
# Copyright Contributors to the Open Cluster Management project


include build/Configfile

default::
	@echo "No target specified"
install:
	CYPRESS_INSTALL_BINARY=0 npm ci --unsafe-perm

copyright-check:
	./build/copyright-check.sh $(TRAVIS_BRANCH)

lint:
	npm run lint

prune:
	npm prune --production

build-prod:
	npm run build:production

unit-test:
	if [ ! -d "test-output/unit" ]; then \
		mkdir -p test-output/unit; \
	fi
	npm test

travis-slack-reporter:
	node ./tests/utils/slack-reporter.js

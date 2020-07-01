/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

const requireServer = require('./require-server'),
      nconf = requireServer('nconf')

const WHITELIST = [
  'ACM_VERSION',
  'contextPath',
  'complianceNamespace',
  'clusterContextPath',
  'docUrl',
  'featureFlags_cisPolicyTemplate',
  'feature_search-api',
  'feature_security-findings',
  'feature_applications',
  'grcUiApiUrl',
  'headerContextPath',
  'overview',
  'ocmPoliciesPrefix',
]

let config = {}

if (nconf) {
  WHITELIST.forEach(i => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
var requireServer = require('./require-server'),
    nconf = requireServer('nconf')

var WHITELIST = [
  'contextPath',
  'headerContextPath',
  'clusterContextPath',
  'grcUiApiUrl',
  'complianceNamespace',
  'overview',
  'featureFlags: filters',
  'featureFlags:dashboardLiveUpdates',
  'featureFlags:dashboardRefreshInterval',
  'featureFlags:fullDashboard',
  'featureFlags:liveUpdates',
  'featureFlags:liveUpdatesPollInterval',
  'featureFlags:search',
  'feature_searchRelated',
  'feature_search-api',
  'feature_security-findings',
  'feature_applications',
  'ICP_VERSION'
]

var config = {}

if (nconf) {
  WHITELIST.forEach(i => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

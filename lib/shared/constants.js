/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.ACM_ACCESS_COOKIE = 'acm-access-token-cookie'
module.exports.CFC_AUTH_COOKIE = 'cfc-acs-auth-cookie'

module.exports.REFRESH_TIMES = [5, 10, 30, 60, 5*60, 30*60, 0]
module.exports.DEFAULT_REFRESH_TIME = 10
module.exports.GRC_REFRESH_INTERVAL_COOKIE = 'grc-refresh-interval-cookie'
/*side panel default auto refresh every 60 minutes*/
module.exports.DEFAULT_SIDE_PANEL_REFRESH_TIME = 3600
module.exports.GRC_SIDE_PANEL_REFRESH_INTERVAL_COOKIE = 'grc-side-panel-refresh-interval-cookie'
module.exports.GRC_VIEW_STATE_COOKIE = 'grc-view-state-cookie'
module.exports.GRC_FILTER_STATE_COOKIE = 'grc-filter-state-cookie'

module.exports.RESOURCE_TYPES = {
  HCM_POLICIES: { name: 'HCMPolicy', list: 'HCMPolicyList' },
  HCM_POLICIES_PER_APPLICATION: { name: 'HCMPolicyApplication', list: 'HCMPolicyApplicationList' },
  HCM_POLICIES_PER_CLUSTER: { name: 'HCMPolicyCluster', list: 'HCMPolicyClusterList' },
  HCM_POLICIES_PER_POLICY: { name: 'HCMPolicyPolicy', list: 'HCMPolicyPolicyList' },
  HCM_COMPLIANCES: { name: 'HCMCompliance', list: 'HCMComplianceList' },
  HCM_CLUSTERS: { name: 'HCMCluster', list: 'HCMClusterList'},// filter: true },
  HCM_SECURITY_FINDINGS: { name: 'HCMSecurityFindings', list: 'HCMSecurityFindingsList' },
  HCM_CLUSTER_FINDINGS: { name: 'HCMClusterFindings', list: 'HCMClusterFindingsList' },
}

module.exports.SECURITY_TYPES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  VIOLATIONS: 'Violations',
}

// keep order from lowest to highest role
module.exports.ROLES = {
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
  ADMIN: 'Administrator',
  ACCOUNT_ADMIN: 'AccountAdministrator',
  CLUSTER_ADMIN: 'ClusterAdministrator'
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 */
'use strict'

import config from '../../../lib/shared/config'
import specPodRole from './spec-rolebinding.yaml'
import specPodSecurity from './spec-psp.yaml'
// import specPodNetwork from './spec-network.yaml'
import specPodLimit from './spec-mem-limit.yaml'
import specPodExists from './spec-pod.yaml'
import specRoles from './spec-roles.yaml'
import specNamespace from './spec-namespace.yaml'
import specClustadminrole from './spec-clusteradminrole.yaml'
import specCertmgmtexp from './spec-certmgmtexp.yaml'
// import specMutationAdvisor from './spec-mutationadvisor.yaml'
// import specVAsecurity from './spec-vasecurity.yaml'
// import specKubeEncryption from './spec-kubeencryption.yaml'
// import specAudit from './spec-audit.yaml'
import specCis from './spec-cis.yaml'
import specCisOcp from './spec-cis-ocp.yaml'
import specScc from './spec-scc.yaml'
import specImv from './spec-imagemanifestvuln.yaml'

const Choices = {
  specPodRole,
  specPodSecurity,
  // specPodNetwork,
  specPodLimit,
  specPodExists,
  specRoles,
  specNamespace,
  specClustadminrole,
  specCertmgmtexp,
  // specMutationAdvisor,
  // specVAsecurity,
  // specKubeEncryption,
  // specAudit,
  specScc,
  specImv,
}

// don't show Cis policy related if featureFlags_cisPolicyTemplate is false
if (config.featureFlags_cisPolicyTemplate) {
  Choices.specCis = specCis
  Choices.specCisOcp = specCisOcp
}

export default Choices

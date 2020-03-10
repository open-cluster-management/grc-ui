/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import specPodRole from './spec-rolebinding.yaml'
import specPodSecurity from './spec-psp.yaml'
import specPodNetwork from './spec-network.yaml'
import specPodLimit from './spec-mem-limit.yaml'
import specPodExists from './spec-pod.yaml'
import specRoles from './spec-roles.yaml'
import specNamespace from './spec-namespace.yaml'
import specClustadminrole from './spec-clusteradminrole.yaml'
import specCertmgmtexp from './spec-certmgmtexp.yaml'
import specMutationAdvisor from './spec-mutationadvisor.yaml'
import specVAsecurity from './spec-vasecurity.yaml'
import specKubeEncryption from './spec-kubeencryption.yaml'
import specAudit from './spec-audit.yaml'
import specCis from './spec-cis.yaml'
import specCisOcp from './spec-cis-ocp.yaml'

export {
  specPodRole,
  specPodSecurity,
  specPodNetwork,
  specPodLimit,
  specPodExists,
  specRoles,
  specNamespace,
  specClustadminrole,
  specCertmgmtexp,
  specMutationAdvisor,
  specVAsecurity,
  specKubeEncryption,
  specAudit,
  specCis,
  specCisOcp,
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import specPodRole from './spec-rolebinding.yaml'
import specPodSecurity from './spec-psp.yaml'
import specPodLimit from './spec-mem-limit.yaml'
import specPodExists from './spec-pod.yaml'
import specRoles from './spec-roles.yaml'
import specNamespace from './spec-namespace.yaml'
import specClustadminrole from './spec-clusteradminrole.yaml'
import specCertmgmtexp from './spec-certmgmtexp.yaml'
import specScc from './spec-scc.yaml'
import specImv from './spec-imagemanifestvuln.yaml'
import specEtcdEncryption from './spec-etcd-encryption.yaml'
import specGatekeeper from './spec-gatekeeper.yaml'
import specCompOperator from './spec-comp-operator.yaml'

const Choices = {
  specPodRole,
  specPodSecurity,
  specPodLimit,
  specPodExists,
  specRoles,
  specNamespace,
  specClustadminrole,
  specCertmgmtexp,
  specScc,
  specImv,
  specEtcdEncryption,
  specGatekeeper,
  specCompOperator,
}

export default Choices

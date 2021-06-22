/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { AcmLaunchLink } from '@open-cluster-management/ui-components'
import { Alert } from '@patternfly/react-core'
import msgs from '../../../nls/platform.properties'
import '../../../scss/ansible-modal.scss'

export const renderAnsibleOperatorNotInstalled = (locale) => {
  const link = {
    id: 'installAnsibleOperatorLink',
    text: msgs.get('ansible.operator.installLink', locale),
    onClick: () => {
      fetch('/multicloud/api/v1/namespaces/openshift-config-managed/configmaps/console-public/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((respJSON) => {
        window.open(respJSON.data.consoleURL + '/operatorhub/all-namespaces?keyword=ansible+automation+platform')
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }
  return (
    <Alert
      variant='danger'
      isInline={true}
      title={msgs.get('ansible.operator.notInstalled', locale)}
      actionClose=''
    >
      <AcmLaunchLink links={[link]} />
    </Alert>
  )
}

/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */
'use strict'

export const getAnsibleOperatorLink = () => {
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

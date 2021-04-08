/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */
/* eslint-disable react/display-name */

'use strict'
import React from 'react'
import { AcmButton } from '@open-cluster-management/ui-components'

import { ALL_POLICIES, POLICY_STATUS, POLICY_STATUS_HISTORY, POLICY_TEMPLATE_DETAILS } from '../../../lib/client/queries'
import config from '../../../lib/shared/config'
// eslint-disable-next-line import/no-named-as-default
import GrcView from '../../components/modules/GrcView'
import PolicyStatusView from '../../components/modules/PolicyStatusView'
import PolicyTemplateDetailsView from '../../components/modules/PolicyTemplateDetailsView'
import PolicyStatusHistoryView from '../../components/modules/PolicyStatusHistoryView'
import msgs from '../../../nls/platform.properties'
import { checkCreatePermission, checkEditPermission } from '../../components/common/CheckUserPermission'


export const GET_PAGE_DEFINITION = (props) => {
  const { type } = props
  switch(type) {
    case 'ALL_POLICIES':
      return POLICIES_PAGE(props)
    case 'POLICY_STATUS':
      return POLICY_STATUS_PAGE(props)
    case 'POLICY_TEMPLATE_DETAILS':
      return POLICY_TEMPLATE_DETAILS_PAGE(props)
    case 'POLICY_STATUS_HISTORY':
      return POLICY_STATUS_HISTORY_PAGE(props)
    default:
      return undefined
  }
}

const createBtn = ({ userAccess, history, locale }) => {
  return (
    <AcmButton key='create-policy' id='create-policy' isDisabled={checkCreatePermission(userAccess)===0}
      tooltip={msgs.get('error.permission.disabled', locale)}
      onClick={() => history.push(`${config.contextPath}/create`)}>
      {msgs.get('routes.create.policy', locale)}
    </AcmButton>
  )
}

const editBtn = ({ userAccess, history, locale, name, namespace }) => {
  return (
    <AcmButton key='edit-policy' id='edit-policy' isDisabled={checkEditPermission(userAccess)===0}
      tooltip={msgs.get('error.permission.disabled', locale)}
      onClick={() => history.push(`${config.contextPath}/${namespace}/${name}/edit`)}>
      {msgs.get('routes.edit.policy', locale)}
    </AcmButton>
  )
}

const POLICIES_PAGE = ({ locale }) => {
  return {
    id: 'policies',
    title: msgs.get('routes.grc', locale),
    query: ALL_POLICIES,
    refreshControls: true,
    buttons: [ createBtn ],
    childern: (props) => <GrcView {...props} />
  }
}

const POLICY_STATUS_PAGE = ({ name, namespace, locale }) => {
  return {
    id: 'policy-status',
    title: name,
    query: POLICY_STATUS,
    query_variables: { policyName: name, hubNamespace: namespace },
    refreshControls: true,
    breadcrumb: [
      { text: msgs.get('routes.policies', locale), to: config.contextPath },
      { text: name, to: name }
    ],
    buttons: [ editBtn ],
    childern: (props) => <PolicyStatusView {...props} />
  }
}

const POLICY_TEMPLATE_DETAILS_PAGE = (props) => {
  const { name, namespace, cluster, apiGroup, version, kind, template, locale } = props
  const selfLink = `/apis/${apiGroup}/${version}/namespaces/${cluster}/${kind}/${template}`
  return {
    id: 'policy-template-details',
    title: template,
    query: POLICY_TEMPLATE_DETAILS,
    query_variables: { name:template, cluster, kind, selfLink },
    refreshControls: true,
    breadcrumb: [
      { text: msgs.get('routes.policies', locale), to: config.contextPath },
      { text: name, to: `${config.contextPath}/all/${namespace}/${name}`},
      { text: msgs.get('table.header.status', locale), to: `${config.contextPath}/all/${namespace}/${name}/status` },
      { text: template, to: template }
    ],
    childern: (props) => <PolicyTemplateDetailsView {...props} selfLink={selfLink} />
  }
}

const POLICY_STATUS_HISTORY_PAGE = ({ name, namespace, cluster, template, locale }) => {
  return {
    id: 'policy-status-history',
    title: msgs.get('table.header.history', locale),
    query: POLICY_STATUS_HISTORY,
    query_variables: { policyName: name, hubNamespace: namespace, cluster, template },
    refreshControls: true,
    breadcrumb: [
      { text: msgs.get('routes.policies', locale), to: config.contextPath },
      { text: name, to: `${config.contextPath}/all/${namespace}/${name}`},
      { text: msgs.get('table.header.status', locale), to: `${config.contextPath}/all/${namespace}/${name}/status`},
      { text: msgs.get('table.header.history', locale), to: msgs.get('table.header.history', locale) }
    ],
    childern: (props) => <PolicyStatusHistoryView {...props} cluster={cluster} template={template} />
  }
}


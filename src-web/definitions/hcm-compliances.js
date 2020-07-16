/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

'use strict'

import React from 'react'
import _ from 'lodash'
import msgs from '../../nls/platform.properties'
import { getAge, getLabelsToList } from '../../lib/client/resource-helper'
import { Icon } from 'carbon-components-react'
import {getAPIGroups, getExcludeNamespace, getIncludeNamespace, getRuleVerbs} from './hcm-policies'
import { Link } from 'react-router-dom'
import StatusField from '../components/common/StatusField'
import config from '../../lib/shared/config'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  compliancePolicies: {
    resourceKey: 'compliancePolicies',
    title: 'string.policies',
    defaultSortField: 'name',
    normalizedKey: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'policyCompliantStatus',
        key: 'policyCompliantStatus',
        transformFunction: getCompliancePolicyStatus,
      },
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
        transformFunction: createPolicyLink,
      },
      {
        msgKey: 'table.header.cluster.compliant',
        resourceKey: 'clusterCompliant',
        key: 'clusterCompliant',
        transformFunction: createCompliancePolicyLink,
      },
      {
        msgKey: 'table.header.cluster.not.compliant',
        resourceKey: 'clusterNotCompliant',
        key: 'clusterNotCompliant',
        transformFunction: createCompliancePolicyLink,
      },
    ],
  },
  placementBindingKeys: {
    title: 'application.placement.bindings',
    defaultSortField: 'name',
    resourceKey: 'placementBindings',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'metadata.name',
        msgKey: 'string.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'string.namespace'
      },
      {
        key: 'placementpolicy',
        resourceKey: 'placementRef.name',
        msgKey: 'table.header.placementpolicy'
      },
      {
        key: 'subjects',
        resourceKey: 'subjects',
        msgKey: 'table.header.subjects',
        transformFunction: getSubjects
      },
      {
        key: 'timestamp',
        resourceKey: 'metadata.creationTimestamp',
        msgKey: 'string.created',
        transformFunction: getAge
      },
    ],
    detailKeys: {
      title: 'policy.pb.details.title',
      headerRows: ['type', 'detail'],
      rows: [
        {
          cells: [
            {
              resourceKey: 'string.name',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.name'
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.namespace',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.namespace'
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.placement.rule',
              type: 'i18n'
            },
            {
              resourceKey: 'placementRef.name'
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'policy.pb.details.subjects',
              type: 'i18n'
            },
            {
              resourceKey: 'subjects[0]',
              transformFunction: getSubjects
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.timestamp',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.creationTimestamp',
              transformFunction: getAge,
            }
          ]
        },
      ]
    },
    tableActions: [
      'table.actions.edit',
    ],
  },
  placementPolicyKeys: {
    title: 'application.placement.policies',
    defaultSortField: 'name',
    resourceKey: 'placementPolicies',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'metadata.name',
        msgKey: 'string.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'string.namespace'
      },
      {
        key: 'replicas',
        resourceKey: 'clusterReplicas',
        msgKey: 'table.header.replicas'
      },
      {
        key: 'clusterSelector',
        resourceKey: 'clusterLabels',
        msgKey: 'string.cluster.selector',
        transformFunction: getLabelsToList,
      },
      {
        key: 'resourceSelector',
        resourceKey: 'resourceSelector',
        msgKey: 'table.header.resource.selector',
        transformFunction: getLabelsToList,
      },
      {
        key: 'decisions',
        resourceKey: 'status',
        msgKey: 'table.header.decisions',
        transformFunction: getDecisions,
      },
      {
        key: 'timestamp',
        resourceKey: 'metadata.creationTimestamp',
        msgKey: 'string.created',
        transformFunction: getAge
      },
    ],
    detailKeys: {
      title: 'string.placement.rule',
      headerRows: ['type', 'detail'],
      rows: [
        {
          cells: [
            {
              resourceKey: 'string.name',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.name'
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.namespace',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.namespace'
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.cluster.selector',
              type: 'i18n'
            },
            {
              resourceKey: 'clusterLabels',
              transformFunction: getLabelsToList
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'policy.pp.details.decisions',
              type: 'i18n'
            },
            {
              resourceKey: 'status',
              transformFunction: getDecisions,
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: 'string.timestamp',
              type: 'i18n'
            },
            {
              resourceKey: 'metadata.creationTimestamp',
              transformFunction: getAge,
            }
          ]
        },
      ]
    },
    tableActions: [
      'table.actions.edit',
    ],
  },
  roleTemplates:{
    resourceKey: 'role-templates',
    title: 'table.header.role.template',
    defaultSortField: 'metadata.name',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'metadata.name',
        key: 'name',
      },
      {
        msgKey: 'table.header.role.template.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      }
    ],
    rows: [{
      cells: [
        {
          resourceKey: 'metadata.name',
        },
        {
          resourceKey: 'complianceType',
        },
        {
          resourceKey: 'apiVersion',
        }
      ]
    }],
    subHeaders :[
      'table.header.role.template.complianceType',
      'table.header.apiGroups',
      'table.header.resources',
      'table.header.ruleVerbs',
    ]
  },
  objectTemplates:{
    resourceKey: 'object-templates',
    title: 'table.header.object.template',
    defaultSortField: 'metadata.name',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'metadata.name',
        key: 'name',
      },
      {
        msgKey: 'table.header.object.template.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.object.template.kind',
        resourceKey: 'kind',
        key: 'kind',
      }
    ],
  },
  policyTemplates:{
    resourceKey: 'policy-templates',
    title: 'table.header.policy.template',
    defaultSortField: 'metadata.name',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'metadata.name',
        key: 'name',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.object.template.kind',
        resourceKey: 'kind',
        key: 'kind',
      }
    ],
  },
  complianceStatus: {
    resourceKey: 'complianceStatus',
    title: 'table.header.compliance.compliant',
    defaultSortField: 'clusterNamespace',
    normalizedKey: 'clusterNamespace',
    tableKeys: [
      {
        msgKey: 'table.header.cluster.namespace',
        resourceKey: 'clusterNamespace',
        key: 'clusterNamespace',
      },
      {
        msgKey: 'table.header.compliance.policy.status',
        resourceKey: 'localCompliantStatus',
        key: 'localCompliantStatus',
      },
      {
        msgKey: 'table.header.compliance.policy.valid',
        resourceKey: 'localValidStatus',
        key: 'localValidStatus',
      },
    ],
  },
  tableKeys: [
    {
      msgKey: 'table.header.policy.name',
      resourceKey: 'metadata.name',
      transformFunction: createComplianceLink,
    },
    {
      msgKey: 'string.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.remediation',
      resourceKey: 'remediation',
    },
    {
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
    },
    {
      msgKey: 'string.controls',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
      transformFunction: getControls,
    },
    {
      msgKey: 'string.standards',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
      transformFunction: getStandards,
    },
    {
      msgKey: 'string.categories',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
      transformFunction: getCategories
    },
  ],
  tableActions: [
    'table.actions.edit',
    'table.actions.remove',
  ],
  detailKeys: {
    title: 'string.policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'string.name',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.namespace'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.createdAt',
            type: 'timestamp'
          },
          {
            resourceKey: 'metadata.creationTimestamp'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.cluster.violation',
            type: 'i18n'
          },
          {
            resourceKey: 'clusterCompliant',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.enforcement',
            information: 'grc.remediation.tooltip',
            type: 'i18n'
          },
          {
            resourceKey: 'raw.spec.remediationAction'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.disabled',
            type: 'i18n'
          },
          {
            resourceKey: 'raw.spec.disabled'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.categories',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.controls',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.standards',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
          }
        ]
      },
    ]
  },
  policyTemplatesKeys: {
    title: 'policy.template.details',
    headerRows: ['string.name', 'string.last.transition', 'string.template.type'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'name',
          },
          {
            resourceKey: 'lastTransition',
            transformFunction: getAge
          },
          {
            resourceKey: 'templateType',
          }
        ]
      }
    ]
  },
  policyRules: {
    title: 'table.header.rules',
    resourceKey: 'rules',
    defaultSortField: 'ruleUID',
    normalizedKey: 'ruleUID',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'ruleUID',
        key: 'ruleUID',
      },
      {
        msgKey: 'string.template.type',
        resourceKey: 'templateType',
        key: 'templateType',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'table.header.apiGroups',
        resourceKey: 'apiGroups',
        key: 'apiGroups',
        transformFunction: getAPIGroups
      },
      {
        msgKey: 'table.header.ruleVerbs',
        resourceKey: 'verbs',
        key: 'verbs',
        transformFunction: getRuleVerbs
      },
      {
        msgKey: 'table.header.resources',
        resourceKey: 'resources',
        key: 'resources',
      },
    ],
  },
  policyViolations: {
    resourceKey: 'violations',
    title: 'table.header.violation.detail',
    defaultSortField: 'name',
    normalizedKey: 'name',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.cluster',
        resourceKey: 'cluster',
        key: 'cluster',
        transformFunction: formLinkToCluster,
      },
      {
        msgKey: 'table.header.message',
        resourceKey: 'message',
        key: 'message',
        transformFunction: formLinkToCISControllerDoc,
      },
      {
        msgKey: 'table.header.timestamp',
        resourceKey: 'timestamp',
        key: 'timestamp',
        transformFunction: getAge,
      },
    ],
  },
  policyInfoKeys: {
    title: 'string.policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'string.name',
            type: 'i18n'
          },
          {
            resourceKey: 'name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.message',
            type: 'i18n'
          },
          {
            resourceKey: 'message'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.status',
            type: 'i18n'
          },
          {
            resourceKey: 'status'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.enforcement',
            type: 'i18n'
          },
          {
            resourceKey: 'enforcement'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.exclude_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.exclude_namespace',
            transformFunction: getExcludeNamespace
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.include_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.include_namespace',
            transformFunction: getIncludeNamespace
          }
        ]
      },
    ]
  },
  policyDetailKeys: {
    title: 'string.policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'string.name',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.cluster',
            type: 'i18n'
          },
          {
            resourceKey: 'cluster'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'table.header.message',
            type: 'i18n'
          },
          {
            resourceKey: 'status.details',
            transformFunction: getAggregatedMessage,
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.status',
            type: 'i18n'
          },
          {
            resourceKey: 'status.compliant'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'string.enforcement',
            type: 'i18n'
          },
          {
            resourceKey: 'enforcement'
          }
        ]
      },
    ]
  },
  policyRoleTemplates: {
    title: 'table.header.roleTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'roleTemplates',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatus
      },
    ],
  },
  policyRoleBindingTemplates: {
    title: 'table.header.roleBindingTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'roleBindingTemplates',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatus
      },
    ],
  },
  policyObjectTemplates: {
    title: 'table.header.objectTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'objectTemplates',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatus
      },
    ],
  },
  policyPolicyTemplates: {
    title: 'table.header.policyTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'policyTemplates',
    tableKeys: [
      {
        msgKey: 'string.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'string.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatus
      },
    ],
  },
}

export function createComplianceLink(item = {}, ...param){
  if (param[2]) {
    return item.metadata.name
  } else {
    if (item.raw.kind === 'Compliance') {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name} (Deprecated)</Link>
    }
    else {
      return <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
    }
  }
}

export function getStatus(item, locale) {
  const status = _.get(item, 'status', '-')
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid', 'unknown']
  if (status.compliant&&expectedStatuses.indexOf(status.compliant.toLowerCase()) > -1){
    if (status.compliant.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get(`policy.status.${status.compliant.toLowerCase()}`, locale)} />
    }
  } else if (status&&typeof(status)==='string'&&expectedStatuses.indexOf(status.toLowerCase()) > -1){
    if (status.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get(`policy.status.${status.toLowerCase()}`, locale)} />
    }
  }
  return '-'
}

export function getStatusIconForPolicy(item) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.status&&expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    if (item.status.toLowerCase() === 'compliant') {
      return (
        <div className='compliance-table-status'>
          <Icon className={'table-status__compliant'} name={'icon--checkmark--glyph'} description='' />
        </div>
      )
    } else {
      return (
        <div className='compliance-table-status'>
          <Icon className={'table-status__not_compliant'} name={'icon--error--glyph'} description='' />
        </div>
      )
    }
  }
  return '-'
}

export function getStatusIcon(item, locale) {
  if (item.compliant){
    if (item.compliant.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get('policy.status.noncompliant', locale)} />
    }
  }
  return '-'
}

export function getComplianceStatusIcon(item, locale) {
  if (item.status){
    if (item.status.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get('policy.status.noncompliant', locale)} />
    }
  }
  return '-'
}

export function getCompliancePolicyStatus(item, locale) {
  if (item.clusterNotCompliant && item.clusterNotCompliant.length > 0){
    return <StatusField status='critical' text={msgs.get('policy.status.noncompliant', locale)} />
  }
  return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
}

export function createCompliancePolicyLink(item = {}, ...param){
  const policyKeys = item[param[1]]
  const policyArray = []
  policyKeys && policyKeys.forEach(policyKey => {
    const targetPolicy = item.policies.find(policy => item.name === policy.name && policyKey === policy.cluster)
    policyArray.push(targetPolicy)
  })

  return policyArray.length > 0 ?
    <ul>{policyArray.map(policy => (<li key={`${policy.cluster}-${policy.name}`}>
      <Link
        to={`${config.contextPath}/all/${encodeURIComponent(policy.complianceNamespace)}/${encodeURIComponent(policy.complianceName)}/compliancePolicy/${encodeURIComponent(policy.name)}/${policy.cluster}`}>
        {policy.cluster}
      </Link>
    </li>))}</ul>
    :
    '-'
}

export function createPolicyLink(item = {}){
  return  <Link
    to={`${config.contextPath}/all/${encodeURIComponent(item.complianceNamespace)}/${encodeURIComponent(item.complianceName)}/compliancePolicy/${encodeURIComponent(item.name)}`}>
    {item.name}
  </Link>
}

export function getStatusCount(item) {
  return `${item.policyCompliant}/${item.policyTotal}`
}

export function getClusterCount(item) {
  return `${item.clusterCompliant}/${item.clusterTotal}`
}

export function getSubjects(item) {
  if(item && item.subjects){
    return item.subjects.map(subject => `${subject.name}(${subject.apiGroup})`).join(', ')
  }
  else{
    return '-'
  }
}

export function getControls(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return convertToStartCase(annotations['policy.open-cluster-management.io/controls'])
}

export function getStandards(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return convertToStartCase(annotations['policy.open-cluster-management.io/standards'])
}

export function getCategories(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return convertToStartCase(annotations['policy.open-cluster-management.io/categories'])
}

export function convertToStartCase(items){
  if (items) {
    return items.split(',').map(item => _.startCase(item.trim())).join(', ')
  }
  return '-'
}

export function getDecisions(item = {}){
  const decisions = _.get(item, 'placementPolicies[0].status.decisions') || _.get(item, 'status.decisions')
  if (decisions) {
    return decisions.map(decision => decision.clusterName).join(', ')
  }
  return '-'
}

export function formLinkToCluster(item){
  if(item && item.cluster && item.consoleURL){
    return <a target='_blank' rel='noopener noreferrer' href={`${item.consoleURL}`}>{item.cluster}</a>
  }
  else if (item && item.cluster) {
    return item.cluster
  }
  return '-'
}

export function formLinkToCISControllerDoc(item){
  if(item && item.message){
    return item.message
  }
  return '-'
}

export function getAggregatedMessage(item) {
  const details = _.get(item, 'status.details', [])
  let message = ''
  details.forEach((detail) => {
    const policyName = _.get(detail, 'templateMeta.name','-')
    if(_.get(detail, 'compliant') === 'Compliant') {
      message += `${policyName}: Compliant, `
    } else {
      const policyMessage = _.get(detail, 'history[0].message','-')
      message += `${policyName}: ${policyMessage} `
    }
  })
  return message
}

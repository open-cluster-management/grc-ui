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
    title: 'table.header.compliance.policies',
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
        msgKey: 'table.header.name',
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
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'table.header.namespace'
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
        msgKey: 'table.header.created',
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
              resourceKey: 'policy.pb.details.name',
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
              resourceKey: 'policy.pb.details.namespace',
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
              resourceKey: 'policy.pb.details.pp',
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
              resourceKey: 'policy.pb.details.timestamp',
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
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'table.header.namespace'
      },
      {
        key: 'replicas',
        resourceKey: 'clusterReplicas',
        msgKey: 'table.header.replicas'
      },
      {
        key: 'clusterSelector',
        resourceKey: 'clusterLabels',
        msgKey: 'table.header.cluster.selector',
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
        msgKey: 'table.header.created',
        transformFunction: getAge
      },
    ],
    detailKeys: {
      title: 'policy.pp.details.title',
      headerRows: ['type', 'detail'],
      rows: [
        {
          cells: [
            {
              resourceKey: 'policy.pp.details.name',
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
              resourceKey: 'policy.pp.details.namespace',
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
              resourceKey: 'policy.pp.details.clusterSelector',
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
              resourceKey: 'policy.pp.details.timestamp',
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
        msgKey: 'table.header.role.template.name',
        resourceKey: 'metadata.name',
        key: 'name',
      },
      {
        msgKey: 'table.header.role.template.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'table.header.role.template.apiVersion',
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
    defaultSortField: 'objectDefinition.metadata.name',
    normalizedKey: 'objectDefinition.metadata.name',
    tableKeys: [
      {
        msgKey: 'table.header.object.template.name',
        resourceKey: 'objectDefinition.metadata.name',
        key: 'name',
      },
      {
        msgKey: 'table.header.object.template.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'table.header.object.template.apiVersion',
        resourceKey: 'objectDefinition.apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.object.template.kind',
        resourceKey: 'objectDefinition.kind',
        key: 'kind',
      }
    ],
  },
  policyTemplates:{
    resourceKey: 'policy-templates',
    title: 'table.header.policy.template',
    defaultSortField: 'objectDefinition.metadata.name',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        msgKey: 'table.header.object.template.name',
        resourceKey: 'objectDefinition.metadata.name',
        key: 'name',
      },
      {
        msgKey: 'table.header.object.template.apiVersion',
        resourceKey: 'objectDefinition.apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.object.template.kind',
        resourceKey: 'objectDefinition.kind',
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
      msgKey: 'table.header.namespace',
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
      msgKey: 'table.header.controls',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/controls"]',
      transformFunction: getControls,
    },
    {
      msgKey: 'table.header.standards',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/standards"]',
      transformFunction: getStandards,
    },
    {
      msgKey: 'table.header.categories',
      resourceKey: 'metadata.annotations["policy.mcm.ibm.com/categories"]',
      transformFunction: getCategories
    },
  ],
  tableActions: [
    'table.actions.edit',
    'table.actions.remove',
  ],
  detailKeys: {
    title: 'compliance.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
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
            resourceKey: 'description.title.namespace',
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
            resourceKey: 'description.title.enforcement',
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
            resourceKey: 'description.title.exclude_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'raw.spec.namespaces.exclude'
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
            resourceKey: 'raw.spec.namespaces.include'
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
            resourceKey: 'description.title.categories',
            type: 'i18n'
          },
          {
            resourceKey: 'annotations.categories',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.controls',
            type: 'i18n'
          },
          {
            resourceKey: 'annotations.controls',
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.standards',
            type: 'i18n'
          },
          {
            resourceKey: 'annotations.standards',
          }
        ]
      },
    ]
  },
  policyTemplatesKeys: {
    title: 'policy.template.details',
    headerRows: ['description.title.name', 'description.title.last.transition', 'description.title.templateType'],
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
        msgKey: 'table.header.name',
        resourceKey: 'ruleUID',
        key: 'ruleUID',
      },
      {
        msgKey: 'table.header.templateType',
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
    title: 'table.header.violation',
    defaultSortField: 'name',
    normalizedKey: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.name',
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
        msgKey: 'table.header.reason',
        resourceKey: 'reason',
        key: 'reason',
      },
    ],
  },
  policyInfoKeys: {
    title: 'policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
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
            resourceKey: 'description.title.status',
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
            resourceKey: 'description.title.enforcement',
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
    title: 'policy.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
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
            resourceKey: 'message'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.status',
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
            resourceKey: 'description.title.enforcement',
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
  policyRoleTemplates: {
    title: 'table.header.roleTemplates',
    defaultSortField: 'name',
    normalizedKey: 'name',
    resourceKey: 'roleTemplates',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'description.title.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'description.title.last.transition',
        resourceKey: 'lastTransition',
        key: 'lastTransition',
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
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'description.title.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'description.title.last.transition',
        resourceKey: 'lastTransition',
        key: 'lastTransition',
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
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'description.title.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
      {
        msgKey: 'description.title.last.transition',
        resourceKey: 'lastTransition',
        key: 'lastTransition',
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
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'description.title.api.version',
        resourceKey: 'apiVersion',
        key: 'apiVersion',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
      {
        msgKey: 'description.title.last.transition',
        resourceKey: 'lastTransition',
        key: 'lastTransition',
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
  if (status.Compliant&&expectedStatuses.indexOf(status.Compliant.toLowerCase()) > -1){
    if (status.Compliant.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get(`policy.status.${status.Compliant.toLowerCase()}`, locale)} />
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
    // return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
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
  return convertToStartCase(annotations['policy.mcm.ibm.com/controls'])
}

export function getStandards(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return convertToStartCase(annotations['policy.mcm.ibm.com/standards'])
}

export function getCategories(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return convertToStartCase(annotations['policy.mcm.ibm.com/categories'])
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
  if(item && item.cluster && item.clusterURL){
    return <a target='_blank' rel='noopener noreferrer' href={`${item.clusterURL}`}>{item.cluster}</a>
  }
  else if (item && item.cluster) {
    return item.cluster
  }
  return '-'
}

export function formLinkToCISControllerDoc(item, locale){
  if(item && item.message){
    const lMessage = item.message.toLowerCase()
    if (lMessage.includes('cispolicy') && (lMessage.includes('couldn\'t') || lMessage.includes('deployed'))) {
      const cisURL = `${config.docUrl}/blob/doc_stage/about/known_issues.md#1087/`
      return <div>{`${item.message} `}<a target='_blank' rel='noopener noreferrer' href={cisURL}>{msgs.get('button.view.doc', locale)}</a></div>
    }
    else {
      return item.message
    }
  }
  return '-'
}

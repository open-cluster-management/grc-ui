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
import ResourceDetails from '../../../../src-web/components/common/ResourceDetails'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'

describe('ResourceDetails error', () => {
  it('renders as expected', () => {
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const srd = {
      'defaultSortField': 'metadata.name',
      'primaryKey': 'metadata.name',
      'secondaryKey': 'metadata.namespace',
      'compliancePolicies': {
        'resourceKey': 'compliancePolicies',
        'title': 'string.policies',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'tableKeys': [
          {
            'msgKey': 'table.header.compliant',
            'resourceKey': 'policyCompliantStatus',
            'key': 'policyCompliantStatus'
          },
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.cluster.compliant',
            'resourceKey': 'clusterCompliant',
            'key': 'clusterCompliant'
          },
          {
            'msgKey': 'table.header.cluster.not.compliant',
            'resourceKey': 'clusterNotCompliant',
            'key': 'clusterNotCompliant'
          }
        ]
      },
      'placementBindingKeys': {
        'title': 'application.placement.bindings',
        'defaultSortField': 'name',
        'resourceKey': 'placementBindings',
        'tableKeys': [
          {
            'key': 'name',
            'resourceKey': 'metadata.name',
            'msgKey': 'string.name'
          },
          {
            'key': 'namespace',
            'resourceKey': 'metadata.namespace',
            'msgKey': 'string.namespace'
          },
          {
            'key': 'placementpolicy',
            'resourceKey': 'placementRef.name',
            'msgKey': 'table.header.placementpolicy'
          },
          {
            'key': 'subjects',
            'resourceKey': 'subjects',
            'msgKey': 'table.header.subjects'
          },
          {
            'key': 'timestamp',
            'resourceKey': 'metadata.creationTimestamp',
            'msgKey': 'string.created'
          }
        ],
        'detailKeys': {
          'title': 'policy.pb.details.title',
          'headerRows': [
            'type',
            'detail'
          ],
          'rows': [
            {
              'cells': [
                {
                  'resourceKey': 'string.name',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.name'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.namespace',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.namespace'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.placement.rule',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'placementRef.name'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'policy.pb.details.subjects',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'subjects[0]'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.timestamp',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.creationTimestamp'
                }
              ]
            }
          ]
        },
        'tableActions': [
          'table.actions.edit'
        ]
      },
      'placementPolicyKeys': {
        'title': 'application.placement.policies',
        'defaultSortField': 'name',
        'resourceKey': 'placementPolicies',
        'tableKeys': [
          {
            'key': 'name',
            'resourceKey': 'metadata.name',
            'msgKey': 'string.name'
          },
          {
            'key': 'namespace',
            'resourceKey': 'metadata.namespace',
            'msgKey': 'string.namespace'
          },
          {
            'key': 'replicas',
            'resourceKey': 'clusterReplicas',
            'msgKey': 'table.header.replicas'
          },
          {
            'key': 'clusterSelector',
            'resourceKey': 'clusterLabels',
            'msgKey': 'string.cluster.selector'
          },
          {
            'key': 'resourceSelector',
            'resourceKey': 'resourceSelector',
            'msgKey': 'table.header.resource.selector'
          },
          {
            'key': 'decisions',
            'resourceKey': 'status',
            'msgKey': 'table.header.decisions'
          },
          {
            'key': 'timestamp',
            'resourceKey': 'metadata.creationTimestamp',
            'msgKey': 'string.created'
          }
        ],
        'detailKeys': {
          'title': 'string.placement.rule',
          'headerRows': [
            'type',
            'detail'
          ],
          'rows': [
            {
              'cells': [
                {
                  'resourceKey': 'string.name',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.name'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.namespace',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.namespace'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.cluster.selector',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'clusterLabels'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'policy.pp.details.decisions',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'status'
                }
              ]
            },
            {
              'cells': [
                {
                  'resourceKey': 'string.timestamp',
                  'type': 'i18n'
                },
                {
                  'resourceKey': 'metadata.creationTimestamp'
                }
              ]
            }
          ]
        },
        'tableActions': [
          'table.actions.edit'
        ]
      },
      'roleTemplates': {
        'resourceKey': 'role-templates',
        'title': 'table.header.role.template',
        'defaultSortField': 'metadata.name',
        'normalizedKey': 'metadata.name',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'metadata.name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.role.template.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'table.header.role.template.lastTransition',
            'resourceKey': 'status.conditions[0].lastTransitionTime',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'table.header.role.template.status',
            'resourceKey': 'status.Compliant',
            'key': 'status'
          }
        ],
        'rows': [
          {
            'cells': [
              {
                'resourceKey': 'metadata.name'
              },
              {
                'resourceKey': 'complianceType'
              },
              {
                'resourceKey': 'apiVersion'
              },
              {
                'resourceKey': 'status.conditions[0].lastTransitionTime'
              },
              {
                'resourceKey': 'status.Compliant'
              }
            ]
          }
        ],
        'subHeaders': [
          'table.header.role.template.complianceType',
          'table.header.apiGroups',
          'table.header.resources',
          'table.header.ruleVerbs'
        ]
      },
      'objectTemplates': {
        'resourceKey': 'object-templates',
        'title': 'table.header.object.template',
        'defaultSortField': 'objectDefinition.metadata.name',
        'normalizedKey': 'objectDefinition.metadata.name',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'objectDefinition.metadata.name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.object.template.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'objectDefinition.apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'table.header.object.template.kind',
            'resourceKey': 'objectDefinition.kind',
            'key': 'kind'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'status.conditions[0].lastTransitionTime',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'string.status',
            'resourceKey': 'status.Compliant',
            'key': 'status'
          }
        ]
      },
      'policyTemplates': {
        'resourceKey': 'policy-templates',
        'title': 'table.header.policy.template',
        'defaultSortField': 'objectDefinition.metadata.name',
        'normalizedKey': 'metadata.name',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'objectDefinition.metadata.name',
            'key': 'name'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'objectDefinition.apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'table.header.object.template.kind',
            'resourceKey': 'objectDefinition.kind',
            'key': 'kind'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'status.conditions[0].lastTransitionTime',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'string.status',
            'resourceKey': 'status.Compliant',
            'key': 'status'
          }
        ]
      },
      'complianceStatus': {
        'resourceKey': 'complianceStatus',
        'title': 'table.header.compliance.compliant',
        'defaultSortField': 'clusterNamespace',
        'normalizedKey': 'clusterNamespace',
        'tableKeys': [
          {
            'msgKey': 'table.header.cluster.namespace',
            'resourceKey': 'clusterNamespace',
            'key': 'clusterNamespace'
          },
          {
            'msgKey': 'table.header.compliance.policy.status',
            'resourceKey': 'localCompliantStatus',
            'key': 'localCompliantStatus'
          },
          {
            'msgKey': 'table.header.compliance.policy.valid',
            'resourceKey': 'localValidStatus',
            'key': 'localValidStatus'
          }
        ]
      },
      'tableKeys': [
        {
          'msgKey': 'table.header.policy.name',
          'resourceKey': 'metadata.name'
        },
        {
          'msgKey': 'string.namespace',
          'resourceKey': 'metadata.namespace'
        },
        {
          'msgKey': 'table.header.remediation',
          'resourceKey': 'remediation'
        },
        {
          'msgKey': 'table.header.cluster.violation',
          'resourceKey': 'clusterCompliant'
        },
        {
          'msgKey': 'string.controls',
          'resourceKey': 'metadata.annotations["policy.open-cluster-management.io/controls"]'
        },
        {
          'msgKey': 'string.standards',
          'resourceKey': 'metadata.annotations["policy.open-cluster-management.io/standards"]'
        },
        {
          'msgKey': 'string.categories',
          'resourceKey': 'metadata.annotations["policy.open-cluster-management.io/categories"]'
        }
      ],
      'tableActions': [
        'table.actions.edit',
        'table.actions.remove'
      ],
      'detailKeys': {
        'title': 'string.policy.details',
        'headerRows': [
          'type',
          'detail'
        ],
        'rows': [
          {
            'cells': [
              {
                'resourceKey': 'string.name',
                'type': 'i18n'
              },
              {
                'resourceKey': 'metadata.name'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'metadata.namespace'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.enforcement',
                'type': 'i18n'
              },
              {
                'resourceKey': 'raw.spec.remediationAction'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.exclude_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'raw.spec.namespaces.exclude'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.include_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'raw.spec.namespaces.include'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'table.header.cluster.violation',
                'type': 'i18n'
              },
              {
                'resourceKey': 'clusterCompliant'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.categories',
                'type': 'i18n'
              },
              {
                'resourceKey': 'annotations.categories'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.controls',
                'type': 'i18n'
              },
              {
                'resourceKey': 'annotations.controls'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.standards',
                'type': 'i18n'
              },
              {
                'resourceKey': 'annotations.standards'
              }
            ]
          }
        ]
      },
      'policyTemplatesKeys': {
        'title': 'policy.template.details',
        'headerRows': [
          'string.name',
          'string.last.transition',
          'string.template.type'
        ],
        'rows': [
          {
            'cells': [
              {
                'resourceKey': 'name'
              },
              {
                'resourceKey': 'lastTransition'
              },
              {
                'resourceKey': 'templateType'
              }
            ]
          }
        ]
      },
      'policyRules': {
        'title': 'table.header.rules',
        'resourceKey': 'rules',
        'defaultSortField': 'ruleUID',
        'normalizedKey': 'ruleUID',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'ruleUID',
            'key': 'ruleUID'
          },
          {
            'msgKey': 'string.template.type',
            'resourceKey': 'templateType',
            'key': 'templateType'
          },
          {
            'msgKey': 'table.header.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'table.header.apiGroups',
            'resourceKey': 'apiGroups',
            'key': 'apiGroups'
          },
          {
            'msgKey': 'table.header.ruleVerbs',
            'resourceKey': 'verbs',
            'key': 'verbs'
          },
          {
            'msgKey': 'table.header.resources',
            'resourceKey': 'resources',
            'key': 'resources'
          }
        ]
      },
      'policyViolations': {
        'resourceKey': 'violations',
        'title': 'table.header.violation',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.selector',
            'resourceKey': 'selector',
            'key': 'selector'
          },
          {
            'msgKey': 'table.header.cluster',
            'resourceKey': 'cluster',
            'key': 'cluster'
          },
          {
            'msgKey': 'table.header.message',
            'resourceKey': 'message',
            'key': 'message'
          },
          {
            'msgKey': 'table.header.reason',
            'resourceKey': 'reason',
            'key': 'reason'
          },
          {
            'msgKey': 'string.status',
            'resourceKey': 'status',
            'key': 'status'
          }
        ]
      },
      'policyInfoKeys': {
        'title': 'string.policy.details',
        'headerRows': [
          'type',
          'detail'
        ],
        'rows': [
          {
            'cells': [
              {
                'resourceKey': 'string.name',
                'type': 'i18n'
              },
              {
                'resourceKey': 'name'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'table.header.message',
                'type': 'i18n'
              },
              {
                'resourceKey': 'message'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.status',
                'type': 'i18n'
              },
              {
                'resourceKey': 'status'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.enforcement',
                'type': 'i18n'
              },
              {
                'resourceKey': 'enforcement'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.exclude_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'detail.exclude_namespace'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.include_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'detail.include_namespace'
              }
            ]
          }
        ]
      },
      'policyDetailKeys': {
        'title': 'string.policy.details',
        'headerRows': [
          'type',
          'detail'
        ],
        'rows': [
          {
            'cells': [
              {
                'resourceKey': 'string.name',
                'type': 'i18n'
              },
              {
                'resourceKey': 'metadata.name'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'table.header.cluster',
                'type': 'i18n'
              },
              {
                'resourceKey': 'cluster'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'table.header.message',
                'type': 'i18n'
              },
              {
                'resourceKey': 'message'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.status',
                'type': 'i18n'
              },
              {
                'resourceKey': 'status'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'string.enforcement',
                'type': 'i18n'
              },
              {
                'resourceKey': 'enforcement'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.exclude_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'detail.exclude_namespace'
              }
            ]
          },
          {
            'cells': [
              {
                'resourceKey': 'description.title.include_namespace',
                'type': 'i18n'
              },
              {
                'resourceKey': 'detail.include_namespace'
              }
            ]
          }
        ]
      },
      'policyRoleTemplates': {
        'title': 'table.header.roleTemplates',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'resourceKey': 'roleTemplates',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'lastTransition',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'table.header.compliant',
            'resourceKey': 'compliant',
            'key': 'compliant'
          }
        ]
      },
      'policyRoleBindingTemplates': {
        'title': 'table.header.roleBindingTemplates',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'resourceKey': 'roleBindingTemplates',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'lastTransition',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'table.header.compliant',
            'resourceKey': 'compliant',
            'key': 'compliant'
          }
        ]
      },
      'policyObjectTemplates': {
        'title': 'table.header.objectTemplates',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'resourceKey': 'objectTemplates',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'table.header.complianceType',
            'resourceKey': 'complianceType',
            'key': 'complianceType'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'table.header.kind',
            'resourceKey': 'kind',
            'key': 'kind'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'lastTransition',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'table.header.compliant',
            'resourceKey': 'compliant',
            'key': 'compliant'
          }
        ]
      },
      'policyPolicyTemplates': {
        'title': 'table.header.policyTemplates',
        'defaultSortField': 'name',
        'normalizedKey': 'name',
        'resourceKey': 'policyTemplates',
        'tableKeys': [
          {
            'msgKey': 'string.name',
            'resourceKey': 'name',
            'key': 'name'
          },
          {
            'msgKey': 'string.api.version',
            'resourceKey': 'apiVersion',
            'key': 'apiVersion'
          },
          {
            'msgKey': 'table.header.kind',
            'resourceKey': 'kind',
            'key': 'kind'
          },
          {
            'msgKey': 'string.last.transition',
            'resourceKey': 'lastTransition',
            'key': 'lastTransition'
          },
          {
            'msgKey': 'table.header.compliant',
            'resourceKey': 'compliant',
            'key': 'compliant'
          }
        ]
      }
    }
    const refreshControl = {
      'reloading': false,
      'refreshCookie': 'grc-refresh-interval-cookie',
      'timestamp': 'Tue Sep 24 2019 16:07:17 GMT-0400 (Eastern Daylight Time)',
      'stopPolling': jest.fn()
    }
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <ResourceDetails
              routes={['/violation', '/yaml','/compliancePolicy/:policyName/:policyNamespace']}
              updateSecondaryHeader={jest.fn()}
              tabs={['overview','violation','yaml']}
              resourceType={resourceType}
              staticResourceData={srd}
              refreshControl={refreshControl}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

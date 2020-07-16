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
import ResourceOverview from '../../../../src-web/components/common/ResourceOverview'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import * as reducers from '../../../../src-web/reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GrcApolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'

describe('ResourceOverview component', () => {
  it('renders as expected', () => {
    const item = [
      {
        'raw': {
          'apiVersion': 'policy.open-cluster-management.io/v1',
          'kind': 'Policy',
          'metadata': {
            'annotations': {
              'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
              'policy.open-cluster-management.io/controls': 'VA',
              'policy.open-cluster-management.io/standards': 'NIST',
              'seed-generation': '1'
            },
            'creationTimestamp': '2019-09-23T14:34:25Z',
            'finalizers': [
              'propagator.finalizer.mcm.ibm.com',
              'finalizer.policies.ibm.com'
            ],
            'generation': 7,
            'name': '1569249226915-policy-test',
            'namespace': 'mcm',
            'resourceVersion': '7688204',
            'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
            'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e'
          },
          'spec': {
            'complianceType': 'musthave',
            'namespaces': {
              'exclude': [
                'kube-*'
              ],
              'include': [
                'default'
              ]
            },
            'object-templates': [
              {
                'complianceType': 'musthave',
                'objectDefinition': {
                  'apiVersion': 'v1',
                  'kind': 'Namespace',
                  'metadata': {
                    'name': 'prod'
                  }
                },
                'status': {
                  'Validity': {}
                }
              }
            ],
            'remediationAction': 'inform'
          },
          'status': {
            'placementBindings': [
              'binding-1569249226915-policy-test'
            ],
            'placementPolicies': [
              'placement-1569249226915-policy-test'
            ],
            'status': {
              'cluster1': {
                'aggregatePoliciesStatus': {
                  '1569249226915-policy-test': {
                    'compliant': 'NonCompliant'
                  }
                },
                'clustername': 'cluster1',
                'compliant': 'NonCompliant'
              },
              'clusterhub': {
                'aggregatePoliciesStatus': {
                  '1569249226915-policy-test': {
                    'compliant': 'NonCompliant'
                  }
                },
                'clustername': 'clusterhub',
                'compliant': 'NonCompliant'
              }
            }
          }
        },
        'metadata': {
          'creationTimestamp': '2019-09-23T14:34:25Z',
          'name': '1569249226915-policy-test',
          'namespace': 'mcm',
          'resourceVersion': '7688204',
          'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
          'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e',
          'annotations': {
            'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
            'policy.open-cluster-management.io/controls': 'VA',
            'policy.open-cluster-management.io/standards': 'NIST',
            'seed-generation': '1'
          },
          '__typename': 'Metadata'
        },
        'annotations': {
          'categories': 'SystemAndInformationIntegrity',
          'controls': 'VA',
          'standards': 'NIST'
        },
        'placementPolicies': [
          {
            'metadata': {
              'annotations': {
                'mcm.ibm.com/user-group': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOmt1YmUtc3lzdGVtLHN5c3RlbTphdXRoZW50aWNhdGVk',
                'mcm.ibm.com/user-identity': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmRlZmF1bHQ='
              },
              'name': 'placement-1569249226915-policy-test',
              'namespace': 'mcm',
              'creationTimestamp': '2019-09-23T14:34:25Z',
              'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/placementpolicies/placement-1569249226915-policy-test',
              '__typename': 'Metadata'
            },
            'clusterLabels': {
              'matchExpressions': [
                {
                  'key': 'cloud',
                  'operator': 'In',
                  'values': [
                    'IBM'
                  ]
                }
              ]
            },
            'clusterReplicas': null,
            'resourceSelector': {},
            'status': {
              'decisions': [
                {
                  'clusterName': 'cluster1',
                  'clusterNamespace': 'cluster1'
                }
              ]
            },
            'raw': {
              'apiVersion': 'mcm.ibm.com/v1alpha1',
              'kind': 'PlacementPolicy',
              'metadata': {
                'name': 'placement-1569249226915-policy-test',
                'namespace': 'mcm',
                'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/placementpolicies/placement-1569249226915-policy-test',
                'uid': '3de387ad-de0f-11e9-a6d8-02e847915a0f',
                'resourceVersion': '188032',
                'creationTimestamp': '2019-09-23T14:34:25Z',
                'annotations': {
                  'mcm.ibm.com/user-group': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOmt1YmUtc3lzdGVtLHN5c3RlbTphdXRoZW50aWNhdGVk',
                  'mcm.ibm.com/user-identity': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmRlZmF1bHQ='
                }
              },
              'spec': {
                'resourceSelector': {},
                'clusterLabels': {
                  'matchExpressions': [
                    {
                      'key': 'cloud',
                      'operator': 'In',
                      'values': [
                        'IBM'
                      ]
                    }
                  ]
                },
                'resourceHint': {}
              },
              'status': {
                'decisions': [
                  {
                    'clusterName': 'cluster1',
                    'clusterNamespace': 'cluster1'
                  }
                ]
              }
            },
            '__typename': 'PlacementPolicy'
          }
        ],
        'placementBindings': [
          {
            'metadata': {
              'name': 'binding-1569249226915-policy-test',
              'namespace': 'mcm',
              'creationTimestamp': '2019-09-23T14:34:25Z',
              'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/placementbindings/binding-1569249226915-policy-test',
              '__typename': 'Metadata'
            },
            'placementRef': {
              'name': 'placement-1569249226915-policy-test',
              'kind': 'PlacementPolicy',
              '__typename': 'Subject'
            },
            'subjects': [
              {
                'name': '1569249226915-policy-test',
                'apiGroup': 'policy.open-cluster-management.io',
                'kind': 'Policy',
                '__typename': 'Subject'
              }
            ],
            'raw': {
              'apiVersion': 'mcm.ibm.com/v1alpha1',
              'kind': 'PlacementBinding',
              'metadata': {
                'name': 'binding-1569249226915-policy-test',
                'namespace': 'mcm',
                'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/placementbindings/binding-1569249226915-policy-test',
                'uid': '3de3a5b6-de0f-11e9-a6d8-02e847915a0f',
                'resourceVersion': '185883',
                'creationTimestamp': '2019-09-23T14:34:25Z',
                'labels': {
                  'name': 'binding-1569249226915-policy-test',
                  'placementPolicy': 'placement-1569249226915-policy-test'
                },
                'annotations': {
                  'mcm.ibm.com/user-group': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOmt1YmUtc3lzdGVtLHN5c3RlbTphdXRoZW50aWNhdGVk',
                  'mcm.ibm.com/user-identity': 'c3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmRlZmF1bHQ='
                },
                'finalizers': [
                  'propagator.finalizer.mcm.ibm.com'
                ]
              },
              'subjects': [
                {
                  'kind': 'Policy',
                  'apiGroup': 'policy.open-cluster-management.io',
                  'name': '1569249226915-policy-test'
                }
              ],
              'placementRef': {
                'name': 'placement-1569249226915-policy-test',
                'kind': 'PlacementPolicy',
                'apiGroup': 'mcm.ibm.com'
              }
            },
            '__typename': 'PlacementBinding'
          }
        ],
        'complianceStatus': [
          {
            'clusterNamespace': 'cluster1',
            'localCompliantStatus': '0/1',
            'localValidStatus': '1/1',
            'compliant': 'NonCompliant',
            '__typename': 'CompliantStatus'
          },
          {
            'clusterNamespace': 'clusterhub',
            'localCompliantStatus': '0/1',
            'localValidStatus': '1/1',
            'compliant': 'NonCompliant',
            '__typename': 'CompliantStatus'
          }
        ],
        'compliancePolicy': [
          {
            'name': '1569249226915-policy-test',
            'status': 'NonCompliant',
            'complianceName': '1569249226915-policy-test',
            'complianceNamespace': 'mcm',
            'complianceSelfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
            'roleTemplates': [],
            'roleBindingTemplates': [],
            'objectTemplates': [
              {
                'apiVersion': 'v1',
                'complianceType': 'musthave',
                'compliant': '',
                'lastTransition': '',
                'name': 'prod',
                'kind': 'Namespace',
                'validity': '[object Object]',
                'raw': {
                  'complianceType': 'musthave',
                  'objectDefinition': {
                    'apiVersion': 'v1',
                    'kind': 'Namespace',
                    'metadata': {
                      'name': 'prod'
                    }
                  },
                  'status': {
                    'Validity': {}
                  },
                  'templateType': 'object-templates'
                },
                '__typename': 'PolicyTemplate'
              }
            ],
            'policyTemplates': [],
            'detail': {
              'exclude_namespace': [
                'kube-*'
              ],
              'include_namespace': [
                'default'
              ]
            },
            'raw': {
              'apiVersion': 'policy.open-cluster-management.io/v1',
              'kind': 'Policy',
              'metadata': {
                'annotations': {
                  'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
                  'policy.open-cluster-management.io/controls': 'VA',
                  'policy.open-cluster-management.io/standards': 'NIST',
                  'seed-generation': '1'
                },
                'creationTimestamp': '2019-09-23T14:34:25Z',
                'finalizers': [
                  'propagator.finalizer.mcm.ibm.com',
                  'finalizer.policies.ibm.com'
                ],
                'generation': 7,
                'name': '1569249226915-policy-test',
                'namespace': 'mcm',
                'resourceVersion': '7688204',
                'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
                'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e'
              },
              'spec': {
                'complianceType': 'musthave',
                'namespaces': {
                  'exclude': [
                    'kube-*'
                  ],
                  'include': [
                    'default'
                  ]
                },
                'object-templates': [
                  {
                    'complianceType': 'musthave',
                    'objectDefinition': {
                      'apiVersion': 'v1',
                      'kind': 'Namespace',
                      'metadata': {
                        'name': 'prod'
                      }
                    },
                    'status': {
                      'Validity': {}
                    }
                  }
                ],
                'remediationAction': 'inform'
              },
              'status': {
                'placementBindings': [
                  'binding-1569249226915-policy-test'
                ],
                'placementPolicies': [
                  'placement-1569249226915-policy-test'
                ],
                'status': {
                  'cluster1': {
                    'aggregatePoliciesStatus': {
                      '1569249226915-policy-test': {
                        'compliant': 'NonCompliant'
                      }
                    },
                    'clustername': 'cluster1',
                    'compliant': 'NonCompliant'
                  },
                  'clusterhub': {
                    'aggregatePoliciesStatus': {
                      '1569249226915-policy-test': {
                        'compliant': 'NonCompliant'
                      }
                    },
                    'clustername': 'clusterhub',
                    'compliant': 'NonCompliant'
                  }
                }
              },
              'raw': {
                'apiVersion': 'policy.open-cluster-management.io/v1',
                'kind': 'Policy',
                'metadata': {
                  'annotations': {
                    'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
                    'policy.open-cluster-management.io/controls': 'VA',
                    'policy.open-cluster-management.io/standards': 'NIST',
                    'seed-generation': '1'
                  },
                  'creationTimestamp': '2019-09-23T14:34:25Z',
                  'finalizers': [
                    'propagator.finalizer.mcm.ibm.com',
                    'finalizer.policies.ibm.com'
                  ],
                  'generation': 7,
                  'name': '1569249226915-policy-test',
                  'namespace': 'mcm',
                  'resourceVersion': '7688204',
                  'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
                  'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e'
                },
                'spec': {
                  'complianceType': 'musthave',
                  'namespaces': {
                    'exclude': [
                      'kube-*'
                    ],
                    'include': [
                      'default'
                    ]
                  },
                  'object-templates': [
                    {
                      'complianceType': 'musthave',
                      'objectDefinition': {
                        'apiVersion': 'v1',
                        'kind': 'Namespace',
                        'metadata': {
                          'name': 'prod'
                        }
                      },
                      'status': {
                        'Validity': {}
                      }
                    }
                  ],
                  'remediationAction': 'inform'
                },
                'status': {
                  'placementBindings': [
                    'binding-1569249226915-policy-test'
                  ],
                  'placementPolicies': [
                    'placement-1569249226915-policy-test'
                  ],
                  'status': {
                    'cluster1': {
                      'aggregatePoliciesStatus': {
                        '1569249226915-policy-test': {
                          'compliant': 'NonCompliant'
                        }
                      },
                      'clustername': 'cluster1',
                      'compliant': 'NonCompliant'
                    },
                    'clusterhub': {
                      'aggregatePoliciesStatus': {
                        '1569249226915-policy-test': {
                          'compliant': 'NonCompliant'
                        }
                      },
                      'clustername': 'clusterhub',
                      'compliant': 'NonCompliant'
                    }
                  }
                }
              },
              'name': '1569249226915-policy-test',
              'namespace': 'mcm',
              'remediation': 'inform',
              'clusters': [
                'cluster1',
                'clusterhub'
              ]
            },
            '__typename': 'CompliancePolicyDetail'
          }
        ],
        'compliancePolicies': [
          {
            'name': '1569249226915-policy-test',
            'clusterCompliant': [],
            'clusterNotCompliant': [
              'cluster1',
              'clusterhub'
            ],
            'complianceName': '1569249226915-policy-test',
            'complianceNamespace': 'mcm',
            'policies': [
              {
                'name': '1569249226915-policy-test',
                'cluster': 'cluster1',
                'compliant': 'NonCompliant',
                'complianceName': '1569249226915-policy-test',
                'complianceNamespace': 'mcm',
                'valid': 'unknown',
                'enforcement': 'unknown',
                'status': 'NonCompliant',
                'raw': null,
                'metadata': {
                  'annotations': {
                    'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
                    'policy.open-cluster-management.io/controls': 'VA',
                    'policy.open-cluster-management.io/standards': 'NIST',
                    'seed-generation': '1'
                  },
                  'creationTimestamp': '2019-09-23T14:34:25Z',
                  'name': '1569249226915-policy-test',
                  'resourceVersion': '7688204',
                  'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
                  'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e',
                  '__typename': 'Metadata'
                },
                'roleTemplates': [],
                'roleBindingTemplates': [],
                'objectTemplates': [],
                'rules': [],
                'violations': [],
                '__typename': 'CompliancePolicy'
              },
              {
                'name': '1569249226915-policy-test',
                'cluster': 'clusterhub',
                'compliant': 'NonCompliant',
                'complianceName': '1569249226915-policy-test',
                'complianceNamespace': 'mcm',
                'valid': 'unknown',
                'enforcement': 'unknown',
                'status': 'NonCompliant',
                'raw': null,
                'metadata': {
                  'annotations': {
                    'policy.open-cluster-management.io/categories': 'SystemAndInformationIntegrity',
                    'policy.open-cluster-management.io/controls': 'VA',
                    'policy.open-cluster-management.io/standards': 'NIST',
                    'seed-generation': '1'
                  },
                  'creationTimestamp': '2019-09-23T14:34:25Z',
                  'name': '1569249226915-policy-test',
                  'resourceVersion': '7688204',
                  'selfLink': '/apis/policy.open-cluster-management.io/v1/namespaces/mcm/policies/1569249226915-policy-test',
                  'uid': '3dc879b5-de0f-11e9-a1ed-005056a0b88e',
                  '__typename': 'Metadata'
                },
                'roleTemplates': [],
                'roleBindingTemplates': [],
                'objectTemplates': [],
                'rules': [],
                'violations': [],
                '__typename': 'CompliancePolicy'
              }
            ],
            '__typename': 'CompliancePolicies'
          }
        ],
        'policyCompliant': '2/2',
        'clusterCompliant': '2/2',
        'clusters': [
          'cluster1',
          'clusterhub'
        ],
        '__typename': 'Compliance'
      }
    ]
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
    const resourceType = {
      'name': 'HCMCompliance',
      'list': 'HCMComplianceList'
    }
    const preloadedState = window.__PRELOADED_STATE__
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const middleware = [thunkMiddleware]
    const store = createStore(combineReducers(reducers), preloadedState, composeEnhancers(
      applyMiddleware(...middleware)
    ))
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <Provider store={store}>
          <BrowserRouter>
            <ResourceOverview
              item={item}
              staticResourceData={srd}
              params={{}}
              resourceType={resourceType}
              modules={['test']}
            />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  getPolicyCompliantStatus,
  getRemediationText,
  getStatus
} from './utils'

export default {
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
          resourceKey: 'description.title.status',
          type: 'i18n',
        },
        {
          transformFunction: (item, locale) => getStatus(item, locale, false)
        }
      ]
    },
    {
      cells: [
        {
          resourceKey: 'description.title.remediation',
          information: 'grc.remediation.tooltip',
          type: 'i18n',
        },
        {
          transformFunction: (item, locale) => getRemediationText(item, locale)
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
          transformFunction: (item, locale) => getPolicyCompliantStatus(item, locale)
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
          resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
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
          resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
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
          resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
        }
      ]
    },
    {
      cells: [
        {
          resourceKey: 'description.title.created',
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
          resourceKey: 'description.title.ansible.automation',
          type: 'automation'
        }
      ]
    },
  ]
}

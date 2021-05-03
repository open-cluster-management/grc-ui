/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */


'use strict'

import {
  buildTimestamp,
  createComplianceLink,
  getPolicyCompliantStatus,
  getAutomationLink,
} from './utils'
import {
  breakWord,
  wrappable
} from '@patternfly/react-table'
import {
  getCategories,
  getControls,
  getStandards
} from './hcm-compliances'

export default {
  tableActions: [
    'table.actions.policy.details',
    'table.actions.policy.edit',
    'table.actions.policy.disable',
    'table.actions.enforce',
    'table.actions.automation.edit',
    'table.actions.policy.remove',
  ],
  tableKeys: [
    {
      label: 'name',
      msgKey: 'table.header.policy.name',
      resourceKey: 'metadata.name',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
      transformFunction: createComplianceLink
    },
    {
      label: 'namespace',
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
    },
    {
      label: 'remediation',
      msgKey: 'table.header.remediation',
      information: 'grc.remediation.tooltip',
      resourceKey: 'remediation',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      cellTransforms: [breakWord],
    },
    {
      label: 'violations',
      msgKey: 'table.header.cluster.violation',
      resourceKey: 'clusterCompliant',
      transforms: [wrappable],
      searchable: true,
      sortable: true,
      cellTransforms: [breakWord],
      transformFunction: getPolicyCompliantStatus
    },
    {
      label: 'standards',
      msgKey: 'table.header.standards',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/standards"]',
      searchable: true,
      sortable: true,
      transforms: [wrappable],
      transformFunction: getStandards,
    },
    {
      label: 'categories',
      msgKey: 'table.header.categories',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/categories"]',
      searchable: true,
      subRow: true,
      transforms: [wrappable],
      transformFunction: getCategories,
    },
    {
      label: 'controls',
      msgKey: 'table.header.controls',
      resourceKey: 'metadata.annotations["policy.open-cluster-management.io/controls"]',
      searchable: true,
      subRow: true,
      transforms: [wrappable],
      transformFunction: getControls,
    },
    {
      label: 'automation',
      msgKey: 'table.header.automation',
      sortable: true,
      transforms: [wrappable],
      transformFunction: getAutomationLink,
    },
    {
      label: 'creation',
      msgKey: 'table.header.created',
      resourceKey: 'raw.metadata.creationTimestamp',
      sortable: true,
      transforms: [wrappable],
      transformFunction: buildTimestamp,
    },
  ],
  sortBy: {
    index: 'creation',
    direction: 'desc',
  }
}

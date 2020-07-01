/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ******************************************************************************
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { hideResourceToolbar } from '../../lib/client/resource-helper'
import { TemplateEditor } from './TemplateEditor'
import policyTemplate from './templates/policy-template.hbs'
import Choices from './templates'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

// where to put Create/Cancel buttons
const Portals = Object.freeze({
  editBtn: 'edit-button-portal-id',
  createBtn: 'create-button-portal-id',
  cancelBtn: 'cancel-button-portal-id',
})

// controlData is converted to templateData when tempplate handlebar is rendered
//  id: becomes template variable;
//  active: becomes value replacement
//  type: what type of control to prompt user
//  available: available choices
//  reverse: the yaml object to control path--if user edits yaml, what control should be updated
//  mustExist: when validating the template for creation, this value must exist
const controlData = [
  {
    name: 'creation.view.policy.name',
    id: 'name',
    type: 'text',
    active: 'policy-grc',
    reverse: 'Policy[0].metadata.name',
    mustExist: true,
  },
  {
    name: 'creation.view.policy.namespace',
    id: 'namespace',
    type: 'singleselect',
    description: 'policy.create.namespace.tooltip',
    available: [],
    reverse: 'Policy[0].metadata.namespace',
    mustExist: true,
  },
  {
    name: 'creation.view.policy.specs',
    description: 'policy.create.specs.tooltip',
    placeholder: 'creation.view.policy.select.specs',
    id: 'specs',
    type: 'multiselect',
    available: [],
    isOneSelection: true, // close dropdown on one selection--otherwise dropdown stays open
    updateNamePrefix: 'policy-', // if user hasn't typed in a custom name, update name using this selection
    reverse: ['Policy[0].spec',],
    mustExist: true,
  },
  {
    name: 'creation.view.policy.binding',
    description: 'policy.create.selectors.tooltip',
    placeholder: 'creation.view.policy.select.selectors',
    id: 'clusters',
    type: 'multiselect',
    available: [],
    reverse: 'PlacementRule[0].spec.clusterSelector', // automatically does matchLabels && matchExpressions
    mustExist: false,
  },
  {
    name: 'creation.view.policy.standards',
    description: 'policy.create.standards.tooltip',
    placeholder: 'creation.view.policy.select.standards',
    id: 'standards',
    type: 'multiselect',
    available: ['NIST', 'NIST-CSF', 'PCI', 'FISMA', 'HIPAA'],
    reverse: 'Policy[0].metadata.annotations["policy.open-cluster-management.io/standards"]',
    cacheUserValueKey: 'create.policy.standards',
  },
  {
    name: 'creation.view.policy.categories',
    description: 'policy.create.categories.tooltip',
    placeholder: 'creation.view.policy.select.categories',
    id: 'categories',
    type: 'multiselect',
    available: ['PR.PT Protective Technology','PR.DS Data Security', 'PR.AC Identity Management Authentication and Access Control', 'PR.IP Information Protection Processes and Procedures', 'DE.CM Security Continuous Monitoring'],
    reverse: 'Policy[0].metadata.annotations["policy.open-cluster-management.io/categories"]',
    cacheUserValueKey: 'create.policy.categories',
  },
  {
    name: 'creation.view.policy.controls',
    description: 'policy.create.controls.tooltip',
    placeholder: 'creation.view.policy.select.controls',
    id: 'controls',
    type: 'multiselect',
    available: ['PR.PT-1 Audit Logging','PR.PT-3 Least Functionality','PR.DS-2 Data-in-transit','PR.DS-2 Data-at-rest','PR.AC-4 Access Control', 'PR.AC-5 Network Integrity', 'PR.IP-1 Baseline Configuration', 'DE.CM-7 Monitoring for unauthorized activity','DE.CM-8 Vulnerability scans'],
    reverse: 'Policy[0].metadata.annotations["policy.open-cluster-management.io/controls"]',
    cacheUserValueKey: 'create.policy.controls',
  },
  {
    name: 'creation.view.policy.enforce',
    description: 'policy.create.enforce.tooltip',
    id: 'enforce',
    type: 'checkbox',
    active: 'inform',
    available: ['inform', 'enforce'],  // in template, 'inform'===checkbox unchecked
    reverse: 'Policy[0].spec.remediationAction',
    mustExist: true,
  },
  {
    name: 'creation.view.policy.disabled',
    description: 'policy.create.disabled.tooltip',
    id: 'disabled',
    type: 'checkbox',
    active: 'false',
    available: ['false', 'true'],
    reverse: 'Policy[0].spec.disabled',
  },
]


export default class CreationView extends React.Component {

  static propTypes = {
    createControl: PropTypes.shape({
      createResource: PropTypes.func,
      cancelCreate: PropTypes.func,
      creationStatus: PropTypes.string,
      creationMsg: PropTypes.string
    }),
    discovered: PropTypes.object,
    fetchControl: PropTypes.shape({
      isLoaded: PropTypes.bool,
      isFailed: PropTypes.bool,
    }),
  }

  render() {
    hideResourceToolbar()
    const { locale } = this.context
    const {fetchControl, createControl, discovered} = this.props
    return (
      <TemplateEditor
        template={policyTemplate}
        controlData={getControlData(discovered, locale)}
        portals={Portals}
        fetchControl={fetchControl}
        createControl={createControl}
        type={'policy'}
        locale={locale}
      />
    )
  }
}

const getControlData = (discovered, locale) => {
  if (discovered) {
    const mergedData = _.cloneDeep(controlData)

    // add preset spec choices from yaml
    const controlMap = _.keyBy(mergedData, 'id')
    Object.values(Choices).forEach(choice=>{
      const available = _.get(controlMap, `${choice.multiselect}.available`)
      if (available) {
        available.push(choice)
      }
    })

    // add discovered choices from server
    //  add available annotations to categories, etc controls
    //  add existing policy names to name control
    const {policyNames, namespaces, annotations, clusterLabels} = discovered
    const {name, namespace, clusters, standards, categories, controls } = _.keyBy(mergedData, 'id')
    name.existing = policyNames
    namespace.available = namespaces
    clusters.available = clusterLabels
    standards.available = [...new Set([...standards.available, ...annotations.standards])]
    categories.available = [...new Set([...categories.available, ...annotations.categories])]
    controls.available = [...new Set([...controls.available, ...annotations.controls])]

    // convert message keys
    mergedData.forEach(control=>{
      ['name', 'description', 'placeholder'].forEach(key=>{
        if (control[key]) {
          control[key] = msgs.get(control[key], locale)
        }
      })
    })

    return mergedData
  }
  return controlData
}

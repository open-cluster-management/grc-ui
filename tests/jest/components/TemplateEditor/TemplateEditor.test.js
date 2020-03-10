/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import {TemplateEditor} from '../../../../src-web/components/TemplateEditor'
import renderer from 'react-test-renderer'
import policyTemplate from '../../../../src-web/components/templates/policy-template.hbs'
import { shallow } from 'enzyme'
//import { existing } from '../ComponentsTestingData'


const Portals = Object.freeze({
  createBtn: 'create-button-portal-id',
  cancelBtn: 'cancel-button-portal-id',
})

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
    id: 'namespace',
    type: 'hidden',   // don't prompt for namespace--use configuration
    active: 'mcm',
    reverse: 'Policy[0].metadata.namespace',
    mustExist: true,
  },
  {
    name: 'creation.view.policy.specs',
    description: 'policy.create.specs.tooltip',
    prompt: 'creation.view.policy.select.specs',
    id: 'specs',
    type: 'multiselect',
    available: [],
    isOneSelection: true, // close dropdown on one selection--otherwise dropdown stays open
    updateNamePrefix: 'policy-', // if user hasn't typed in a custom name, update name using this selection
    reverse: [
      'Policy[0].spec.role-templates',
      'Policy[0].spec.object-templates',
      'Policy[0].spec.policy-templates'
    ],
    mustExist: true,
  },
  {
    name: 'creation.view.policy.binding',
    description: 'policy.create.selectors.tooltip',
    prompt: 'creation.view.policy.select.selectors',
    id: 'clusters',
    type: 'multiselect',
    available: [],
    reverse: 'PlacementPolicy[0].spec.clusterLabels', // automatically does matchLabels && matchExpressions
    mustExist: true,
  },
  {
    name: 'creation.view.policy.standards',
    description: 'policy.create.standards.tooltip',
    prompt: 'creation.view.policy.select.standards',
    id: 'standards',
    type: 'multiselect',
    available: ['NIST', 'PCI', 'FISMA', 'HIPAA'],
    reverse: 'Policy[0].metadata.annotations["policy.mcm.ibm.com/standards"]'
  },
  {
    name: 'creation.view.policy.categories',
    description: 'policy.create.categories.tooltip',
    prompt: 'creation.view.policy.select.categories',
    id: 'categories',
    type: 'multiselect',
    available: ['SystemAndCommunicationsProtections','SystemAndInformationIntegrity'],
    reverse: 'Policy[0].metadata.annotations["policy.mcm.ibm.com/categories"]'
  },
  {
    name: 'creation.view.policy.controls',
    description: 'policy.create.controls.tooltip',
    prompt: 'creation.view.policy.select.controls',
    id: 'controls',
    type: 'multiselect',
    available: ['MutationAdvisor','VulnerbilityAdvisor','SecretEncryption'],
    reverse: 'Policy[0].metadata.annotations["policy.mcm.ibm.com/controls"]'
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
]


describe('TemplateEditor component', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <TemplateEditor
        template={policyTemplate}
        controlData={controlData}
        portals={Portals}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('on control change function', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <TemplateEditor
        template={policyTemplate}
        controlData={controlData}
        portals={Portals}
      />
    )
    const evt = {
      target: {
        value: 'value-testing'
      },
      selectedItems: ['selectedItems-testing-1', 'selectedItems-testing-2'],
    }
    expect(wrapper.instance().onChange('name', evt)).toEqual('name')
    expect(wrapper.instance().onChange('standards', evt)).toEqual('standards')
    expect(wrapper.instance().onChange('categories', evt)).toEqual('categories')
    expect(wrapper.instance().onChange('controls', evt)).toEqual('controls')
    expect(wrapper.instance().onChange('clusters', evt)).toEqual('clusters')
    //expect(wrapper.instance().onChange('enforce', evt)).toEqual('enforce')
    // expect(wrapper.instance().onChange('specs', evt)).toEqual('specs')
  })
})

describe('on editor change function', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <TemplateEditor
        template={policyTemplate}
        controlData={controlData}
        portals={Portals}
      />
    )
    expect(wrapper.instance().handleParse()).toMatchSnapshot()
  })
})

describe('handleEditorCommand function', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <TemplateEditor
        template={policyTemplate}
        controlData={controlData}
        portals={Portals}
      />
    )
    expect(wrapper.instance().handleEditorCommand('next')).toEqual('next')
    expect(wrapper.instance().handleEditorCommand('undo')).toEqual('undo')
    expect(wrapper.instance().handleEditorCommand('redo')).toEqual('redo')
    expect(wrapper.instance().handleEditorCommand('restore')).toEqual('restore')
  })
})


describe('getResourceJSON function', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <TemplateEditor
        template={policyTemplate}
        controlData={controlData}
        portals={Portals}
      />
    )
    expect(wrapper.instance().getResourceJSON()).toEqual(null)
  })
})

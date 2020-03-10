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
import { createApplicationLink, getAppViolationLabels } from '../../../src-web/definitions/hcm-policies-application'

describe('createClusterLink', () => {
  it('Should return createClusterLink', () => {
    const item = {
      name: 'myrls1-gbapp',
      nameSpace: 'default',
    }
    expect(createApplicationLink(item)).toMatchSnapshot()
  })
  it('Should return cluster name', () => {
    const item = {
      name: 'myrls1-gbapp',
    }
    expect(createApplicationLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = {
      namnespace: 'default',
    }
    expect(createApplicationLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = {}
    expect(createApplicationLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = null
    expect(createApplicationLink(item)).toMatchSnapshot()
  })
})

describe('getAppViolationLabels', () => {
  it('Should return "-"', () => {
    const item = null
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return "-"', () => {
    const item = {}
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return "-"', () => {
    const item = {violatedPolicies: {}}
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return "-"', () => {
    const item = {violatedPolicies: []}
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return single', () => {
    const item = {
      'name': 'myrls1-gbapp',
      'nameSpace': 'default',
      'violations': 1,
      'violatedPolicies': [
        {
          'name': 'test-policy-111',
          'nameSpace': 'ibm',
          'clusters': [
            {
              'name': 'cluster-111'
            }
          ]
        }
      ]
    }
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return multi', () => {
    const item = {
      'name': 'myrls1-gbapp',
      'nameSpace': 'default',
      'violations': 2,
      'violatedPolicies': [
        {
          'name': 'test-policy-111',
          'nameSpace': 'mcm',
          'clusters': [
            {
              'name': 'cluster-111'
            }
          ]
        },
        {
          'name': 'test-policy-222',
          'nameSpace': 'ibm',
          'clusters': [
            {
              'name': 'cluster-222'
            }
          ]
        },
      ]
    }
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
  it('Should return multi', () => {
    const item = {
      'name': 'myrls1-gbapp',
      'nameSpace': 'default',
      'violations': 2,
      'violatedPolicies': [
        {
          'name': 'test-policy-111',
          'nameSpace': 'mcm',
          'clusters': [
            {
              'name': 'cluster-111'
            }
          ]
        },
        {
          'name': '',
          'nameSpace': 'mcm',
          'clusters': [
            {
              'name': 'cluster-222'
            }
          ]
        },
        {
          'name': 'test-policy-333',
          'nameSpace': 'ibm',
          'clusters': [
            {
              'name': 'cluster-333'
            }
          ]
        },
        {
          'name': {firstName: 'test-policy-444'},
          'nameSpace': 'ibm',
          'clusters': [
            {
              'name': 'cluster-444'
            }
          ]
        }
      ]
    }
    expect(getAppViolationLabels(item)).toMatchSnapshot()
  })
})

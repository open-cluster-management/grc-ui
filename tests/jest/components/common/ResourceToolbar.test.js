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
import { ResourceToolbar } from '../../../../src-web/components/common/ResourceToolbar'
import renderer from 'react-test-renderer'
import GrcApolloClient from '../../../../lib/client/apollo-client'
import { ApolloProvider } from 'react-apollo'

describe('ResourceToolbar component', () => {
  it('renders as expected', () => {
    const activeFilters = {
      'standards': [
        'HIPAA'
      ]
    }
    const availableFilters = {
      'standards': {
        'name': 'Standards',
        'availableSet': [
          'NIST',
          'FISMA',
          'PCI',
          'HIPAA'
        ]
      },
      'categories': {
        'name': 'Categories',
        'availableSet': [
          'System And Information Integrity',
          'System And Communications Protections'
        ]
      },
      'controls': {
        'name': 'Controls',
        'availableSet': [
          'VA',
          'Secret Encryption',
          'Cert Manager',
          'Mutation Advisor'
        ]
      },
      'type': {
        'name': 'Type',
        'availableSet': [
          'Enforce',
          'Inform only'
        ]
      },
      'severity': {
        'availableSet': []
      }
    }
    const location = {
      'pathname': '/multicloud/policies/policy/cluster1/1569249226915-policy-test',
      'search': '',
      'hash': '',
      'key': 'q1uagn'
    }
    const refreshControl = {
      'reloading': false,
      'refreshCookie': 'grc-refresh-interval-cookie',
      'timestamp': 'Tue Sep 24 2019 09:56:26 GMT-0400 (Eastern Daylight Time)'
    }
    const fn = jest.fn()
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <ResourceToolbar
          updateActiveFilters={fn}
          filterViewOpen={true}
          location={location}
          refreshControl={refreshControl}
          activeFilters={activeFilters}
          availableFilters={availableFilters}
        />
      </ApolloProvider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('ResourceToolbar component no filter', () => {
  it('renders as expected', () => {
    const availableFilters = {
      'standards': {
        'name': 'Standards',
        'availableSet': [
          'NIST',
          'FISMA',
          'PCI',
          'HIPAA'
        ]
      },
      'categories': {
        'name': 'Categories',
        'availableSet': [
          'System And Information Integrity',
          'System And Communications Protections'
        ]
      },
      'controls': {
        'name': 'Controls',
        'availableSet': [
          'VA',
          'Secret Encryption',
          'Cert Manager',
          'Mutation Advisor'
        ]
      },
      'type': {
        'name': 'Type',
        'availableSet': [
          'Enforce',
          'Inform only'
        ]
      },
      'severity': {
        'availableSet': []
      }
    }
    const fn = jest.fn()
    const component = renderer.create(
      <ApolloProvider client={GrcApolloClient.getGrcClient()}>
        <ResourceToolbar
          updateActiveFilters={fn}
          filterViewOpen={false}
          location={location}
          refreshControl={{}}
          activeFilters={{}}
          availableFilters={availableFilters}
        />
      </ApolloProvider>

    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

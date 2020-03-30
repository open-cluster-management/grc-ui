/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getClusterViolationLabels, getTruncatedText, createClusterLink } from '../../../src-web/definitions/hcm-policies-cluster'

describe('getTruncatedText', () => {
  it('Should return truncated text item', () => {
    const item = 'TruncateText'
    expect(getTruncatedText(item)).toMatchSnapshot()
  })
})

describe('getClusterViolationLabels', () => {
  it('Should return labels of truncated text item', () => {
    const item = {
      nonCompliant: ['nonCompliant1','nonCompliant2']
    }
    expect(getClusterViolationLabels(item)).toMatchSnapshot()
  })
})

describe('createClusterLink', () => {
  it('Should return createClusterLink', () => {
    const item = {
      cluster: 'tiny-remote',
      namespace: 'redhat',
    }
    expect(createClusterLink(item)).toMatchSnapshot()
  })
  it('Should return cluster name', () => {
    const item = {
      cluster: 'tiny-remote',
    }
    expect(createClusterLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = {
      namnespace: 'redhat',
    }
    expect(createClusterLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = {}
    expect(createClusterLink(item)).toMatchSnapshot()
  })
  it('Should return -', () => {
    const item = null
    expect(createClusterLink(item)).toMatchSnapshot()
  })
})

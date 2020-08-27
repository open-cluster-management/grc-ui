/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'
import { getHighSeverityObjTostring } from '../../../src-web/definitions/hcm-cluster-findings'

describe('getTruncatedText', () => {
  it('Should return flatten string from object', () => {
    const item = {}
    expect(getHighSeverityObjTostring(item)).toMatchSnapshot()
  })
})

describe('getTruncatedText', () => {
  it('Should return flatten string from object', () => {
    const item = {
      'cluster':'clusterhub',
      'namespace':'Excludes: [kube-*], Includes: [default]',
      'severity':'50/59',
      'highSeverity':{
        'Policy that is not compliant':50
      }
    }
    expect(getHighSeverityObjTostring(item)).toMatchSnapshot()
  })
})

describe('getTruncatedText', () => {
  it('Should return flatten string from object', () => {
    const item = {
      'cluster':'clusterhub',
      'namespace':'Excludes: [kube-*], Includes: [default]',
      'severity':'50/59',
      'highSeverity':{
        'Policy that is not compliant':50,
        'Testing':996
      }
    }
    expect(getHighSeverityObjTostring(item)).toMatchSnapshot()
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { policies, policies2, findings } from './CommonTestingData'
import { formatPoliciesToClustersTableData, formatFindingsToClustersTableData, formatExpandablePolicies } from '../../../../src-web/components/common/FormatTableData'

describe('formatPoliciesToClustersTableData', () => {
  it('should correctly format', () => {
    expect(formatPoliciesToClustersTableData(policies)).toMatchSnapshot()
  })
})

describe('formatPoliciesToClustersTableData', () => {
  it('should correctly format', () => {
    expect(formatPoliciesToClustersTableData(policies2)).toMatchSnapshot()
  })
})

describe('formatPoliciesToClustersTableData', () => {
  it('should correctly format', () => {
    expect(formatPoliciesToClustersTableData(null)).toMatchSnapshot()
  })
})

describe('formatFindingsToClustersTableData', () => {
  it('should correctly format', () => {
    expect(formatFindingsToClustersTableData(findings)).toMatchSnapshot()
  })
})

describe('formatFindingsToClustersTableData', () => {
  it('should correctly format', () => {
    expect(formatFindingsToClustersTableData(null)).toMatchSnapshot()
  })
})

describe('formatExpandablePolicies', () => {
  it('should correctly format', () => {
    expect(formatExpandablePolicies(policies)).toMatchSnapshot()
  })
})

describe('formatExpandablePolicies', () => {
  it('should correctly format', () => {
    expect(formatExpandablePolicies(null)).toMatchSnapshot()
  })
})

describe('formatExpandablePolicies', () => {
  it('should correctly format', () => {
    expect(formatExpandablePolicies([null, null])).toMatchSnapshot()
  })
})


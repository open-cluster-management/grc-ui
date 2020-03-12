/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getFindingStandards, getFindingControl, getFindingCategories, showTypeAndName, compressArray, getSeverity } from '../../../src-web/definitions/hcm-security-findings'

const item1 = {
  'securityClassification': {}
}

const item2 = {
  'securityClassification': {
    'securityStandards': [''],
    'securityCategories': [''],
    'securityControl': ''}
}

const item3 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': 'VA'}
}

const item4 = {
  'securityClassification': {
    'securityStandards': ['NIST', '', 'HIPAA'],
    'securityCategories': ['TestCaseFour', '', 'Test Case Four'],
    'securityControl': 'TestCaseFour'}
}

const item5 = {
  'context': {
    'resourceType': 'HCMPolicyList',
    'resourceName': 'HCMPolicy'
  }
}

const item6 = {
  'finding': {
    'severity': 'low'
  }
}

const item7 = {
  'finding': {
    'severity': 'high'
  }
}

const item8 = {
  'finding': {
    'severity': 'MEDIUM'
  }
}

const item9 = {
  'finding': {
    'severity': 'IBM'
  }
}

const item10 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': 'Test, VA'}
}

const item11 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': true}
}

const item12 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': []}
}

const item13 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': ['Test', 'VA']}
}

const item14 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': {}}
}

const item15 = {
  'securityClassification': {
    'securityStandards': ['NIST'],
    'securityCategories': ['SystemAndInformationIntegrity'],
    'securityControl': {'Test':'VA'}}
}

describe('getSeverity', () => {
  it('Should get severity', () => {
    expect(getSeverity({})).toMatchSnapshot()
  })

  it('Should get severity', () => {
    expect(getSeverity(null)).toMatchSnapshot()
  })

  it('Should get severity', () => {
    expect(getSeverity(item6)).toMatchSnapshot()
  })

  it('Should get severity', () => {
    expect(getSeverity(item7)).toMatchSnapshot()
  })

  it('Should get severity', () => {
    expect(getSeverity(item8)).toMatchSnapshot()
  })

  it('Should get severity', () => {
    expect(getSeverity(item9)).toMatchSnapshot()
  })
})


describe('compressArray', () => {
  it('Should compress array', () => {
    expect(compressArray([])).toMatchSnapshot()
  })

  it('Should compress array', () => {
    expect(compressArray(null)).toMatchSnapshot()
  })

  it('Should compress array', () => {
    expect(compressArray(['ibm', 'mcm', 'grc', 'cloud'])).toMatchSnapshot()
  })
})

describe('showTypeAndName', () => {
  it('Should show type and name', () => {
    expect(showTypeAndName(item5)).toMatchSnapshot()
  })

  it('Should show type and name', () => {
    expect(showTypeAndName(null)).toMatchSnapshot()
  })

  it('Should show type and name', () => {
    expect(showTypeAndName({})).toMatchSnapshot()
  })
})

describe('getFindingStandards', () => {
  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item1)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item2)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item3)).toMatchSnapshot()
  })

  it('Should return formarted FindingStandards', () => {
    expect(getFindingStandards(item4)).toMatchSnapshot()
  })
})

describe('getFindingControl', () => {
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item1)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item2)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item3)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item4)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item10)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item11)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item12)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item13)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item14)).toMatchSnapshot()
  })
  it('Should return formarted FindingControl', () => {
    expect(getFindingControl(item15)).toMatchSnapshot()
  })
})

describe('getFindingCategories', () => {
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item1)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item2)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item3)).toMatchSnapshot()
  })
  it('Should return formarted FindingCategories', () => {
    expect(getFindingCategories(item4)).toMatchSnapshot()
  })
})

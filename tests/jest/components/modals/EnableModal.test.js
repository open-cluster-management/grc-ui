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
import { shallow } from 'enzyme'
import { EnableModal } from '../../../../src-web/components/modals/EnableModal'
import { resourceModalData } from './ModalsTestingData'
import { REQUEST_STATUS } from '../../../../src-web/actions/index'

describe('DisableModal modal', () => {
  it('renders as expected', () => {
    const component = shallow(<EnableModal
      open={true}
      label={{'primaryBtn':'modal.disable-hcmpolicypolicy.heading','label':'modal.disable-hcmpolicypolicy.label','heading':'modal.disable-hcmpolicypolicy.heading'}}
      locale={'en-US'}
      resourceType={{'name':'HCMPolicyPolicy','list':'HCMPolicyPolicyList'}}
      data={resourceModalData}
      handleClose={jest.fn()}
    />)
    expect(component).toMatchSnapshot()
  })

  it('renders errors as expected', () => {
    const component = shallow(<EnableModal
      open={true}
      label={{'primaryBtn':'modal.disable-hcmpolicypolicy.heading','label':'modal.disable-hcmpolicypolicy.label','heading':'modal.disable-hcmpolicypolicy.heading'}}
      locale={'en-US'}
      resourceType={{'name':'HCMPolicyPolicy','list':'HCMPolicyPolicyList'}}
      data={resourceModalData}
      handleClose={jest.fn()}
      reqStatus={REQUEST_STATUS.ERROR}
      reqErrorMsg={'dummy error message'}
    />)
    expect(component).toMatchSnapshot()
  })

  it('handleSubmit as expected', () => {
    const component = shallow(<EnableModal
      open={true}
      label={{'primaryBtn':'modal.disable-hcmpolicypolicy.heading','label':'modal.disable-hcmpolicypolicy.label','heading':'modal.disable-hcmpolicypolicy.heading'}}
      locale={'en-US'}
      resourceType={{'name':'HCMPolicyPolicy','list':'HCMPolicyPolicyList'}}
      data={resourceModalData}
      handleClose={jest.fn()}
      handleSubmit={jest.fn()}
    />)
    component.instance().handleSubmitClick()
    expect(component).toMatchSnapshot()
  })
})

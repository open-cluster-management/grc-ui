/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { shallow } from 'enzyme'
import { DisableModal } from '../../../../src-web/components/modals/DisableModal'
import { resourceModalData } from './ModalsTestingData'
import { REQUEST_STATUS } from '../../../../src-web/actions/index'

describe('DisableModal modal', () => {
  it('renders as expected', () => {
    const component = shallow(<DisableModal
      open={true}
      label={{'primaryBtn':'string.disable.policy','label':'string.disable.policy','heading':'string.disable.policy'}}
      locale={'en-US'}
      resourceType={{'name':'HCMPolicyPolicy','list':'HCMPolicyPolicyList'}}
      data={resourceModalData}
      handleClose={jest.fn()}
    />)
    expect(component).toMatchSnapshot()
  })

  it('renders errors as expected', () => {
    const component = shallow(<DisableModal
      open={true}
      label={{'primaryBtn':'string.disable.policy','label':'string.disable.policy','heading':'string.disable.policy'}}
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
    const component = shallow(<DisableModal
      open={true}
      label={{'primaryBtn':'string.disable.policy','label':'string.disable.policy','heading':'string.disable.policy'}}
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

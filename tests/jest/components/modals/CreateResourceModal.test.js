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
import { CreateResourceModal } from '../../../../src-web/components/modals/CreateResourceModal'

describe('CreateResourceModal modal', () => {
  it('renders as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    expect(component).toMatchSnapshot()
  })
  it('handleModalOpen as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().handleModalOpen()
    expect(component.state().modalOpen).toEqual(true)
  })
  it('handleEditorChange as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().handleEditorChange('Just test')
    expect(component.state().yaml).toEqual('Just test')
  })
  it('handleNotificationClosed as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().handleNotificationClosed()
    expect(component.state().yamlParsingError).toEqual(null)
    expect(component.state().requestError).toEqual(null)
  })
  it('isSubmitDisabled as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().isSubmitDisabled()
    expect(component.state().processing).toEqual(false)
  })
  it('handleModalCancel as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().handleModalCancel()
    expect(component.state()).toMatchSnapshot()
  })
  it('handleModalSubmit as expected', () => {
    const component = shallow(<CreateResourceModal
    />)
    component.instance().handleModalSubmit()
    expect(component.state()).toMatchSnapshot()
  })
})

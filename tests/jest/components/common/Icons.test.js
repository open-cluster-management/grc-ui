/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../../../../src-web/components/common/Icons'

describe('test coponent GreenCheckCircleIcon', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <GreenCheckCircleIcon />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders tooltip as expected', () => {
    const component = renderer.create(
      <GreenCheckCircleIcon tooltip='aaaa' />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

})

describe('test coponent RedExclamationCircleIcon', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <RedExclamationCircleIcon />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders tooltip as expected', () => {
    const component = renderer.create(
      <RedExclamationCircleIcon tooltip='aaaa' />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})


describe('test coponent YellowExclamationTriangleIcon', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <YellowExclamationTriangleIcon tooltip='aaaa' />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
  it('renders tooltip as expected', () => {
    const component = renderer.create(
      <YellowExclamationTriangleIcon />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

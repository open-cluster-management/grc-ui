/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import { transform } from '../../../../lib/client/resource-helper'

const getData = (resource) =>{
  if(resource) {
    return [`${resource}1`, `${resource}2`, `${resource}3`]
  } else {
    return ''
  }
}

describe('transform function test', () => {
  it('should correctly transform timestamp', () => {
    expect(transform({target: 'Dec 4th 53248 at 3:31 AM'}, {type:'timestamp', resourceKey:'target'}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform i18n', () => {
    expect(transform({target: 'i18n'}, {type:'i18n', resourceKey:'target'}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform boolean', () => {
    expect(transform({target: 'boolean'}, {type:'boolean', resourceKey:'target'}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform function', () => {
    expect(transform({target: jest.fn()}, {type:'function', resourceKey:'target'}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform tag', () => {
    expect(transform('tag', {type:'tag', resourceKey:'target', getData}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform the rest case', () => {
    expect(transform('', {type:'tag', resourceKey:'target', getData}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform the rest case', () => {
    expect(transform('', {type:'', resourceKey:'target', getData}, 'en')).toMatchSnapshot()
  })
})

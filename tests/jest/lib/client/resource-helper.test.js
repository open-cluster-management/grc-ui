/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import { transform } from '../../../../lib/client/resource-helper'

const getData1 = (resource) =>{
  if(resource) {
    return [{name: `${resource}1`}, {name: `${resource}2`}, {name: `${resource}3`}]
  } else {
    return ''
  }
}

const getData2 = (resource) =>{
  if(resource) {
    return [{value: `${resource}1`}, {value: `${resource}2`}, {value: `${resource}3`}]
  } else {
    return ''
  }
}

const getData3 = () =>{
  return ''
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
    expect(transform('tag', {type:'tag', resourceKey:'target', getData:getData1}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform tag', () => {
    expect(transform('tag', {type:'tag', resourceKey:'target', getData:getData2}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform tag', () => {
    expect(transform('tag', {type:'tag', resourceKey:'target', getData:getData3}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform the rest case', () => {
    expect(transform('', {type:'tag', resourceKey:'target', getData:getData1}, 'en')).toMatchSnapshot()
  })
  it('should correctly transform the rest case', () => {
    expect(transform('', {type:'', resourceKey:'target', getData:getData1}, 'en')).toMatchSnapshot()
  })
})

/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import {
  userAccessSuccess,
  userAccessFailure,
  getUserAccessData,
} from '../../../src-web/actions/access'
import { accessItem } from './accessTestingData'

describe('test userAccessSuccess', () => {
  it('renders as expected', () => {
    expect(userAccessSuccess(accessItem)).toMatchSnapshot()
  })
})

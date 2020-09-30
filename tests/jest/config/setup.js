/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'cross-fetch/polyfill'
import _uniqueId from 'lodash/uniqueId'

configure({ adapter: new Adapter() })

jest.mock('../../../nls/platform.properties', () => ({
  get: jest.fn((key) => {
    const msgs = require('./platform-properties.json')
    return msgs[key]
  })
}))

// this mock lodash uniqueId for all unit testing
// will return fixed incremental id number rather than real random id number
// so unit test snapshot will not failed
jest.mock('lodash/uniqueId')
let mockId = 1
_uniqueId.mockImplementation(() => `mockLodashID-${mockId++}`)

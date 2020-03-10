/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'cross-fetch/polyfill'

configure({ adapter: new Adapter() })

jest.mock('../../../nls/platform.properties', () => ({
  get: jest.fn((key) => {
    const msgs = require('./platform-properties.json')
    return msgs[key]
  })
}))

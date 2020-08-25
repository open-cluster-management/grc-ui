/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import withAccess from '../../../../src-web/components/common/WithAccess'
import { ROLES } from '../../../../lib/shared/constants'
import React from 'react'

describe('withaccess component test', () => {
  it('renders as expected', () => {
    const child = <React.Component></React.Component>
    expect(withAccess(child, ROLES.OPERATOR)).toMatchSnapshot()
  })
})

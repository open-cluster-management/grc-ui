/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
/**
 * Functional React component that serves as a base
 * for all pages and renders the header
 */
const Page = ({ children }) =>
  <div className='page-content-container'>
    {children}
  </div>

Page.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default Page

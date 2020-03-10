/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import http from './http-util'

class LoginClient {

  logout(success_cb, error_cb) {
    const options = {
      credentials: 'same-origin',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    http.fetch(`${http.getContextRoot()}/logout/`, success_cb, error_cb, options)
  }
}

export default new LoginClient()

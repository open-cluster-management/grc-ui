/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import { schema } from 'normalizr'
import lodash from 'lodash'

export const createResourcesSchema = (attribute, uniqueKey) => {
  // to support multi cluster, use ${name}-${uniqueKey} as unique id
  return new schema.Entity('items', {},
    { idAttribute: value => `${lodash.get(value, attribute)}-${lodash.get(value, uniqueKey)}` }
  )
}

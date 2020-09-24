/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import { makeVar } from '@apollo/client'
import { GRC_REFRESH_INTERVAL_COOKIE } from '../shared/constants.js'

export const reloadingVar = makeVar(true)
export const timestampVar = makeVar()
export const startPollingFunc = makeVar()
export const stopPollingFunc = makeVar()
export const refetchFunc = makeVar()
export const refreshCookie = makeVar(GRC_REFRESH_INTERVAL_COOKIE)

export const setRefreshControl = (
  loading=true,
  timestamp=new Date().toString(),
  startPolling,
  stopPolling,
  refetch) => {
  reloadingVar(loading)
  timestampVar(timestamp)
  startPollingFunc(startPolling)
  stopPollingFunc(stopPolling)
  refetchFunc(refetch)
}

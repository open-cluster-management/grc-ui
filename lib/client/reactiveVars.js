/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import { makeVar } from '@apollo/client'

export const reloadingVar = makeVar(true)
export const timestampVar = makeVar()
export const startPollingFunc = makeVar()
export const stopPollingFunc = makeVar()
export const refetchFunc = makeVar()
export const refreshCookie = makeVar('grc-refresh-interval-cookie')

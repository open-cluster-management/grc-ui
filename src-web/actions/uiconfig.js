/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from './index'

export const uiConfigReceiveSucess = uiConfig => ({ type: Actions.UICONFIG_RECEIVE_SUCCESS, data: uiConfig })

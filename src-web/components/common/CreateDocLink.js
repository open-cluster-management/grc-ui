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

import React from 'react'
import { Button } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

const createDocLink = (locale, handleCreateResource, submitBtnTextKey, createFlag=true) => {
  const vNumber = config['ACM_VERSION']
  const rhPath = `https://access${config['env']==='development' ? '-03preprod': ''}.redhat.com/`
  const acmPath = 'documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/'
  const grcPath = `${vNumber}/html/security/security#manage-security-policies`
  const docURL = `${rhPath}${acmPath}${grcPath}`
  return (
    <div className={'button-group'}>
      {createFlag && <Button icon="add--glyph" small id='create-resource' onClick={handleCreateResource}>
        { submitBtnTextKey }
      </Button>}
      {<div className={'buttons'}>
        <button className={'bx--btn bx--btn--sm bx--btn--secondary'}>
          <a href={docURL} className={'doc-link'} target='doc' aria-describedby='launchWindow'>
            {msgs.get('button.view.doc', locale)
            }
          </a>
        </button>
      </div>}
    </div>
  )
}

export default createDocLink

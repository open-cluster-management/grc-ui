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

import React from 'react'
import { Button } from 'carbon-components-react'
// import msgs from '../../../nls/platform.properties'
// import config from '../../../lib/shared/config'

const createDocLink = (locale, handleCreateResource, submitBtnTextKey, createFlag=true) => {
  // const vNumber = config['ICP_VERSION']

  return (
    <div className={'button-group'}>
      {createFlag && <Button icon="add--glyph" small id='create-resource' onClick={handleCreateResource}>
        { submitBtnTextKey }
      </Button>}
      { //Remove doc link temporarily, to be reverted.
      /* <div className={'buttons'}>
        <button className={'bx--btn bx--btn--sm bx--btn--secondary'}>
          <a href={`https://www${config['env']==='development' ? '-03preprod': ''}.ibm.com/support/knowledgecenter/SSBS6K_${vNumber}/mcm/compliance/compliance_intro.html`} className={'doc-link'} target='doc' aria-describedby='launchWindow'>{msgs.get('button.view.doc', locale)}</a>
        </button>
      </div> */}
    </div>
  )
}

export default createDocLink

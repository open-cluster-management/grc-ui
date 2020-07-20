/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import truncate from '../../util/truncate-middle'
import _uniqueId from 'lodash/uniqueId'

resources(() => {
  require('../../../scss/textWithTruncation.scss')
})

class TruncateText extends React.PureComponent {
  static propTypes = {
    maxCharacters: PropTypes.number,
    text: PropTypes.string.isRequired,
  }

  static defaultProps ={
    maxCharacters: 35,
  }

  render() {
    const {maxCharacters, text} = this.props
    if (text.length <= maxCharacters){
      return text
    }

    return (
      <div className='policyViolations'>
        <Tooltip
          triggerClassName="textWithTruncation"
          showIcon={false}
          triggerId={_uniqueId('Tooltip')}
          text={text}
          triggerText={truncate(text, maxCharacters)} >
          {text}
        </Tooltip>
      </div>
    )
  }
}

export default TruncateText

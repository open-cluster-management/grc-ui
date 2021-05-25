/* Copyright (c) 2021 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import msgs from '../../nls/platform.properties'
import TruncateText from '../../components/common/TruncateText'
import { updateModal } from '../../actions/common'
import { POLICY_AUTOMATIONS } from '../../utils/client/queries'
import { Query } from '@apollo/client/react/components'
import {
    AcmLaunchLink
} from '@open-cluster-management/ui-components'
import {
    Button,
    Spinner,
} from '@patternfly/react-core'

import '../../scss/resource-filterbar.scss'

class AutomationButton extends React.Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { item, locale, onClickAutomation } = this.props

    return (
        <Query query={POLICY_AUTOMATIONS} variables={{ namespace: item.metadata.namespace }}>
        {( result ) => {
          const { data={policyAutomations: []} } = result
          const { loading } = result
          let found = false
          let automationName = ''
          data.policyAutomations.forEach((automation) => {
            if (automation.spec && automation.spec.policyRef === item.metadata.name) {
              found = true
              automationName = automation.metadata.name
            }
          })
          if (loading) {
            return <Spinner size='md' />
          }
          if (found) {
            return <AcmLaunchLink links={[
              {
                  id: `automationButton-${automationName}`,
                  text: <TruncateText maxCharacters={20} text={automationName} />,
                  onClick: () => {
                    onClickAutomation(item)
                  },
                  label: true,
              },
            ]}></AcmLaunchLink>
          }
          return (
            <Button
              component="a"
              variant="link"
              className="automationButton"
              onClick= {() => {
                onClickAutomation(item)
              }}
            >
              {msgs.get('table.actions.automation.configure', locale)}
            </Button>
          )
        }}
        </Query>
      )
  }
}

AutomationButton.propTypes = {
  item: PropTypes.object,
  locale: PropTypes.string,
  onClickAutomation: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => {
  const resourceTypeAuto = {
    name: 'HCMCompliance',
  }
  return {
    onClickAutomation: (data) => {
      dispatch(updateModal(
        { open: true, type: 'resource-automation', resourceTypeAuto,
          label: {
            primaryBtn: `modal.automation-${resourceTypeAuto.name.toLowerCase()}.heading`,
            label: `modal.automation-${resourceTypeAuto.name.toLowerCase()}.label`,
            heading: `modal.automation-${resourceTypeAuto.name.toLowerCase()}.heading`
          },
          data: { kind: resourceTypeAuto.name, ...data }}))
    }
  }
}

export default connect(null, mapDispatchToProps)(AutomationButton)

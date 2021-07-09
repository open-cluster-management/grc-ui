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
import { checkCreateRole } from '../../utils/CheckUserPermission'
import {
    AcmLaunchLink
} from '@open-cluster-management/ui-components'
import {
    Button,
    Spinner,
} from '@patternfly/react-core'

import '../../scss/resource-filterbar.scss'
import { createDisableTooltip } from './DisableTooltip'

class AutomationButton extends React.Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { item, locale, userAccess } = this.props
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
            return this.automationLaunch(item, automationName)
          }
          return this.automationConfigure(item, userAccess, locale)
        }}
        </Query>
      )
  }

  automationLaunch(item, automationName) {
    return (
      <AcmLaunchLink links={[
        {
            id: `automationButton-${automationName}`,
            text: <TruncateText maxCharacters={20} text={automationName} />,
            onClick: () => {
              this.props.onClickAutomation(item)
            },
            label: true,
            noIcon: true,
        },
      ]}></AcmLaunchLink>
    )
  }

  automationConfigure(item, userAccess, locale) {
    const label = 'automationButton'
    const isDisabled = !this.checkPermissions(userAccess, item.metadata.namespace)
    const configureButton = (
      <Button
        component="a"
        variant="link"
        className={label}
        tooltip={msgs.get('error.permission.disabled', locale)}
        isDisabled={isDisabled}
        onClick= {() => {
          this.props.onClickAutomation(item)
        }}
      >
        {msgs.get('table.actions.automation.configure', locale)}
      </Button>
    )
    return createDisableTooltip(isDisabled, label, locale, configureButton)
  }

  checkPermissions(access, ns) {
    // Filter for the namespace of the policy
    const accessObj = access.filter(role => role.namespace === ns)
    if (accessObj.length > 0 && accessObj[0].rules) {
      // Check for create permissions on policies
      return checkCreateRole(accessObj[0].rules) === 1
    }
    return false
  }
}

AutomationButton.propTypes = {
  item: PropTypes.object,
  locale: PropTypes.string,
  onClickAutomation: PropTypes.func,
  userAccess: PropTypes.array,
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

const mapStateToProps = (state) => {
  const userAccess = state.userAccess ? state.userAccess.access : []
  return {
    userAccess
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutomationButton)

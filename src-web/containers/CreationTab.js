/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { createResources, updateSecondaryHeader, clearRequestStatus } from '../actions/common'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Page from '../components/common/Page'
import { GRCCreation } from '../../lib/client/queries'
import CreationView from '../components/CreationView'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'

export class CreationTab extends React.Component {

  static propTypes = {
    cleanReqStatus: PropTypes.func,
    handleCreateResources: PropTypes.func,
    mutateErrorMsg: PropTypes.string,
    mutateStatus: PropTypes.string,
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, breadcrumbItems, information } = secondaryHeaderProps
    const portals = [
      {
        id: 'cancel-button-portal-id',
        kind: 'portal',
      },
      {
        id: 'create-button-portal-id',
        kind: 'portal',
      }]
    updateSecondaryHeader(msgs.get(title, this.context.locale), tabs, breadcrumbItems, portals, msgs.get(information, this.context.locale))
  }

  handleCreate = (resourceJSON) => {
    if (resourceJSON) {
      const {handleCreateResources} = this.props
      handleCreateResources(resourceJSON)
    }
  }

  handleCancel = () => {
    window.history.back()
  }

  render () {
    const { mutateStatus, mutateErrorMsg } = this.props
    if (mutateStatus && mutateStatus === 'DONE') {
      this.props.cleanReqStatus && this.props.cleanReqStatus()
      return <Redirect to={`${config.contextPath}/all`} />
    }
    return (
      <Page>
        <Query query={GRCCreation}>
          {( result ) => {
            const { loading } = result
            const { data={} } = result
            const { discoveries } = data
            const error = discoveries ? null : result.error
            const fetchControl = {
              isLoaded: !!discoveries && !loading,
              isFailed: error,
            }
            const createControl = {
              createResource: this.handleCreate.bind(this),
              cancelCreate: this.handleCancel.bind(this),
              creationStatus: mutateStatus,
              creationMsg: mutateErrorMsg,
            }
            return (
              <CreationView
                discovered={discoveries}
                fetchControl={fetchControl}
                createControl={createControl}
              />
            )
          }
          }
        </Query>
      </Page>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mutateStatus: state['HCMPolicyList'].mutateStatus,
    mutateErrorMsg: state['HCMPolicyList'].mutateErrorMsg,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links, '', information)),
    handleCreateResources: (json) => dispatch(createResources(RESOURCE_TYPES.HCM_POLICIES, json)),
    cleanReqStatus: () => dispatch(clearRequestStatus(RESOURCE_TYPES.HCM_POLICIES))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreationTab))

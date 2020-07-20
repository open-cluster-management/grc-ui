/* eslint-disable no-console */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { createResources, createAndUpdateResources, editResourceFromCreate, updateSecondaryHeader,
  clearRequestStatus, fetchSingleResource } from '../actions/common'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Page from '../components/common/Page'
import { GRCCreation } from '../../lib/client/queries'
import CreationView from '../components/CreationView'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'

export class CreationTab extends React.Component {

  constructor (props) {
    super(props)
    this.state= {
      updateRequested: false
    }
  }

  static propTypes = {
    cleanReqStatus: PropTypes.func,
    handleCreateAndUpdateResources: PropTypes.func,
    handleCreateResources: PropTypes.func,
    handleFetchResource: PropTypes.func,
    handleUpdateResource: PropTypes.func,
    mutateErrorMsg: PropTypes.string,
    mutateStatus: PropTypes.string,
    secondaryHeaderProps: PropTypes.object,
    updatePBErrorMsg: PropTypes.string,
    updatePRErrorMsg: PropTypes.string,
    updateSecondaryHeader: PropTypes.func,
    updateStatus: PropTypes.string
  }

  componentWillMount() {
    const { updateSecondaryHeader:localUpdateSecondaryHeader, secondaryHeaderProps } = this.props
    const { title, tabs, breadcrumbItems, information } = secondaryHeaderProps
    const portals = [
      {
        id: 'edit-button-portal-id',
        kind: 'portal',
        title: true,
      },
      {
        id: 'cancel-button-portal-id',
        kind: 'portal',
      },
      {
        id: 'create-button-portal-id',
        kind: 'portal',
      }]
    localUpdateSecondaryHeader(msgs.get(title, this.context.locale), tabs, breadcrumbItems, portals, msgs.get(information, this.context.locale))
  }

  handleCreate = (resourceJSON) => {
    if (resourceJSON) {
      const {handleCreateResources} = this.props
      handleCreateResources(RESOURCE_TYPES.HCM_POLICIES, resourceJSON)
    }
  }

  buildCreateUpdateLists = (resourceJSON) => {
    console.log('---- BCUL --------')
    if (resourceJSON) {
      // this.setState({ updateRequested: true })
      const { handleFetchResource } = this.props
      let plc = {}
      const pbs = []
      const prs = []
      const create = []
      const update = []
      for (let i = 0; i < resourceJSON.length; i++) {
        if (resourceJSON[i].kind === 'Policy') {
          plc = resourceJSON[i]
        } else if (resourceJSON[i].kind === 'PlacementBinding') {
          pbs.push(resourceJSON[i])
        } else if (resourceJSON[i].kind === 'PlacementRule') {
          prs.push(resourceJSON[i])
        }
      }
      handleFetchResource(RESOURCE_TYPES.HCM_POLICIES, {
        clusterName: plc.metadata.namespace,
        name: plc.metadata.name
      }).then((res) => {
        console.log('fetch plc')
        console.log(plc)
        console.log(res)
        if (res.items.policies && res.items.policies.length !== 0) {
          update.push(plc)
        } else {
          create.push(plc)
        }
      })
      handleFetchResource(RESOURCE_TYPES.PLACEMENT_BINDING, {
        pbs: pbs.map((pb => pb.metadata.name)),
      }).then((res) => {
        if (res.items.placementBindings) {
          const resPBs = {}
          res.items.placementBindings.forEach((b) => {
            resPBs[b.metadata.name] = b
          })
          console.log(resPBs)
          pbs.forEach((pb) => {
            const resPB = resPBs[pb.metadata.name]
            if (resPB) {
              pb.metadata.selfLink = resPB.metadata.selfLink
              pb.metadata.resourceVersion = resPB.metadata.resourceVersion
              update.push(pb)
            } else {
              create.push(pb)
            }
          })
        } else {
          console.log('--- fetch pb error')
        }
      })
      handleFetchResource(RESOURCE_TYPES.PLACEMENT_RULE, {
        prs: prs.map((pr => pr.metadata.name)),
      }).then((res) => {
        if (res.items.placementRules) {
          const resPRs = {}
          res.items.placementRules.forEach((r) => {
            resPRs[r.metadata.name] = r
          })
          console.log(resPRs)
          prs.forEach((pr) => {
            const resPR = resPRs[pr.metadata.name]
            if (resPR) {
              pr.metadata.selfLink = resPR.metadata.selfLink
              pr.metadata.resourceVersion = resPR.metadata.resourceVersion
              update.push(pr)
            } else {
              create.push(pr)
            }
          })
        } else {
          console.log('--- fetch pr error')
        }
      })
      return { create, update }
    } else {
      return { create: [], update: [] }
    }
  }

  handleCreateAndUpdate = (createList, updateList) => {
    this.props.handleCreateAndUpdateResources([], createList, updateList)
  }

  handleUpdate = (resourceJSON) => {
    if (resourceJSON) {
      this.setState({ updateRequested: true })
      const {handleUpdateResource, handleFetchResource, handleCreateResources} = this.props
      let plc, pb, pr = {}
      for (let i = 0; i < resourceJSON.length; i++) {
        if (resourceJSON[i].kind === 'Policy') {
          plc = resourceJSON[i]
        } else if (resourceJSON[i].kind === 'PlacementBinding') {
          pb = resourceJSON[i]
        } else if (resourceJSON[i].kind === 'PlacementRule') {
          pr = resourceJSON[i]
        }
      }
      if (plc) {
        //update policy
        handleFetchResource(RESOURCE_TYPES.HCM_POLICIES, {
          clusterName: plc.metadata.namespace,
          name: plc.metadata.name
        }).then((res) => {
          const existingPolicy = res.items.policies[0]
          plc.metadata.selfLink = existingPolicy.metadata.selfLink
          plc.metadata.resourceVersion = existingPolicy.metadata.resourceVersion
          handleUpdateResource(RESOURCE_TYPES.HCM_POLICIES, plc)
          //create/update placementbinding
          handleFetchResource(RESOURCE_TYPES.PLACEMENT_BINDING, { parent: existingPolicy.raw }).then((pbres) => {
            if (pbres.items.placementBindings.length !== 0) {
              const existingPB = pbres.items.placementBindings[0]
              pb.metadata.selfLink = existingPB.metadata.selfLink
              pb.metadata.resourceVersion = existingPB.metadata.resourceVersion
              handleUpdateResource(RESOURCE_TYPES.PLACEMENT_BINDING, pb)
            } else {
              handleCreateResources(RESOURCE_TYPES.PLACEMENT_BINDING, pb)
            }
          })
          //create/update placementrule
          handleFetchResource(RESOURCE_TYPES.PLACEMENT_RULE, { parent: existingPolicy.raw }).then((prres) => {
            if (prres.items.placementRules.length !== 0) {
              const existingPR = prres.items.placementRules[0]
              pr.metadata.selfLink = existingPR.metadata.selfLink
              pr.metadata.resourceVersion = existingPR.metadata.resourceVersion
              handleUpdateResource(RESOURCE_TYPES.PLACEMENT_RULE, pr)
            } else {
              handleCreateResources(RESOURCE_TYPES.PLACEMENT_RULE, pr)
            }
          })
        })
      }
    }
  }

  handleCancel = () => {
    this.props.cleanReqStatus && this.props.cleanReqStatus()
    window.history.back()
  }

  formatUpdateError = (m1, m2) => {
    if (m1 && m2) {
      return m1 + '; ' + m2
    } else if (m1) {
      return m1
    } else {
      return m2
    }
  }

  render () {
    const { mutateStatus, mutateErrorMsg, updatePBErrorMsg, updatePRErrorMsg, updateStatus } = this.props
    const { updateRequested } = this.state
    if ((mutateStatus && mutateStatus === 'DONE') && (!updateRequested || (updateStatus && updateStatus === 'DONE'))) {
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
            const errored = discoveries ? false : true
            const error = discoveries ? null : result.error
            if (!loading && error) {
              const errorName = result.error.graphQLErrors[0].name ? result.error.graphQLErrors[0].name : error.name
              error.name = errorName
            }
            const fetchControl = {
              isLoaded: !loading,
              isFailed: errored,
              error: error
            }
            const buildControl = {
              buildResourceLists: this.buildCreateUpdateLists.bind(this),
              // cancelCreate: this.handleCancel.bind(this),
              // creationStatus: mutateStatus,
              // creationMsg: mutateErrorMsg,
            }
            const createControl = {
              createResource: this.handleCreate.bind(this),
              cancelCreate: this.handleCancel.bind(this),
              creationStatus: mutateStatus,
              creationMsg: mutateErrorMsg,
            }
            const updateControl = {
              updateResource: this.handleUpdate.bind(this),
              cancelUpdate: this.handleCancel.bind(this),
              updateStatus,
              updateMsg: this.formatUpdateError(updatePBErrorMsg, updatePRErrorMsg)
            }
            return (
              <CreationView
                discovered={discoveries}
                fetchControl={fetchControl}
                createControl={createControl}
                updateControl={updateControl}
                buildControl={buildControl}
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
  let updateState = 'IN_PROGRESS'
  if ((state['PlacementRulesList'].mutateStatus === 'ERROR') || (state['PlacementBindingsList'].mutateStatus === 'ERROR')) {
    updateState = 'ERROR'
  } else if ((state['PlacementRulesList'].mutateStatus === 'DONE') && (state['PlacementBindingsList'].mutateStatus === 'DONE')) {
    updateState = 'DONE'
  }
  return {
    mutateStatus: state['HCMPolicyList'].mutateStatus,
    mutateErrorMsg: state['HCMPolicyList'].mutateErrorMsg,
    updatePRErrorMsg: state['PlacementRulesList'].mutateErrorMsg,
    updatePBErrorMsg: state['PlacementBindingsList'].mutateErrorMsg,
    updateStatus: updateState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links, information) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links, '', information)),
    handleCreateResources: (type, json) => dispatch(createResources(type, json)),
    handleCreateAndUpdateResources: (types, create, update) => dispatch(createAndUpdateResources(types, create, update)),
    handleFetchResource: (type, json) => dispatch(fetchSingleResource(type, json)),
    handleUpdateResource: (type, json) => {
      dispatch(editResourceFromCreate(
        type,
        json.metadata.namespace,
        json.metadata.name,
        json,
        json.metadata.selfLink))
    },
    cleanReqStatus: () => {
      dispatch(clearRequestStatus(RESOURCE_TYPES.HCM_POLICIES))
      dispatch(clearRequestStatus(RESOURCE_TYPES.PLACEMENT_RULE))
      dispatch(clearRequestStatus(RESOURCE_TYPES.PLACEMENT_BINDING))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreationTab))

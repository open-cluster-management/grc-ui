/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'
import config from '../../server/lib/shared/config'
import {
  Label,
  LabelGroup,
  Tooltip,
} from '@patternfly/react-core'
import StatusField from '../components/common/StatusField'
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '../components/common/Icons'
import TableTimestamp from '../components/common/TableTimestamp'
import msgs from '../nls/platform.properties'
import TruncateText from '../components/common/TruncateText'
import { LocaleContext } from '../components/common/LocaleContext'

// use console.log(JSON.stringify(result, circular())) to test return result from transform
export const transform = (items, def, locale) => {
  const rows = items.map(item => {
    return def.tableKeys.map(key => {
      let value = _.get(item, key.resourceKey)
      if (key.type === 'timestamp') {
        return moment.unix(value).format('MMM Do YYYY \\at h:mm A')
      } else if (key.type === 'i18n') {
        return msgs.get(key.resourceKey, locale)
      } else if (key.type === 'boolean') {
        value = (Boolean(value)).toString()
        return msgs.get(value, locale)
      } else if (key.transformFunction && typeof key.transformFunction === 'function') {
        return { title: key.transformFunction(item, locale) }
      } else {
        return (value || value === 0) ? value : '-'
      }
    })
  })

  const columns = def.tableKeys.map(key => {
    return {
      title: key.msgKey ? msgs.get(key.msgKey, locale): '',
      ...key
    }
  })

  const sortBy = def.sortBy ? def.sortBy : { index: 0, direction: 'asc' } // default if doesn't exist

  return { columns, rows, sortBy }
}

export const buildCompliantCell = (item, locale) => {
  const compliant = _.get(item, 'compliant', '-')
  if (compliant.toLowerCase() === 'compliant') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.compliant', locale)}</div>
  } else if (compliant.toLowerCase() === 'noncompliant') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.noncompliant', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  }
}

export const buildCompliantCellFromMessage = (item, locale) => {
  const message = _.get(item, 'message', '-')
  const compliant = message.split(';')[0]
  if (compliant.toLowerCase() === 'compliant') {
    return <div><GreenCheckCircleIcon /> {msgs.get('table.cell.compliant', locale)}</div>
  } else if (compliant.toLowerCase() === 'noncompliant') {
    return <div><RedExclamationCircleIcon /> {msgs.get('table.cell.noncompliant', locale)}</div>
  } else {
    return <div><YellowExclamationTriangleIcon /> {msgs.get('table.cell.nostatus', locale)}</div>
  }
}

export const buildTimestamp = (item) => {
  const createdTime = _.get(item, 'timestamp') ? _.get(item, 'timestamp') : _.get(item, 'raw.metadata.creationTimestamp')
  return <TableTimestamp timestamp={createdTime} />
}

export function buildClusterLink(item) {
  const cluster = _.get(item, 'cluster')
  if (cluster) {
    const clusterURL = `${config.clusterContextPath}/${cluster}/overview`
    return <a
      rel='noopener noreferrer'
      href={clusterURL}>
      {cluster}
    </a>
  }
  return '-'
}

export function buildStatusHistoryLink(item, locale) {
  const policyName = _.get(item, 'policyName')
  const policyNamespace = _.get(item, 'policyNamespace')
  const cluster = _.get(item, 'cluster')
  const templateName = _.get(item, 'templateName')
  if (policyName && policyNamespace && cluster && templateName) {
    const statusHistoryURL = `/multicloud/policies/all/${policyNamespace}/${policyName}/status/${cluster}/templates/${templateName}/history`
    return <Link to={statusHistoryURL}>
      {msgs.get('table.actions.view.history', locale)}
    </Link>
  }
  return '-'
}

export function buildTemplateDetailLink(item, locale) {
  const message = _.get(item, 'message')
  const policyName = _.get(item, 'policyName')
  const policyNamespace = _.get(item, 'policyNamespace')
  const cluster = _.get(item, 'cluster')
  const templateName = _.get(item, 'templateName')
  const apiVersion = _.get(item, 'apiVersion')
  const kind = _.get(item, 'kind')
  const showDetailsLink = _.get(item, 'showDetailsLink', true)
  if (message && policyName && policyNamespace && cluster && templateName && apiVersion && kind) {
    const templateDetailURL = `/multicloud/policies/all/${policyNamespace}/${policyName}/template/${cluster}/${apiVersion}/${kind}/${templateName}`
    return <div className='policy-details-message'>
      <TruncateText text={message} maxCharacters={300} textEnd={' '} />
      {showDetailsLink ?
        <Link to={templateDetailURL}>
          {msgs.get('table.actions.view.details', locale)}
        </Link>
        :
        <Tooltip content={msgs.get('error.permission.disabled', locale)}>
          <span className='link-disabled'>
            {msgs.get('table.actions.view.details', locale)}
          </span>
        </Tooltip>
      }
    </div>
  }
  return ''
}

export function statusHistoryMessageTooltip(item) {
  const message = _.get(item, 'message')
  return  <TruncateText text={message} maxCharacters={300} />
}

export function createComplianceLink(item = {}, ...param){
  let policyName = '-'
  if (param[2]) {
    policyName = item.metadata.name
  } else if (item && item.metadata)
  {
    if (_.get(item, 'raw.kind') === 'Compliance') {
      policyName = <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name} (Deprecated)</Link>
    }
    else {
      policyName = <Link to={`${config.contextPath}/all/${encodeURIComponent(item.metadata.namespace)}/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
    }
  }
  if (_.get(item, 'raw.spec.disabled')) {
    policyName = <div className='policy-table-name-ctr'>
      {policyName}{' '} {' '}
      <Label className='disabled-label'>
        {msgs.get('policy.disabled.label', LocaleContext.locale)}
      </Label>
    </div>
  }
  return policyName
}

export function getPolicyCompliantStatus(item, locale) {
  const clusterCompliant =  _.get(item, 'clusterCompliant', '-')
  const tooltip = msgs.get('table.tooltip.nostatus', locale)
  if (clusterCompliant === '-') {
    return (
      <div className='violationCell'>
        <YellowExclamationTriangleIcon tooltip={tooltip} />{clusterCompliant}
      </div>
    )
  }
  const statusArray = _.get(item, 'clusterCompliant').split('/')
  const violationCount = parseInt(statusArray[0], 10)
  const totalCount = parseInt(statusArray[1], 10)
  const unknownCount = statusArray.length === 3 ? parseInt(statusArray[2], 10) : 0
  return (
    <div className='violationCell'>
      { violationCount > 0 ?
        <RedExclamationCircleIcon tooltip={msgs.get('table.tooltip.noncompliant', locale)} /> :
        totalCount > unknownCount && <GreenCheckCircleIcon tooltip={msgs.get('table.tooltip.compliant', locale)} />}
      { unknownCount > 0 && <YellowExclamationTriangleIcon tooltip={tooltip} /> }
      {`${violationCount}/${totalCount}`}
    </div>
  )
}

export function getClusterCompliantStatus(item, locale) {
  const statusArray = _.get(item, 'violation').split('/')
  return (
    <div className='violationCell'>
      { parseInt(statusArray[0], 10) > 0 ?
        <RedExclamationCircleIcon tooltip={msgs.get('table.tooltip.noncompliant', locale)} /> :
        <GreenCheckCircleIcon tooltip={msgs.get('table.tooltip.compliant', locale)} /> }
      { parseInt(statusArray[2], 10) > 0 &&
        <YellowExclamationTriangleIcon tooltip={msgs.get('table.tooltip.nostatus', locale)} /> }
      {`${statusArray[0]}/${statusArray[1]}`}
    </div>
  )
}

export function getClusterViolationLabels(item) {
  return <TruncateText text={item.nonCompliant.join(', ')} />
}


export function getStatus(item, locale) {
  const status = _.get(item, 'status', '-')
  if (status.compliant){
    return <StatusField status={status.compliant.toLowerCase()} text={msgs.get(`policy.status.${status.compliant.toLowerCase()}`, locale)} />
  } else if (status && typeof(status)==='string' && status !== '-'){
    return <StatusField status={status.toLowerCase()} text={msgs.get(`policy.status.${status.toLowerCase()}`, locale)} />
  }
  return '-'
}

export function getCompliancePolicyStatus(item, locale) {
  if (item.clusterNotCompliant && item.clusterNotCompliant.length > 0){
    return <StatusField status='noncompliant' text={msgs.get('policy.status.noncompliant', locale)} />
  }
  return <StatusField status='compliant' text={msgs.get('policy.status.compliant', locale)} />
}

export function createCompliancePolicyLink(item = {}, ...param){
  const policyKeys = item[param[1]]
  const policyArray = []
  policyKeys && policyKeys.forEach(policyKey => {
    const targetPolicy = item.policies.find(policy => item.name === policy.name && policyKey === policy.cluster)
    policyArray.push(targetPolicy)
  })

  return policyArray.length > 0 ?
    <ul>{policyArray.map(policy => (<li key={`${policy.cluster}-${policy.name}`}>
      <Link
        to={`${config.contextPath}/all/${encodeURIComponent(policy.complianceNamespace)}/${encodeURIComponent(policy.complianceName)}/compliancePolicy/${encodeURIComponent(policy.name)}/${policy.cluster}`}>
        {policy.cluster}
      </Link>
    </li>))}</ul>
    :
    '-'
}

export function createPolicyLink(item = {}){
  return  <Link
    to={`${config.contextPath}/all/${encodeURIComponent(item.complianceNamespace)}/${encodeURIComponent(item.complianceName)}/compliancePolicy/${encodeURIComponent(item.name)}`}>
    {item.name}
  </Link>
}

export function getStatusCount(item) {
  return `${item.policyCompliant}/${item.policyTotal}`
}

export function getClusterCount(item) {
  return `${item.clusterCompliant}/${item.clusterTotal}`
}

export function getSubjects(item) {
  if(item && item.subjects){
    return item.subjects.map(subject => `${subject.name}(${subject.apiGroup})`).join(', ')
  }
  else{
    return '-'
  }
}

export function getControls(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/controls'])
}

export function getStandards(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/standards'])
}

export function getCategories(item) {
  const annotations = _.get(item, 'metadata.annotations') || {}
  return formatAnnotationString(annotations['policy.open-cluster-management.io/categories'])
}

export function formatAnnotationString(items){
  if (items) {
    return items.split(',').map(item => item.trim()).join(', ')
  }
  return '-'
}

export function getLabels(item) {
  const labels = _.get(item, 'placementPolicies[0].clusterLabels')
  if (!labels || Object.keys(labels).length===0) {
    return '-'
  }
  return _.map(labels, (value, key) => {
      return <p key={key}>{`${key}=${JSON.stringify(labels[key])}`}</p>
    })
}

// Return a count of total clusters from the placementPolicy
export function getDecisionCount(item = {}){
  const decisions = _.get(item, 'placementPolicies[0].status.decisions') || _.get(item, 'status.decisions')
  if (decisions) {
    return decisions.map(decision => decision.clusterName).length
  }
  return 0
}

// Construct a list of compliant clusters and return a formatted list with icons and headings
export function getDecisionList(policy, locale) {
  // Gather full cluster list from placementPolicy status
  const fullClusterList = _.get(policy, 'placementPolicies[0].status.decisions', [])
  // Gather status list from policy status
  const rawStatusList = _.get(policy, 'raw.status.status', [])
  // Build lists of clusters, organized by status keys
  const clusterList = {}
  _.forEach(fullClusterList, (clusterObj) => {
    const cluster = clusterObj.clusterNamespace
    const statusObject = _.filter(rawStatusList, (status) => status.clusternamespace === cluster)
    // Log error if more than one status is returned since each cluster name should be unique
    if (statusObject.length > 1) {
      console.error(`Expected one cluster but got ${statusObject.length}:`, statusObject)
    // Push a new cluster object if there is no status found
    } else if (statusObject.length === 0) {
      statusObject.push({clusternamespace: cluster})
    }
    const compliant = _.get(statusObject[0], 'compliant', 'nostatus').toLowerCase()
    const clusterNamespace = _.get(statusObject[0], 'clusternamespace')
    // Add cluster to its associated status list in the clusterList object
    if (Object.prototype.hasOwnProperty.call(clusterList, compliant)) {
      // Each cluster name should be unique, so if one is already present, log an error
      if (clusterList[compliant].has(clusterNamespace)) {
        console.error(`Unexpected duplicate cluster in '${compliant}' cluster list: ${clusterNamespace}`)
      } else {
        clusterList[compliant].add(clusterNamespace)
      }
    } else {
      clusterList[compliant] = new Set([clusterNamespace])
    }
  })
  // Push lists of clusters along with status icon, heading, and overflow badge
  const statusList = []
  for (const status of Object.keys(clusterList)) {
    const statusMsg = msgs.get(`table.cell.${status}`, locale)
    statusList.push(
      <div key={`${status}-status-container`} className='status-container'>
        <span key={`${status}-status-heading`} className='status-heading'>
          <StatusField status={status} text={`${statusMsg}: `} />
        </span>
        <span key={`${status}-status-list`} className={`status-list status-list__${status}`}>
          <LabelGroup
            collapsedText='${remaining} more'
            expandedText='Show less'
            numLabels='5'
          >
            {Array.from(clusterList[status]).map((cluster, index) =>{
                // If there's no status, there's no point in linking to the status page
                let href=null, color='grey'
                if (status !== 'nostatus') {
                  href=`${config.contextPath}/all/${policy.metadata.namespace}/${policy.metadata.name}/status?clusterFilter=${cluster}&index=0`
                  color='blue'
                } else {
                  href=`${config.contextPath}/all/${policy.metadata.namespace}/${policy.metadata.name}`
                }
                // Return links to status page, filtered by selected cluster
                return (<span key={`${cluster}-link`}>
                  <Label
                    key={`${cluster}-link`}
                    color={color}
                    variant='outline'
                    render={({
                        className,
                        content,
                        componentRef
                      })=>
                        <Link to={href} className={className} innerRef={componentRef}>
                          {content}{index < clusterList[status].size - 1 && ', '}
                        </Link>
                    }
                  >
                    {cluster}
                  </Label>
                </span>)
              })
            }
          </LabelGroup>
        </span>
      </div>
    )
  }
  // If there are no clusters, return a hyphen
  if (statusList.length === 0) {
    return '-'
  }
  return statusList
}

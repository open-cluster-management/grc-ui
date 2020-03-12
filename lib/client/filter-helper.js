/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import msgs from '../../nls/platform.properties'
import _ from 'lodash'

/*
* UI helpers to help with data transformations
* */

export const GrcFilterTypes = Object.freeze({
  standards: 'standards',
  categories: 'categories',
  controls: 'controls',
  type: 'type',
  severity: 'severity',
})

export function fieldTypeToArray(items) {
  switch (typeof items) {
  case 'string':
    items = items.split(',')
    break
  case 'object':
    items = Array.isArray(items) ? items : JSON.stringify(items).split(',')
    break
  default:
    items = []
    break
  }
  return items
}

export const getAvailableGrcFilters = (policies, findings, locale) => {
  // initialize filter
  const filters = {}
  const displayType = location.pathname.split('/').pop()
  const showSeverityFilter = displayType.toLowerCase() === 'findings'
  const showTypeFilter = displayType.toLowerCase() !== 'findings'
  Object.keys(GrcFilterTypes).forEach(type=>{
    let name
    let availableSet=new Set()
    switch (type) {
    case GrcFilterTypes.standards:
      name = msgs.get('policy.filter.category.standards', locale)
      break
    case GrcFilterTypes.categories:
      name = msgs.get('policy.filter.category.categories', locale)
      break
    case GrcFilterTypes.controls:
      name = msgs.get('policy.filter.category.controls', locale)
      break
    case GrcFilterTypes.type:
      if (showTypeFilter) {
        name = msgs.get('policy.filter.category.type', locale)
        availableSet=new Set([
          msgs.get('policy.filter.category.type.enforce', locale),
          msgs.get('policy.filter.category.type.inform', locale)
        ])
      }
      break
    case GrcFilterTypes.severity:
      if (showSeverityFilter) {
        name = msgs.get('finding.filter.category.severity', locale)
        availableSet=new Set([
          _.startCase(msgs.get('finding.filter.category.severity.high', locale)),
          _.startCase(msgs.get('finding.filter.category.severity.medium', locale)),
          _.startCase(msgs.get('finding.filter.category.severity.low', locale))
        ])
      }
      break
    }
    filters[type] ={
      name, availableSet
    }
  })

  // loop thru policies adding available filters
  if (policies) {
    policies.map(policy=>{
      Object.keys(GrcFilterTypes).forEach(filterType=>{
        let types=''
        const filter = filters[filterType]
        const annotations = _.get(policy, 'metadata.annotations', {}) || {}
        switch (filterType) {
        case GrcFilterTypes.standards:
          types = annotations['policy.mcm.ibm.com/standards'] || ''
          break
        case GrcFilterTypes.categories:
          types = annotations['policy.mcm.ibm.com/categories'] || ''
          break
        case GrcFilterTypes.controls:
          types = annotations['policy.mcm.ibm.com/controls'] || ''
          break
        }
        if (filterType!==GrcFilterTypes.severity && filterType!==GrcFilterTypes.type && types.length===0) {
          types=msgs.get('overview.grc.overview.other', locale)
        }
        types.split(',').forEach(type=>{
          type=type.trim()
          if (type) {
            let name = type
            if (filterType===GrcFilterTypes.categories || filterType===GrcFilterTypes.controls || filterType===GrcFilterTypes.standards) {
              name = _.startCase(name)
            }
            filter.availableSet.add(name)
          }
        })
      })
    })
  }

  if (findings) {
    findings.map(finding=>{
      Object.keys(GrcFilterTypes).forEach(filterType=>{
        let types=[]
        const filter = filters[filterType]
        switch (filterType) {
        case GrcFilterTypes.standards:
          types = fieldTypeToArray(_.get(finding, 'securityClassification.securityStandards',[]))
          break
        case GrcFilterTypes.categories:
          types = fieldTypeToArray(_.get(finding, 'securityClassification.securityCategories',[]))
          break
        case GrcFilterTypes.controls:
          types = fieldTypeToArray(_.get(finding, 'securityClassification.securityControl',''))
          break
        }
        //also need to set 'Other' for each empty element of array type
        types.forEach((type, index)=>{
          if (filterType!==GrcFilterTypes.severity && filterType!==GrcFilterTypes.type && type.length===0) {
            return types[index]=msgs.get('overview.grc.overview.other', locale)
          }
        })

        types.forEach(type=>{
          type=type.trim()
          if (type) {
            let name = type
            if (filterType===GrcFilterTypes.categories || filterType===GrcFilterTypes.controls || filterType===GrcFilterTypes.standards) {
              name = _.startCase(name)
            }
            filter.availableSet.add(name)
          }
        })
      })
    })
  }
  return filters
}

export const filterFindings = (findings, activeFilters, locale) => {
  if (Array.isArray(findings)) {
    return findings.filter(finding => {
      return Object.keys(GrcFilterTypes).every(filterType=>{
        const activeSet = activeFilters[filterType]
        if (activeSet && activeSet.size>0) {
          let types=[]
          switch (filterType) {
          case GrcFilterTypes.standards:
            types = fieldTypeToArray(_.get(finding, 'securityClassification.securityStandards',[]))
            break
          case GrcFilterTypes.categories:
            types = fieldTypeToArray(_.get(finding, 'securityClassification.securityCategories',[]))
            break
          case GrcFilterTypes.controls:
            types = fieldTypeToArray(_.get(finding, 'securityClassification.securityControl',''))
            break
          case GrcFilterTypes.severity:
            types = fieldTypeToArray(_.get(finding, 'finding.severity',''))
            break
          }
          if (filterType!==GrcFilterTypes.type && types.length===0) {
            types = fieldTypeToArray(msgs.get('overview.grc.overview.other', locale))
          }
          return types.some(type=>{
            type=type.trim()
            if (type) {
              let name = type
              if (filterType===GrcFilterTypes.categories || filterType===GrcFilterTypes.controls || filterType===GrcFilterTypes.standards) {
                name = _.startCase(name)
              } else if (filterType===GrcFilterTypes.severity) {
                name = _.startCase(name.toLowerCase())
              }
              return activeSet.has(name)
            }
          })
        }
        return true
      })
    })
  }
  else {
    return []
  }
}

export const filterPolicies = (policies, activeFilters, locale, annotationsPath) => {
  if (Array.isArray(policies)) {
    return policies.filter(policy => {
      return Object.keys(GrcFilterTypes).every(filterType=>{
        const activeSet = activeFilters[filterType]
        if (activeSet && activeSet.size>0) {
          let types=''
          const annotations = _.get(policy, annotationsPath) || {}
          switch (filterType) {
          case GrcFilterTypes.standards:
            types = annotations['policy.mcm.ibm.com/standards'] || ''
            break
          case GrcFilterTypes.categories:
            types = annotations['policy.mcm.ibm.com/categories'] || ''
            break
          case GrcFilterTypes.controls:
            types = annotations['policy.mcm.ibm.com/controls'] || ''
            break
          case GrcFilterTypes.type:
            types = policy.remediation.toLowerCase() === 'enforce' ?
              msgs.get('policy.filter.category.type.enforce', locale) :
              msgs.get('policy.filter.category.type.inform', locale)
            break
          }
          if (filterType!==GrcFilterTypes.type && types.length===0) {
            types=msgs.get('overview.grc.overview.other', locale)
          }
          return types.split(',').some(type=>{
            type=type.trim()
            if (type) {
              let name = type
              if (filterType===GrcFilterTypes.categories || filterType===GrcFilterTypes.controls || filterType===GrcFilterTypes.standards) {
                name = _.startCase(name)
              }
              return activeSet.has(name)
            }
          })
        }
        return true
      })
    })
  }
  else {
    return []
  }
}

//pollInterval is stored in localStorage
//for storing view state, sessionStorage is better
export const getSavedGrcState = (cookie) => {
  let state = {}
  const savedState = sessionStorage.getItem(cookie)
  if (savedState) {
    try {
      state = JSON.parse(savedState)
    } catch (e) {
      //
    }
  }
  return state
}

export const saveGrcState = (cookie, state) => {
  sessionStorage.setItem(cookie, JSON.stringify(state))
}

export const deleteGrcState = (cookie) => {
  sessionStorage.removeItem(cookie)
}

export const replaceGrcState = (cookie, state) => {
  deleteGrcState(cookie)
  saveGrcState(cookie, state)
}

export const saveGrcStatePair = (cookie, key, value) => {
  const state = getSavedGrcState(cookie)
  state[key] ? state[key] = new Set(state[key]) : state[key] = new Set()
  state[key].add(value)
  saveGrcState(cookie, state)
}

export const combineResourceFilters = (activeFilters, storedFilters, availableGrcFilters) => {
  if (activeFilters) {
    //step 1 : if storedFilters, get activeFilters = (activeFilters ∪ storedFilters)
    if (storedFilters) {
      Object.keys(storedFilters).forEach(key=>{
        if (storedFilters[key]) {
          storedFilters[key] = _.without(storedFilters[key], undefined, null) // check null value from storedFilters
          if (storedFilters[key].length > 0) {//storedFilters[key] is Array
            let activeSet
            // check null value from activeFilters
            activeFilters[key] ? activeSet = activeFilters[key] = new Set(_.without(activeFilters[key], undefined, null)) : activeSet = activeFilters[key] = new Set()
            storedFilters[key].forEach(member=>{
              activeSet.add(member)
            })
          }
          else {//this is an empty set in storedFilters
            if (activeFilters[key]) {
              activeFilters[key] = new Set(_.without(activeFilters[key], undefined, null))
              if (activeFilters[key].size === 0) {
                delete activeFilters[key] // if existing, remove same empty set from activeFilters
              }
            }
          }
        }
      })
    }

    //step 2 : if availableGrcFilters, get activeFilters = (activeFilters ∩ availableGrcFilters)
    if (availableGrcFilters) {
      Object.keys(activeFilters).forEach(key=>{
        activeFilters[key].forEach(member=>{
          if (!(availableGrcFilters[key] && availableGrcFilters[key].availableSet && availableGrcFilters[key].availableSet.has(member))) {
            activeFilters[key].delete(member) //remove filters which isn't in availableGrcFilters
          }
        })
      })
    }
  }

  //if step 1 && step 2 are true, final activeFilters = ((activeFilters ∪ storedFilters) ∩ availableGrcFilters)
  //if step 1 = true but step 2 = false, final activeFilters = (activeFilters ∪ storedFilters)
  //if step 1 = false but step 2 = true, final activeFilters = (activeFilters ∩ availableGrcFilters)
  return activeFilters
}


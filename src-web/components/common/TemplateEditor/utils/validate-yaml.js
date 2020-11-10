
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
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

export function validateYAML(parsed, controlData, exceptions, locale) {
  if (exceptions.length===0) {
    controlData.forEach(control=>{
      const {type, reverse, mustExist} = control
      if (reverse && mustExist) {
        switch (type) {
        case 'text':
        case 'hidden':
          validateTextControl(reverse, parsed, exceptions, locale)
          break
        case 'checkbox':
          validateCheckboxControl(control, reverse, parsed, exceptions, locale)
          break
        case 'singleselect':
          validateSingleSelectControl(control, reverse, parsed, exceptions, locale)
          break
        case 'multiselect':
          validateMultiSelectControl(control, reverse, parsed, exceptions, locale)
        }
      }
    })
  }
}

const validateTextControl = (reverse, parsed, exceptions, locale) => {
  if (!_.get(parsed, reverse[0])) {
    addException(reverse[0].split('.'), parsed, exceptions, locale)
  }
}

const validateSingleSelectControl =  (control, reverse, parsed, exceptions, locale) => {
  const active = _.get(parsed, reverse[0])
  const path = reverse[0].split('.')
  if (!active) {
    addException(path, parsed, exceptions, locale)
  } else if (_.indexOf(_.get(control, 'available'), active) === -1){
    exceptions.push({
      row: getRow(path, parsed),
      column: 0,
      text: msgs.get('validation.bad.value', [active, _.get(control, 'available')], locale),
      type: 'error',
    })
  }
}

const validateCheckboxControl = (control, reverse, parsed, exceptions, locale) => {
  const active = _.get(parsed, reverse[0])
  const path = reverse[0].split('.')
  if (!active) {
    addException(path, parsed, exceptions, locale)
  }
  const {available} = control
  if (available.indexOf(active)===-1) {
    exceptions.push({
      row: getRow(path, parsed),
      column: 0,
      text: msgs.get('validation.bad.value', [getKey(path), available.join(', ')], locale),
      type: 'error',
    })
  }
}

const validateMultiSelectControl = (control, reverse, parsed, exceptions, locale) => {
  const {hasLabels, hasReplacements} = control
  if (hasLabels) {
    validateMultiSelectLabelControl(control, reverse, parsed, exceptions, locale)
  } else if (hasReplacements) {
    validateMultiSelectReplacementControl(control, reverse, parsed, exceptions, locale)
  } else {
    validateTextControl(reverse, parsed, exceptions, locale)
  }
}

const validateMultiSelectLabelControl = (control, reverse, parsed, exceptions, locale) => {
  const matchLabels = _.get(parsed, `${reverse[0]}.matchLabels`)
  const matchExpressions = _.get(parsed, `${reverse[0]}.matchExpressions`)
  if (!matchLabels && !matchExpressions) {
    const path = reverse[0].split('.')
    addException(path, parsed, exceptions, locale)
  }
}

const validateMultiSelectReplacementControl = (control, reverse, parsed, exceptions, locale) => {
  const hasOne = reverse.some(path=>{
    return !!_.get(parsed, path)
  })
  if (!hasOne) {
    addException(reverse[0].split('.'), parsed, exceptions, locale)
  }
}

const addException = (path, parsed, exceptions, locale) => {
  let exceptionAdded = false
  do {
    const lastPop = path.pop()
    if (!!_.get(parsed, path.join('.')) || path.length<=1) {

      // create exception
      path.push(lastPop)
      exceptions.push({
        row: getRow(path, parsed),
        column: 0,
        text: msgs.get('validation.missing.resource', [getKey(path)], locale),
        type: 'error',
      })
      exceptionAdded=true
    }
  } while (!exceptionAdded)
}

const getKey = (path) => {
  return path.join('.').replace('.$raw', '').replace('[0]', '')
}

const getRow = (path, parsed) => {
  const pathBase = path.shift()
  path.shift()
  path = (path.length>0 ? pathBase + `.$synced.${path.join('.$v.')}` : pathBase).split('.')
  let synced
  do {
    synced = _.get(parsed, path.join('.'))
    path.pop()
  } while (path.length>0 && (synced===undefined || synced.$r===undefined))
  return synced ? synced.$r+1 : 0
}


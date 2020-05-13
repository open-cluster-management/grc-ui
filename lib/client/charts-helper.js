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

import client from '../../lib/shared/client'

export const inflateKubeValue = value => {
  const match = value.match(/\D/g)
  if (match) {
    // if value has suffix
    const unit = match.join('')
    const val = value.match(/\d+/g).map(Number)[0]
    const BINARY_PREFIXES = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
    const SI_PREFIXES = ['m', 'k', 'M', 'G', 'T', 'P', 'E' ]
    const num = unit && unit.length === 2 ? factorize(BINARY_PREFIXES, unit, 'binary') : factorize(SI_PREFIXES, unit, 'si')
    return val * num
  }
  return parseFloat(value)
}

function factorize(prefixes, unit, type) {
  let localFactorize = 1
  for (let index = 0; index < prefixes.length; index++) {
    if (unit === prefixes[index]) {
      const base = type === 'binary' ? 1024 : 1000
      const exponent = type === 'binary' ? (index + 1) : (unit === 'm' ? -1 : index)
      localFactorize = Math.pow(base, exponent)
    }
  }
  return localFactorize
}

export const deflateKubeValue = (size, locale, decimals, threshold, multiplier, units) => {
  size = size || 0
  if (decimals === null) {
    decimals = 2
  }
  threshold = threshold || 800 // Steps to next unit if exceeded
  multiplier = multiplier || 1024
  units = units || locale === 'fr' ? ['', 'Kio', 'Mio', 'Gio', 'Tio', 'Pio'] : ['', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

  let localFactorize = 1, unitIndex

  for (unitIndex = 0; unitIndex < units.length; unitIndex++) {
    if (unitIndex > 0) {
      localFactorize = Math.pow(multiplier, unitIndex)
    }

    if (size < multiplier * localFactorize && size < threshold * localFactorize) {
      break
    }
  }

  if (unitIndex >= units.length) {
    unitIndex = units.length - 1
  }

  let fileSize = size / localFactorize

  fileSize = client ? new Intl.NumberFormat(locale).format(fileSize.toFixed(decimals)) : fileSize.toFixed(decimals)

  // This removes unnecessary 0 or . chars at the end of the string/decimals
  if (fileSize.indexOf('.') > -1) {
    fileSize = fileSize.replace(/\.?0*$/, '')
  }

  return {size: parseFloat(fileSize), units: units[unitIndex]}
}

export const getPercentage = (value, total) => {
  return Math.floor(100 * value / total) || 0
}

export const getTotal = data => {
  return data.reduce((acc, item) => {
    return acc + item.value
  }, 0)
}

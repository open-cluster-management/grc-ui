/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

export default function reactToString(element) {
  if (!element) {
    return ''
  }

  if (typeof element === 'string') {
    return element
  }

  if (typeof element === 'number') {
    return String(element)
  }

  if (Array.isArray(element)) {
    return element.map(subElement => reactToString(subElement)).join('')
  }

  if (element.props && element.props.children) {
    return reactToString(element.props.children)
  }

  if (element.props && !element.props.children) {
    return ''
  }

  return ''
}

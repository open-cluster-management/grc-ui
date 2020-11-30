/* Copyright (c) 2020 Red Hat, Inc. */
export const getOpt = (opts, key, defaultValue) => {
  if (opts && opts[key]) {
    return opts[key]
  }
  return defaultValue
}

// create an unique resource name
export const formatResourceName = name => {
  if (Cypress.env('RESOURCE_ID') && (!name.endsWith(Cypress.env('RESOURCE_ID'))))
    name = `${name}-${Cypress.env('RESOURCE_ID')}`

  return name
}

/* Copyright (c) 2020 Red Hat, Inc. */
export const getOpt = (opts, key, defaultValue) => {
  if (opts && opts[key]) {
    return opts[key]
  }
  return defaultValue
}

// create an unique resource name
export const getUniqueResourceName = (name, time) => {
  let uName = name
  if (time) {
    uName = `${name}_${time}`
  } else if (Cypress.env('RESOURCE_ID') && (!name.endsWith(Cypress.env('RESOURCE_ID')))) {
    uName = `${name}_${Cypress.env('RESOURCE_ID')}`
  }

  return uName
}

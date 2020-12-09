/* Copyright (c) 2020 Red Hat, Inc. */
/// <reference types="cypress" />
var apiUrl = (Cypress.config().baseUrl && typeof Cypress.config().baseUrl === 'string')
  ? `${Cypress.config().baseUrl.replace('multicloud-console.apps', 'api')}:6443`
  : ''

export const oauthIssuer = (token) => {
  return cy.request({
    url: apiUrl + '/.well-known/oauth-authorization-server',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then(resp => {
    return resp.body['issuer']
  })
}

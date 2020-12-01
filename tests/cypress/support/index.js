/* Copyright (c) 2020 Red Hat, Inc. */
import './commands'
require('cypress-terminal-report/src/installLogsCollector')()

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

before(() => {
  cy.clearCookies()
  cy.login()
  cy.goToGRCPage()
})

beforeEach(() => {
  Cypress.Cookies.preserveOnce('acm-access-token-cookie', '_oauth_proxy', 'XSRF-TOKEN', '_csrf')
})

after(()=> {
  cy.logout()
  cy.clearCookies()
})

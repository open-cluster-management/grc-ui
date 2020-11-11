/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
/// <reference types="cypress" />
// This is the demo test
describe('Login', function() {
  before(function() {
    cy.login()
  })
  after(function() {
    cy.logout()
  })
  it('should load the home page', function() {
    cy.get('#header').should('exist')
  })
})
      
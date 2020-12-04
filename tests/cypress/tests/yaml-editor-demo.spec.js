/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

describe('YAML editor demo', () => {

  it ('can test YAML editor content', () => {
    cy.visit('/multicloud/policies/create')
    //cy.YAMLeditor("inmemory://model/1").invoke('getValue').should('contain', 'apiVersion: policy.open-cluster-management.io/v1')
      .toggleYAMLeditor('On')
      .YAMLeditor()
      .invoke('getValue')
      .should('contain', 'apiVersion: policy.open-cluster-management.io/v1')
      .toggleYAMLeditor('Off')
      //.wait(1000)  // just to give user a time to observe the change
      .toggleYAMLeditor()
      .YAMLeditor()
      .invoke('setValue', 'foo: bar')
      //.wait(1000)  // just to give user a time to observe the change

    cy.visit('multicloud/clusters/create/ocp')
      .toggleYAMLeditor('On')
      .YAMLeditor()
      .invoke('getValue')
      .should('contain', 'apiVersion: hive.openshift.io/v1')
  })

})

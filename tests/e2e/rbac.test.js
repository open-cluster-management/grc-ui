/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */

let page, loginPage, lastTest = false

module.exports = {
  '@disabled': false,

  before: (browser) => {
    page = browser.page.RbacPage()
    loginPage = browser.page.LoginPage()
  },

  beforeEach: (browser) => {
    loginPage.navigate()
  },

  afterEach: (browser) => {
    if (!lastTest) {
      loginPage.logout()
    }
  },

  'Cluster-wide cluster-admin user': (browser) => {
    loginPage.authenticate('e2e-cluster-admin-cluster')
  },

  'Cluster-wide admin user': (browser) => {
    loginPage.authenticate('e2e-admin-cluster')
  },

  'Cluster-wide edit user': (browser) => {
    loginPage.authenticate('e2e-edit-cluster')
  },

  'Cluster-wide view user': (browser) => {
    loginPage.authenticate('e2e-view-cluster')
  },

  'Cluster-wide view user in a group': (browser) => {
    loginPage.authenticate('e2e-group-cluster')
  },

  'Namespaced cluster-admin user': (browser) => {
    loginPage.authenticate('e2e-cluster-admin-ns')
  },

  'Namespaced admin user': (browser) => {
    loginPage.authenticate('e2e-admin-ns')
  },

  'Namespaced edit user': (browser) => {
    loginPage.authenticate('e2e-edit-ns')
  },

  'Namespaced view user': (browser) => {
    loginPage.authenticate('e2e-view-ns')
  },

  'Namespaced view user in a group': (browser) => {
    lastTest = true
    loginPage.authenticate('e2e-group-ns')
  }

}

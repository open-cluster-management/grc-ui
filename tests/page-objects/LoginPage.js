/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = require('../../config')

module.exports = {
  url: function () {
    return `${this.api.launchUrl}${config.get('contextPath')}`
  },
  elements: {
    userSelect: 'a.idp:nth-of-type(2)',
    username: '#inputUsername',
    password: '#inputPassword',
    submit: 'button[type="submit"]',
    error: '.bx--inline-notification--error',
    header: '.app-header',
  },
  commands: [{
    inputUsername,
    inputPassword,
    submit,
    authenticate,
    waitForLoginSuccess,
    waitForUserSelectLoad
  }]
}

//helper for other pages to use for authentication in before() their suit
function authenticate(user, password) {
  this.waitForUserSelectLoad()
  this.waitForElementPresent('@username')
  this.inputUsername(user)
  this.inputPassword(password)
  this.submit()
  this.waitForLoginSuccess()
}

function inputUsername(user) {
  this.waitForElementPresent('@username')
    .setValue('@username', user || process.env.SELENIUM_USER )
}

function inputPassword(password) {
  this.waitForElementPresent('@password')
    .setValue('@password', password || process.env.SELENIUM_PASSWORD )
}

function submit() {
  this.waitForElementPresent('@submit')
    .click('@submit')
}

function waitForLoginSuccess() {
  this.waitForElementPresent('@header', 20000)
}

function waitForUserSelectLoad() {
  this.waitForElementPresent('@userSelect')
    .click('@userSelect')
    .waitForElementNotPresent('@userSelect')
}

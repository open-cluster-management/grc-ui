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
    userSelect: 'a.idp:nth-of-type(1)',
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
  this.waitForElementPresent('@header')
}

function waitForUserSelectLoad() {
  const specialSelect = 'a.idp'
  this.api.elements('css selector', specialSelect, res => {
    if (res.status < 0 || res.value.length < 1) {
      return
    }
    else{
      if(process.env.SELENIUM_USER_SELECT === undefined){
        throw new Error('export UI user to be selected as SELENIUM_USER_SELECT')
      }
      const userSelector = `a.idp[title="Log in with ${process.env.SELENIUM_USER_SELECT}"]`
      this.waitForElementPresent(userSelector)
      this.click(userSelector)
    }
  })
}

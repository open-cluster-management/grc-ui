/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')

module.exports = {
  url: function () {
    return `${this.api.launchUrl}${config.get('contextPath')}`
  },
  elements: {
    username: '#inputUsername',
    password: '#inputPassword',
    submit: 'button[type="submit"]',
    error: '.bx--inline-notification--error',
    header: '.app-header',
    loginPage: 'form[action="/login"]'
  },
  commands: [{
    inputUsername,
    inputPassword,
    submit,
    authenticate,
    waitForLoginSuccess,
    waitForLoginPageLoad
  }]
}

//helper for other pages to use for authentication in before() their suit
function authenticate(user, password) {
  this.waitForLoginPageLoad()
  this.inputUsername(user)
  this.inputPassword(password)
  this.submit()
  this.waitForLoginSuccess()
}

function inputUsername(user) {
  // eslint-disable-next-line no-console
  console.log('Please export UI user/password as SELENIUM_USER/SELENIUM_PASSWORD')
  this.waitForElementVisible('@username')
    .setValue('@username', user || process.env.SELENIUM_USER )
}

function inputPassword(password) {
  this.waitForElementVisible('@password')
    .setValue('@password', password || process.env.SELENIUM_PASSWORD )
}

function submit() {
  this.waitForElementVisible('@submit')
    .click('@submit')
}

function waitForLoginSuccess() {
  this.waitForElementVisible('@header', 20000)
}

function waitForLoginPageLoad() {
  this.waitForElementVisible('@loginPage')
}

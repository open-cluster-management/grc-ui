/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
const parser = require('../utils/yamlHelper')

module.exports = {
  elements: {
    spinner: '.content-spinner',
    table: '.bx--data-table-v2',
    tableExpandBtn: '.bx--table-expand-v2__button:nth-of-type(1)',
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '#create-button-portal-id',
    yamlMonacoEditor: '.monaco-editor',
    searchInput: '#search',
    searchInputClear: '#search ~ .bx--search-close',
    overflowButton: '.bx--overflow-menu:nth-of-type(1)',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyStatus: '#complianceStatus-module-id',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    enforce: '.creation-view-controls-checkbox > div.bx--form-item.bx--checkbox-wrapper',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu',
    summaryCollapse: 'button.collapse > span.collapse-button',
    summaryInfoContainer: 'div.module-grc-cards > div.card-container-container',
    summaryDropdown: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)',
    filterClear: '.resource-filter-bar > span.button',
  },
  commands: [{
    createPolicy,
    searchPolicy,
    deletePolicy,
    checkViolations,
    setSearchValue,
    clearSearchValue,
    log,
    enforcePolicy,
    informPolicy,
    tryEnable,
    tryDisable,
  }]
}

function createPolicy(browser, name, yaml, time) {
  this.log(`Creating policy:\n${yaml}`)
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  this.waitForElementNotPresent('@spinner')
  this.click('@namespaceDropdown')
  this.waitForElementVisible('.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.click('.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div:nth-child(1)')
  this.waitForElementPresent('@yamlMonacoEditor')
  this.click('@yamlMonacoEditor')
  parser.enterTextInYamlEditor(this, browser, yaml, time)
  this.pause(1000)
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@submitCreatePolicyButton')
  this.click('@submitCreatePolicyButton')
  //verify placementrule + placementbinding
  this.expect.element('@table').to.be.present
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.click('tbody>tr>td>a')
  this.waitForElementNotPresent('@spinner')
  this.expect.element('.bx--detail-page-header-title').text.to.equal(name)
  this.expect.element('.section-title:nth-of-type(1)').text.to.equal('Policy details')
  this.expect.element('.new-structured-list > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').text.to.equal(name)
  this.expect.element('.overview-content > div:nth-child(2) > .section-title').text.to.equal('Placement')
  this.waitForElementVisible('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement rule')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('placement-' + name)
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement binding')
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('binding-' + name)
  this.click('.bx--breadcrumb > div:nth-child(1)')
  this.waitForElementNotPresent('#spinner')
}

function enforcePolicy(name){
  this.log(`Enforcing policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //enforce policy
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button').text.to.equal('Enforce')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button')
  this.waitForElementVisible('#enforce-resource-modal')
  this.click('#enforce-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--danger--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.waitForElementNotPresent('#enforce-resource-modal')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)').text.to.equal('enforce')
  this.clearSearchValue()
}

function informPolicy(name){
  this.log(`Informing policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //enforce policy
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button').text.to.equal('Inform')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button')
  this.waitForElementVisible('#inform-resource-modal')
  this.click('#inform-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.waitForElementVisible('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)')
  this.waitForElementNotPresent('#disable-resource-modal')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)').text.to.equal('inform')
  this.clearSearchValue()
}

function checkViolations(name, violationExpected, violationText) {
  this.log(`Checking policy: ${name} violationExpected: ${violationExpected}`)
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.expect.elements('tbody>tr>td>a').count.to.equal(1).before(2000)
  this.click('tbody>tr>td>a')
  this.waitForElementPresent('#violation-tab')
  this.click('#violation-tab')
  if (violationExpected) {
    this.waitForElementPresent('#violations-table-container')
    if (violationText) {
      this.expect.element('#violations-table-container > table > tbody > tr:nth-child(1) > td:nth-child(3)').text.to.equal(violationText)
    }
    this.log('checking view details for violations')
    this.click('#violations-table-container > table > tbody > tr:nth-child(1) > td:nth-child(3) a')
    this.waitForElementPresent('.policy-template-details-view')
    this.waitForElementPresent('.policy-template-details-view .table')
    this.getText('css selector', 'div.pf-c-description-list__group:nth-child(3) > dd:nth-child(2) > div:nth-child(1)', (kind) => {
      if (kind === 'ConfigurationPolicy') {
        this.getText('css selector', 'div.pf-c-description-list__group:nth-child(6) > dd:nth-child(2) > div:nth-child(1)', (details) => {
          if (details.value.includes('No instances of')) {
            this.expect.elements('.policy-template-details-view .table tbody>tr').count.to.equal(0)
          } else {
            this.expect.elements('.policy-template-details-view .table tbody>tr').count.not.to.equal(0)
          }
        })
        this.expect.elements('.policy-template-details-view .table tbody>tr').count.to.equal(0)
      }
    })
  } else {
    this.waitForElementPresent('.no-resource')
  }
  this.click('.bx--breadcrumb > div:nth-child(1)')
}

function searchPolicy(name, expectToDisplay) {
  this.waitForElementVisible('@searchInput')
  this.click('@searchInput').clearValue('@searchInput').setSearchValue(name)
  this.waitForElementVisible('@searchInput')
  if(expectToDisplay){
    this.expect.element('tbody>tr').to.have.attribute('data-row-name').equals(name)
    this.click('@searchInput').clearValue('@searchInput')
  } else{
    this.waitForElementNotPresent('tbody>tr')
    this.click('@searchInput').clearValue('@searchInput')
  }
}

function deletePolicy(name){
  this.log(`Deleting policy: ${name}`)
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementNotPresent('bx--overflow-menu-options__option.bx--overflow-menu-options__option--danger')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(5)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(5) > button').text.to.equal('Remove')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(5) > button')
  this.waitForElementVisible('button.bx--btn--danger--primary')
  this.click('button.bx--btn--danger--primary')
  this.waitForElementNotPresent('button.bx--btn--danger--primary')
  this.waitForElementNotPresent('@spinner')
}

function clearSearchValue(){
  this.isVisible('@searchInputClear', result => {
    if (result.value) {
      this.click('@searchInputClear')
    }
  })
  this.waitForElementNotVisible('@searchInputClear')
}

function setSearchValue(value){
  this.log(`Searching for policy: ${value}`)
  // const searchClose = '.bx--search-close.bx--search-close--hidden'
  // this.api.elements('css selector', searchClose, res => {
  //   if (res.status < 0 || res.value.length < 1) {
  //     // clear first
  //     this.click('button.bx--search-close')
  //     this.setValue('@searchInput', value)
  //   }
  //   else {
  //     // do nothing already cleared
  //     this.setValue('@searchInput', value)
  //   }
  // })
  this.click('@searchInput').clearValue('@searchInput').setValue('@searchInput', value)
}

function log(message) {
  return this.perform(() => {
    // eslint-disable-next-line no-console
    console.log(message)
  })
}

function tryEnable(name){
  this.log(`Enabling policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  // this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1)').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //enable policy
  this.waitForElementPresent('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Enable')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button')
  this.waitForElementVisible('#enable-resource-modal')
  this.click('#enable-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--primary')
  this.waitForElementNotPresent('#enable-resource-modal')
  this.clearSearchValue()
}

function tryDisable(name){
  this.log(`Disabling policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  // this.click('button.bx--search-close')
  // this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  //disable policy
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Disable')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button')
  this.waitForElementVisible('#disable-resource-modal')
  this.click('#disable-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--danger--primary')
  this.waitForElementNotPresent('#disable-resource-modal')
  this.clearSearchValue()
}

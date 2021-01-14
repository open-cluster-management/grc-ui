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
    spinner: '.patternfly-spinner',
    table: '.bx--data-table-v2',
    tableExpandBtn: '.bx--table-expand-v2__button:nth-of-type(1)',
    expandTable: '.bx--expandable-row-v2:nth-of-type(2)',
    createPolicyButton: '#create-policy',
    cancelCreatePolicyButton: '#cancel-button-portal-id',
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
    checkStatus,
    setSearchValue,
    clearSearchValue,
    log,
    enforcePolicy,
    informPolicy,
    tryEnable,
    tryDisable,
    clickButtonOnOverflowModal,
  }]
}

/*
* @name - the name of created testing data
* @nameTarget - DOM target postfix of created testing data on main page
* @overflowPosition - overflow icon position on main page
* @actionName - the name of clicked overflow action on overfrlow popup
* @actionPosition - the position of clicked action on overfrlow popup
* @modalName - DOM name of the modal which is opened from overfrlow popup
* @clickButtonName - DOM name of clicked button on the opened modal
*/
function clickButtonOnOverflowModal(name, nameTarget, overflowPosition, actionName, actionPosition, modalName, clickButtonName){
  this.log(`modal ${modalName} -- ${actionName} policy ${name} button ${clickButtonName}`)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element(`.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > ${nameTarget}`).text.to.equal(name)
  this.waitForElementVisible(`table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(${overflowPosition})`)
  this.click(`table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(${overflowPosition}) > div > svg`)
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible(`ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(${actionPosition})`)
  this.expect.element(`ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(${actionPosition}) > button`).text.to.equal(actionName)
  this.click(`ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(${actionPosition}) > button`)
  this.waitForElementVisible(modalName)
  this.waitForElementVisible(`${modalName} > div > .bx--modal-footer > ${clickButtonName}`)
  this.click(`${modalName} > div > .bx--modal-footer > ${clickButtonName}`)
  this.waitForElementNotPresent(modalName)
}

function createPolicy(browser, name, yaml, time) {
  this.log(`Creating policy:\n${yaml}`)
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  this.waitForElementNotPresent('@spinner')
  // test cancel button for create policy page first and return to main page
  this.waitForElementVisible('@cancelCreatePolicyButton')
  this.click('@cancelCreatePolicyButton')
  // re-entry create policy page from main page
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  this.waitForElementNotPresent('@spinner')
  // test create policy
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
  this.expect.element('.pf-c-description-list:nth-child(1) > .pf-c-description-list__group:nth-child(1) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(name)
  this.expect.element('.overview-content > div:nth-child(2) > .section-title').text.to.equal('Placement')
  this.waitForElementVisible('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement rule')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('placement-' + name)
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement binding')
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('binding-' + name)
  this.click('.bx--breadcrumb > div:nth-child(1)')
  this.waitForElementNotPresent('@spinner')
}

function enforcePolicy(name){
  this.log(`Enforcing policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  //verify cancel button (.bx--btn.bx--btn--tertiary) on enforce policy modal and return to main page
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Enforce', 3, '#enforce-resource-modal', '.bx--btn.bx--btn--tertiary')
  //re-entry overflow menu then click enforce policy button (.bx--btn.bx--btn--danger--primary)
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Enforce', 3, '#enforce-resource-modal', '.bx--btn.bx--btn--danger--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)').text.to.equal('enforce')
  this.clearSearchValue()
}

function informPolicy(name){
  this.log(`Informing policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  //verify cancel button (.bx--btn.bx--btn--secondary) on inform policy modal and return to main page
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Inform', 3, '#inform-resource-modal', '.bx--btn.bx--btn--secondary')
  //re-entry overflow menu then click inform policy button (.bx--btn.bx--btn--primary)
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Inform', 3, '#inform-resource-modal', '.bx--btn.bx--btn--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.waitForElementVisible('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(4)').text.to.equal('inform')
  this.clearSearchValue()
}

function checkStatus(name, violationExpected, violationText) {
  this.log(`Checking policy: ${name} violationExpected: ${violationExpected}`)
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  this.expect.elements('tbody>tr>td>a').count.to.equal(1).before(2000)
  // wait for yellow triangle to disappear
  this.waitForElementNotPresent('css selector','#table-container .violationCell svg[fill=\'#f0ab00\']')
  if (violationExpected) {
    // should show red not compliant
    this.waitForElementPresent('css selector', '#table-container .violationCell svg[fill=\'#c9190b\']')
  } else {
    // should show green compliant
    this.waitForElementPresent('css selector', '#table-container .violationCell svg[fill=\'#467f40\']')
  }
  this.click('tbody>tr>td>a')
  this.waitForElementPresent('#status-tab')
  this.click('#status-tab')
  this.waitForElementPresent('.policy-status-view')
  this.log('Checking policy status by templates')
  this.waitForElementPresent('#policy-status-templates').click('#policy-status-templates')
  this.waitForElementPresent('.policy-status-by-templates-table')
  this.expect.elements('.policy-status-by-templates-table').count.not.to.equal(0)
  if (violationExpected) {
    // should show red not compliant
    this.expect.elements('.policy-status-by-templates-table td[data-label="Status"] svg[fill="#c9190b"]').count.not.to.equal(0)
  } else {
    // should show green compliant
    this.expect.elements('.policy-status-by-templates-table td[data-label="Status"] svg[fill="#467f40"]').count.not.to.equal(0)
  }
  this.log('Checking policy status by clusters')
  this.waitForElementPresent('#policy-status-clusters').click('#policy-status-clusters')
  this.waitForElementPresent('.policy-status-by-clusters-table')
  if (violationExpected) {
    // should show red not compliant
    this.expect.elements('.policy-status-by-clusters-table td[data-label="Status"] svg[fill="#c9190b"]').count.not.to.equal(0)
  } else {
    // should show green compliant
    this.expect.elements('.policy-status-by-clusters-table td[data-label="Status"] svg[fill="#467f40"]').count.not.to.equal(0)
  }

  if (violationExpected) {
    if (violationText) {
      // check for 1st entry in the table
      // it should be a violation as table are sorted to show Not compliant first
      this.expect.element('.policy-status-by-clusters-table .pattern-fly-table > table > tbody > tr:nth-child(1) > td:nth-child(4) > div').text.to.equal(violationText)
    }
  }

  this.log('checking view history for policy status history')
  this.click('.policy-status-by-clusters-table .pattern-fly-table > table > tbody > tr:nth-child(1) > td:nth-child(6) a')
  this.waitForElementPresent('.policy-status-history-view')
  this.expect.elements('.policy-status-history-view .table tbody>tr').count.not.to.equal(0)

  this.log('checking view details for policy template details')
  this.click('.bx--breadcrumb > div:nth-child(3)')
  this.waitForElementPresent('#policy-status-clusters').click('#policy-status-clusters')
  this.waitForElementPresent('.policy-status-by-clusters-table')
  this.click('.policy-status-by-clusters-table .pattern-fly-table > table > tbody > tr:nth-child(1) > td:nth-child(4) a')
  this.waitForElementPresent('.policy-template-details-view')
  this.waitForElementPresent('.policy-template-details-view .table')
  this.getText('css selector', '.overview div.pf-c-description-list__group:nth-child(3) > dd:nth-child(2) > div:nth-child(1)', (kind) => {
    if (kind.value === '-') {
      this.assert.fail(`Failed to retrieve policy details: kind=${this.log(kind)}`)
    }
    if (violationExpected) {
      this.expect.element('.overview div.pf-c-description-list__group:nth-child(5) > dd:nth-child(2) > div:nth-child(1)').text.to.equal('NonCompliant')
    } else {
      this.expect.element('.overview div.pf-c-description-list__group:nth-child(5) > dd:nth-child(2) > div:nth-child(1)').text.to.equal('Compliant')
    }
  })
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
  this.expect.elements('tbody>tr').count.not.to.equal(0)
  this.searchPolicy(name, true)
  //verify cancel button (.bx--btn.bx--btn--tertiary) on delete policy modal and return to main page
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Remove', 4, '#remove-resource-modal', '.bx--btn.bx--btn--tertiary')
  //re-entry overflow menu then click delete policy button (.bx--btn.bx--btn--danger--primary)
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Remove', 4, '#remove-resource-modal', '.bx--btn.bx--btn--danger--primary')
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
  //verify cancel button (.bx--btn.bx--btn--secondary) on enable policy modal and return to main page
  this.clickButtonOnOverflowModal(name, 'div:nth-child(1)', 9, 'Enable', 2, '#enable-resource-modal', '.bx--btn.bx--btn--secondary')
  //re-entry overflow menu then click enable policy button (.bx--btn.bx--btn--primary)
  this.clickButtonOnOverflowModal(name, 'div:nth-child(1)', 9, 'Enable', 2, '#enable-resource-modal', '.bx--btn.bx--btn--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.waitForElementNotPresent('#table-container .disabled-label')
  this.clearSearchValue()
}

function tryDisable(name){
  this.log(`Disabling policy: ${name}`)
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setSearchValue(name)
  //verify cancel button (.bx--btn.bx--btn--tertiary) on disable policy modal and return to main page
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Disable', 2, '#disable-resource-modal', '.bx--btn.bx--btn--tertiary')
  //re-entry overflow menu then click delete policy button (.bx--btn.bx--btn--danger--primary)
  this.clickButtonOnOverflowModal(name, 'a', 9, 'Disable', 2, '#disable-resource-modal', '.bx--btn.bx--btn--danger--primary')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.waitForElementPresent('#table-container .disabled-label')
  this.clearSearchValue()
}

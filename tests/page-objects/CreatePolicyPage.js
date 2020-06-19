/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

module.exports = {
  elements: {
    spinner: '.content-spinner',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '#create-button-portal-id',
    yamlMonacoEditor: '.monaco-editor',
    searchInput: 'input.bx--search-input',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    templateDropdownInput: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    clusterSelectorDropdownInput: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    standardsDropdownInput: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    categoriesDropdownInput: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    controlsDropdownInput: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    enforceCheckbox: '#enforce ~ .checkbox',
    disableCheckbox: '#disabled ~ .checkbox',
  },
  commands: [{
    createTestPolicy,
    searchPolicy,
    deletePolicy,
  }]
}
/*
 * Create a policy given arrays of policy options
 * 
*/
function createTestPolicy(browser, time, testname, namespace='default', specification=[''], cluster=[], standard=[], category=[], controls=[], enforce=false, disable=false) {
  /* Press Create Policy Button */
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  this.waitForElementNotPresent('@spinner')
  /* Wait for Editor to appear */
  this.waitForElementVisible('@yamlMonacoEditor')
  this.click('@yamlMonacoEditor')
  /* Input Policy Name */
  this.click('@policyNameInput').clearValue('@policyNameInput')
  this.setValue('@policyNameInput', `${time}-${testname}-policy-test`)
  /* Select Namespace */
  this.click('@namespaceDropdown')
  this.waitForElementVisible('@namespaceDropdownBox')
  this.useXpath().click(`//div[contains(@class,"bx--list-box__menu-item") and text()="${namespace}"]`)
  this.waitForElementNotPresent('@namespaceDropdownBox')
  /* Select Specification template */
  this.click('@templateDropdown')
  this.waitForElementVisible('@templateDropdownBox')
  specification.forEach(item => {
    this.setValue('@templateDropdownInput', item)
    this.click('@templateDropdownBox:nth-child(1)')
    this.waitForElementNotPresent('@templateDropdownBox')
  });
  /* Select Cluster Placement Binding(s) */
  if (cluster.length) {
    this.click('@clusterSelectorDropdown')
    this.waitForElementVisible('@clusterSelectorDropdownBox')
    cluster.forEach(item => {
      this.setValue('@clusterSelectorDropdownInput', item)
      this.click('@clusterSelectorDropdownBox:nth-child(1)')
      this.clearValue('@clusterSelectorDropdownInput')
    });
    this.click('@clusterSelectorDropdownInput')
    this.waitForElementNotPresent('@clusterSelectorDropdownBox')
  }
  /* Select Security Standard(s) */
  if (standard.length) {
    this.click('@standardsDropdown')
    this.waitForElementVisible('@standardsDropdownBox')
    standard.forEach(item => {
      this.setValue('@standardsDropdownInput', item)
      this.click('@standardsDropdownBox:nth-child(1)')
      this.clearValue('@standardsDropdownInput')
    });
    this.click('@standardsDropdownInput')
    this.waitForElementNotPresent('@standardsDropdownBox')
  }
  /* Select Security Control Category(s) */
  if (category.length) {
    this.click('@categoriesDropdown')
    this.waitForElementVisible('@categoriesDropdownBox')
    category.forEach(item => {
      this.setValue('@categoriesDropdownInput', item)
      this.click('@categoriesDropdownBox:nth-child(1)')
      this.clearValue('@categoriesDropdownInput')
    });
    this.click('@categoriesDropdownInput')
    this.waitForElementNotPresent('@categoriesDropdownBox')
  }
  /* Select Security Control(s) */
  if (controls.length) {
    this.click('@controlsDropdown')
    this.waitForElementVisible('@controlsDropdownBox')
    controls.forEach(item => {
      this.setValue('@controlsDropdownInput', item)
      this.click('@controlsDropdownBox:nth-child(1)')
      this.clearValue('@controlsDropdownInput')
    });
    this.click('@controlsDropdownInput')
    this.waitForElementNotPresent('@controlsDropdownBox')
  }
  this.pause(5000)
  /* Enable 'enforce' for policy (instead of 'inform') */
  if (enforce) {
    this.click('@enforceCheckbox')
  }
  /* Disable policy from propagating to managed clusters */
  if (disable) {
    this.click('@disableCheckbox')
  }
  /*  this.waitForElementNotPresent('@spinner')
    this.waitForElementVisible('@submitCreatePolicyButton')
    this.click('@submitCreatePolicyButton')
    this.expect.element('@table').to.be.present
    this.waitForElementVisible('@searchInput')
    this.setValue('@searchInput',`${time}-policy-test`)*/
}
function searchPolicy(expectToDisplay, time) {
  this.waitForElementVisible('@searchInput')
  this.setValue('@searchInput', `${time}-policy-test`)
  this.waitForElementVisible('@searchInput')
  if (expectToDisplay) {
    this.expect.element('tbody>tr').to.have.attribute('data-row-name').equals(`${time}-policy-test`)
  } else {
    this.waitForElementNotPresent('tbody>tr')
    this.click('@searchInput').clearValue('@searchInput')
  }
}
function deletePolicy(name) {
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.setValue('@searchInput', name)
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
  this.expect.element('.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.waitForElementNotPresent('bx--overflow-menu-options__option.bx--overflow-menu-options__option--danger')
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9)')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button').text.to.equal('Remove')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button')
  this.waitForElementVisible('button.bx--btn--danger--primary')
  this.click('button.bx--btn--danger--primary')
  this.waitForElementNotPresent('@spinner')
  // this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').not.to.be.present
}

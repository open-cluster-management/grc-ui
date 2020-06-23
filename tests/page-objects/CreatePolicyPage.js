/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

module.exports = {
  elements: {
    spinner: '.content-spinner',
    table: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '#create-button-portal-id',
    yamlMonacoEditor: '.monaco-editor',
    searchInput: 'input.bx--search-input',
    searchResult: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    templateDropdownInput: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    templateDropdownClear: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    clusterSelectorDropdownInput: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    clusterSelectorDropdownClear: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    standardsDropdownInput: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    standardsDropdownClear: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    categoriesDropdownInput: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    categoriesDropdownClear: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    controlsDropdownInput: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    controlsDropdownClear: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection',
    enforceCheckbox: '#enforce ~ .checkbox',
    disableCheckbox: '#disabled ~ .checkbox',
  },
  commands: [{
    createTestPolicy,
    verifyPolicy,
    deletePolicy,
  }]
}
/*
 * Create a policy given spec object with arrays of policy options
 * 
 * Defaults to the 'default' namespace with the first available policy template.
 * Will clear out Standard/Category/Controls with empty input.
*/
function createTestPolicy(policyName, spec = { namespace: 'default', specification: [''], cluster: [''], standard: [''], category: [''], controls: [''], enforce: false, disable: false }) {
  /* Press Create Policy Button */
  this.waitForElementVisible('@createPolicyButton')
  this.click('@createPolicyButton')
  this.waitForElementNotPresent('@spinner')
  /* Wait for Editor to appear */
  this.waitForElementVisible('@yamlMonacoEditor')
  this.click('@yamlMonacoEditor')
  /* Input Policy Name */
  this.click('@policyNameInput').clearValue('@policyNameInput')
  this.setValue('@policyNameInput', policyName)
  /* Select Namespace */
  this.click('@namespaceDropdown')
  this.waitForElementVisible('@namespaceDropdownBox')
  if (!spec.namespace) {
    spec.namespace = 'default'
  }
  this.click('xpath', `//div[contains(@class,"bx--list-box__menu-item") and text()="${spec.namespace}"]`)
  this.waitForElementNotPresent('@namespaceDropdownBox')
  /* Select Specification template */
  this.click('@templateDropdown')
  this.waitForElementVisible('@templateDropdownBox')
  if (!spec.specification) {
    spec.specification = ['']
  }
  spec.specification.forEach(item => {
    this.setValue('@templateDropdownInput', item)
    this.click('@templateDropdownBox:nth-child(1)')
    this.waitForElementNotPresent('@templateDropdownBox')
  });
  /* Select Cluster Placement Binding(s) */
  if (spec.cluster && spec.cluster[0] != '') {
    this.expect.element('@clusterSelectorClear').to.not.be.present
    this.click('@clusterSelectorDropdown')
    this.waitForElementVisible('@clusterSelectorDropdownBox')
    spec.cluster.forEach(item => {
      this.setValue('@clusterSelectorDropdownInput', item)
      this.click('@clusterSelectorDropdownBox:nth-child(1)')
      this.clearValue('@clusterSelectorDropdownInput')
    });
    this.click('@clusterSelectorDropdownInput')
    this.waitForElementNotPresent('@clusterSelectorDropdownBox')
  }
  /* Select Security Standard(s) */
  if (!spec.standard) {
    spec.standard = ['']
  }
  this.click('@standardsDropdownClear')
  this.expect.element('@standardsDropdownClear').to.not.be.present
  if (spec.standard[0] != '') {
    this.click('@standardsDropdown')
    this.waitForElementVisible('@standardsDropdownBox')
    spec.standard.forEach(item => {
      this.setValue('@standardsDropdownInput', item)
      this.click('@standardsDropdownBox:nth-child(1)')
      this.clearValue('@standardsDropdownInput')
    });
    this.click('@standardsDropdownInput')
    this.waitForElementNotPresent('@standardsDropdownBox')
  }
  /* Select Security Control Category(s) */
  if (!spec.category) {
    spec.category = ['']
  }
  this.click('@categoriesDropdownClear')
  this.expect.element('@categoriesDropdownClear').to.not.be.present
  if (spec.category[0] != '') {
    this.click('@categoriesDropdown')
    this.waitForElementVisible('@categoriesDropdownBox')
    spec.category.forEach(item => {
      this.setValue('@categoriesDropdownInput', item)
      this.click('@categoriesDropdownBox:nth-child(1)')
      this.clearValue('@categoriesDropdownInput')
    });
    this.click('@categoriesDropdownInput')
    this.waitForElementNotPresent('@categoriesDropdownBox')
  }
  /* Select Security Control(s) */
  if (!spec.controls) {
    spec.controls = ['']
  }
  this.click('@controlsDropdownClear')
  this.expect.element('@controlsDropdownClear').to.not.be.present
  if (spec.controls && spec.controls[0] != '') {
    this.click('@controlsDropdown')
    this.waitForElementVisible('@controlsDropdownBox')
    spec.controls.forEach(item => {
      this.setValue('@controlsDropdownInput', item)
      this.click('@controlsDropdownBox:nth-child(1)')
      this.clearValue('@controlsDropdownInput')
    });
    this.click('@controlsDropdownInput')
    this.waitForElementNotPresent('@controlsDropdownBox')
  }
  /* Enable 'enforce' for policy (instead of 'inform') */
  if (spec.enforce) {
    this.click('@enforceCheckbox')
  }
  /* Disable policy from propagating to managed clusters */
  if (spec.disable) {
    this.click('@disableCheckbox')
  }
  /* Create policy */
  this.waitForElementVisible('@submitCreatePolicyButton')
  this.click('@submitCreatePolicyButton')
  this.expect.element('@table').to.be.present
}
/* 
 * Search for created policy and verify displayed details against provided 
 * parameters given in spec object
 */
function verifyPolicy(expectToDisplay, policyName, spec = { namespace: 'default', standard: [''], controls: [''], category: [''] }) {
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@table')
  this.waitForElementVisible('@searchInput')
  /* Filter for the policy */
  this.setValue('@searchInput', policyName)
  this.waitForElementVisible('@searchResult')
  /* Determine whether a result is expected */
  if (expectToDisplay) {
    /* Verify policy name */
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(policyName)
    /* Verify policy namespace */
    if (!spec.namespace) {
      spec.namespace = 'default'
    }
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(3)').text.to.equal(spec.namespace)
    /* Verify each Security Standard */
    if (!spec.standard) {
      spec.standard = ['']
    }
    if (spec.standard[0] != '') {
      spec.standard.forEach(item => {
        /* Replace dash in NIST-CRF with a space */
        if (item.indexOf('-') >= 0) {
          item = item.replace('-', ' ')
        }
        this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(6)').text.to.contain(item)
      });
    } else {
      this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(6)').text.to.equal('-')
    }
    /* Verify each Security Control */
    if (!spec.controls) {
      spec.controls = ['']
    }
    if (spec.controls[0] != '') {
      spec.controls.forEach(item => {
        this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.contain(item)
      });
    } else {
      this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.equal('-')
    }
    /* Verify each Security Control Category */
    if (!spec.category) {
      spec.category = ['']
      console.warn('spec parameter was provided to verifyPolicy() of CreatePolicyPage.js but did not contain a category')
    }
    if (spec.category[0] != '') {
      spec.category.forEach(item => {
        this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').text.to.contain(item)
      });
    } else {
      this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').text.to.equal('-')
    }
  } else {
    this.waitForElementNotPresent('tbody>tr')
    this.click('@searchInput').clearValue('@searchInput')
  }
  this.clearValue('@searchInput')
}
/* 
 * Delete created policy given name of policy
 */
function deletePolicy(policyName) {
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@table')
  this.waitForElementVisible('@searchInput')
  this.setValue('@searchInput', policyName)
  this.waitForElementVisible('@table')
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td > a').text.to.equal(policyName)
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button').text.to.equal('Remove')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(4) > button')
  this.waitForElementVisible('button.bx--btn--danger--primary')
  this.click('button.bx--btn--danger--primary')
  this.waitForElementNotPresent('@spinner')
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1)').to.not.be.present
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************
/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

module.exports = {
  elements: {
    spinner: '.content-spinner',
    table: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra',
    createPolicyButton: '.bx--btn--primary:nth-of-type(1)',
    submitCreatePolicyButton: '#create-button-portal-id',
    resetEditor: 'div.creation-view-yaml-header div.editor-bar-button[title="Reset"]',
    yamlMonacoEditor: '.monaco-editor',
    searchInput: 'input.bx--search-input',
    searchResult: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    summaryInfoContainer: 'div.module-grc-cards > div.card-container-container',
    summaryDropdown: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2) > div',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    templateDropdownInput: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    clusterDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box',
    clusterDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    clusterDropdownInput: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    clusterDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    standardsDropdownInput: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    standardsDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    categoriesDropdownInput: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    categoriesDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    controlsDropdownInput: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    controlsDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    enforceCheckbox: '#enforce ~ .checkbox',
    disableCheckbox: '#disabled ~ .checkbox',
  },
  commands: [{
    verifySummary,
    verifyPolicyTable,
    verifyTable,
    verifyPagination,
    createTestPolicy,
    searchPolicy,
    testDetailsPage,
    deletePolicy,
    verifyDisableEnable,
  }]
}
function verifySummary(browser, url) {
  this.waitForElementVisible('button.collapse > span.collapse-button')
  this.waitForElementVisible('div.module-grc-cards > div.card-container-container')
  this.waitForElementVisible('@summaryInfoContainer')
  this.navigate(url + '?card=false&index=0')
  this.waitForElementNotPresent('@summaryInfoContainer')
  this.navigate(url + '?card=true&index=0')
  this.waitForElementVisible('@summaryInfoContainer')
  //standards summary
  this.waitForElementVisible('@summaryDropdown')
  this.click('@summaryDropdown')
  browser.pause(1000)//wait 1s for every click
  //Categories summary
  this.click('@summaryDropdownBox:nth-child(1)')
  browser.pause(1000)
  checkPolicySummaryCards.call(this, browser)
  browser.pause(1000)//wait 1s for checkPolicySummaryCards func
  //Standards summary
  this.click('@summaryDropdown')
  browser.pause(1000)
  this.click('@summaryDropdownBox:nth-child(2)')
  browser.pause(1000)
  checkPolicySummaryCards.call(this, browser)
}
function checkPolicySummaryCards(browser) {
  browser.elements('css selector', 'div.module-grc-cards > div:nth-child(2) > div', (cards) => {
    for (let cardNum = 1; cardNum < cards.value.length + 1; cardNum++) {
      for (let i = 1; i <= 2; i++) {
        const cardInfo = `div.module-grc-cards > div:nth-child(2) > div:nth-child(${cardNum}) > div > div > div:nth-child(2)`
        this.waitForElementVisible(cardInfo)
        browser.element('css selector', cardInfo + ' > .empty-violations-strip', function (result) {
          if (result.value === false) {
            this.click(cardInfo + ` > div:nth-child(${i})`)
            browser.pause(1000)
            browser.element('css selector', '.resource-filter-bar > span.button', function (result2) {
              if (result2.value !== false) {
                //first card of each category is cluster (no drop-down), second is policy
                verifyTable(browser, (i % 2 !== 0))
                this.click('div.resource-filter-bar > span.button')
                browser.pause(1000)//wait 1s for cleaning resource filters
              }
            })
          }
        })
      }
    }
  })
}
function verifyTable(browser, cluster) {
  browser.element('css selector', 'div.no-resource', function (result) {
    if (result.status !== -1) {
      this.waitForElementVisible('div.no-resource')
    }
    else {
      this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra')
      if (!cluster) {
        this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
        this.waitForElementVisible('tr.bx--expandable-row-v2:nth-of-type(2)')
        this.click('button.bx--table-expand-v2__button:nth-of-type(1)')
        this.waitForElementVisible('tr.bx--expandable-row-v2:nth-of-type(2)')
        this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
        this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
        this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(1)')
      }
      else {
        this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(5) > div > svg')
        this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
        this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(1)')
      }
      this.waitForElementVisible('div.bx--modal.is-visible')
      this.click('button.bx--modal-close')
      this.waitForElementNotPresent('div.bx--modal.is-visible')
    }
  })
}
function verifyPagination() {
  const pagination = '.bx--pagination'
  this.waitForElementVisible(pagination)
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="5"]')
  this.waitForElementVisible('.bx--pagination__button.bx--pagination__button--forward')
  this.click('.bx--pagination__button.bx--pagination__button--forward')
  this.waitForElementVisible('.bx--pagination__button.bx--pagination__button--backward')
  this.click('.bx--pagination__button.bx--pagination__button--backward')
  this.click('select[id="bx-pagination-select-resource-table-pagination"] option[value="10"]')
}
/* Helper function to select dropdown options */
function dropdownSelector(browser, label = '', options = ['']) {
  if (options && options[0] != '') {
    browser.click(`@${label}Dropdown`)
    browser.waitForElementVisible(`@${label}DropdownBox`)
    options.forEach(item => {
      browser.setValue(`@${label}DropdownInput`, item)
      browser.click(`@${label}DropdownBox:nth-child(1)`)
      browser.click(`@${label}DropdownClearValue`)
    })
    browser.click(`@${label}DropdownInput`)
    browser.waitForElementNotPresent(`@${label}DropdownBox`)
  }
}
/* Helper function to parse template files */
function applyTemplate(name, templateFile) {
  const file = fs.readFileSync(path.join(__dirname, `../e2e/yaml/create_policy/${templateFile}`), 'utf8')
  const data = file.replace(/\[TEST_POLICY_NAME\]/g, name)
  return data
}
/* Helper function to compare the editor with a template */
function compareTemplate(browser, templateFile, spec = {}) {
  browser.api.execute('return window.monaco.editor.getModels()[0].getValue()', [], (result) => {
    const expected = applyTemplate(spec.policyName, templateFile)
    const actual = result.value
    const expectedlines = expected.split(/\r?\n/)
    const actuallines = actual.split(/\r?\n/)
    let i = 0, diff = '', same = true
    while (same && (i < expectedlines.length || i < actuallines.length)) {
      if (i < expectedlines.length) {
        if (i < actuallines.length) {
          if (expectedlines[i] != actuallines[i]) {
            diff = 'EXPECTED: ' + expectedlines[i] + '\nACTUAL  : ' + actuallines[i] + '\n---\n'
            same = false
          }
        } else {
          diff = 'EXPECTED: ' + expectedlines[i] + '\nACTUAL  : <EOF>' + '\n---\n'
          same = false
        }
      } else {
        diff = 'EXPECTED: <EOF>\nACTUAL  : ' + actuallines[i] + '\n---\n'
        same = false
      }
      i++
    }
    if (!same) {
      browser.assert.fail(`YAML in editor differs from expected YAML (${templateFile}) on Line ${i}:\n` + diff)
    } else {
      browser.assert.ok(true, `YAML in editor matches expected YAML (${templateFile}).`)
    }
  })
}
/*
 * Create a policy given spec object with arrays of policy options
 *
 * Defaults to the 'default' namespace with the first available policy template.
 * Validates against the given templateFile (will skip this step if none is given)
 * If the same standards/categories/controls are provided as a template, they
 * will be deselected
 */
function createTestPolicy(create = true,
  spec = {
    policyName: 'default-policy-test',
    namespace: 'default',
    specification: [''],
    cluster: [''],
    standard: [''],
    category: [''],
    control: [''],
    enforce: false,
    disable: false
  }, templateFile = '') {
  /* Press Create Policy Button or Reset the form */
  this.api.url(result => {
    if (result.value.indexOf('/policies/create') < 0) {
      this.waitForElementVisible('@createPolicyButton')
      this.click('@createPolicyButton')
      this.waitForElementNotPresent('@spinner')
    } else {
      this.click('@resetEditor')
    }
  })
  /* Wait for Editor to appear */
  this.waitForElementVisible('@yamlMonacoEditor')
  /* Input Policy Name */
  this.click('@policyNameInput').clearValue('@policyNameInput')
  this.setValue('@policyNameInput', spec.policyName)
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
    this.setValue('@templateDropdownInput', item + ' - ')
    this.click('@templateDropdownBox:nth-child(1)')
    this.waitForElementNotPresent('@templateDropdownBox')
  })
  /* Select Cluster, Standard, Category, Control dropdowns */
  dropdownSelector(this, 'cluster', spec.cluster)
  dropdownSelector(this, 'standards', spec.standard)
  dropdownSelector(this, 'categories', spec.category)
  dropdownSelector(this, 'controls', spec.control)
  /* Enable 'enforce' for policy (instead of 'inform') if indicated */
  if (spec.enforce) {
    this.click('@enforceCheckbox')
  } else {
    spec.enforce = false
  }
  /* Disable policy from propagating to managed clusters if indicated */
  if (spec.disable) {
    this.click('@disableCheckbox')
  } else {
    spec.disable = false
  }
  /* Verify displayed YAML based on input (if a template file is given) */
  if (templateFile) {
    compareTemplate(this, templateFile, spec)
  }
  /* Create policy if requested */
  if (create) {
    this.waitForElementVisible('@submitCreatePolicyButton')
    this.click('@submitCreatePolicyButton')
    this.expect.element('@table').to.be.present
  }
}
function searchPolicy(expectToDisplay, policyName) {
  this.waitForElementVisible('@searchInput')
  this.setValue('@searchInput', policyName)
  this.waitForElementVisible('@searchInput')
  if (expectToDisplay) {
    this.expect.element('tbody>tr').to.have.attribute('data-row-name').equals(policyName)
  } else {
    this.waitForElementNotPresent('tbody>tr')
    this.click('@searchInput').clearValue('@searchInput')
  }
}
/* Helper to replace punctuation with spaces and capitalize text */
function cleanAndCapitalize(str) {
  const punctuation = ['-', '.']
  punctuation.forEach(p => {
    while (str.indexOf(p) >= 0) {
      str = str.replace(p, ' ')
    }
  })
  str = str.replace(/\b\w/g, l => l.toUpperCase())
  return str
}
function verifyPolicyTable(name, templateFile) {
  // Parse template file into object
  const file = applyTemplate(name, templateFile)
  const data = yaml.safeLoadAll(file)
  // Verify summary table fields
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(3)').text.to.equal(data[0].metadata.namespace)
  if (data[0].metadata.annotations['policy.open-cluster-management.io/standards']) {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(6)').text.to.equal(cleanAndCapitalize(data[0].metadata.annotations['policy.open-cluster-management.io/standards']))
  } else {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(6)').text.to.equal('-')
  }
  if (data[0].metadata.annotations['policy.open-cluster-management.io/controls']) {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.equal(cleanAndCapitalize(data[0].metadata.annotations['policy.open-cluster-management.io/controls']))
  } else {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.equal('-')
  }
  if (data[0].metadata.annotations['policy.open-cluster-management.io/categories']) {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').text.to.equal(cleanAndCapitalize(data[0].metadata.annotations['policy.open-cluster-management.io/categories']))
  } else {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').text.to.equal('-')
  }
}
function testDetailsPage(name, templateFile) {
  // Parse template file into object
  const file = applyTemplate(name, templateFile)
  const data = yaml.safeLoadAll(file)
  // Verify and click policy name in policy table
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(3)').text.to.equal(data[0].metadata.namespace)
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.equal(name)
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a')
  // DETAILS TAB TESTS
  // Check policy details
  this.expect.element('.bx--detail-page-header-title').text.to.equal(name)
  this.expect.element('.section-title:nth-of-type(1)').text.to.equal('Policy details')
  this.expect.element('.new-structured-list > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').text.to.equal(name)
  this.expect.element('.new-structured-list > table:nth-child(5) > tbody > tr:nth-child(1) > td:nth-child(2)').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/categories'])
  this.expect.element('.new-structured-list > table:nth-child(5) > tbody > tr:nth-child(2) > td:nth-child(2)').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/controls'])
  this.expect.element('.new-structured-list > table:nth-child(5) > tbody > tr:nth-child(3) > td:nth-child(2)').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/standards'])
  this.expect.element('.new-structured-list > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2)').text.to.equal(data[0].spec.remediationAction)
  this.expect.element('.new-structured-list > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(2)').text.to.equal(data[0].spec.disabled.toString())
  // Check Placement rule
  this.expect.element('.overview-content > div:nth-child(2) > .section-title').text.to.equal('Placement')
  this.waitForElementVisible('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement rule')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('placement-' + name)
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(2) > div:nth-child(2)').text.to.equal(data[2].metadata.namespace)
  this.api.getText('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(3) > div:nth-child(2)', (result) => {
    this.assert.equal(result.value.replace(/ /g, ''), 'matchExpressions=' + JSON.stringify(data[2].spec.clusterSelector.matchExpressions))
  })
  // Check Placement binding
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement binding')
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('binding-' + name)
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(2) > div:nth-child(2)').text.to.equal(data[1].metadata.namespace)
  // Check Policy templates
  this.expect.element('.overview-content > div:nth-child(3) > .section-title').text.to.equal('Policy templates')
  // VIOLATION TAB TESTS
  this.waitForElementVisible('#violation-tab')
  this.click('#violation-tab')
  this.waitForElementNotPresent('#spinner')
  // Temp disable violation table test - Adam Kang 11Nov19
  // this.waitForElementVisible('.policy-violation-tab > .section-title', 15000, false, (result) => {
  //   if(result.value === false){
  //     browser.expect.element('.no-resource').to.be.present
  //   }
  //   else{
  //     browser.expect.element('.policy-violation-tab > .section-title').text.to.equal('Violations')
  //   }
  // })
  // YAML TAB TESTS
  this.waitForElementVisible('#yaml-tab')
  this.click('#yaml-tab')
  this.waitForElementVisible('.monaco-editor')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(1)')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(2)')
  // Return to All Policies page
  this.click('.bx--breadcrumb > div:nth-child(1)')
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
function verifyDisableEnable(name) {
  //verify table/menu exist
  this.waitForElementVisible('body')
  this.waitForElementVisible('@searchInput')
  this.waitForElementNotPresent('.bx--loading-overlay')
  this.click('@searchInput').clearValue('@searchInput')
  this.setValue('@searchInput', name)
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
  //enable policy
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open')
  this.waitForElementVisible('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3)')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Enable')
  this.click('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button')
  this.waitForElementVisible('#enable-resource-modal')
  this.click('#enable-resource-modal > div > .bx--modal-footer > .bx--btn.bx--btn--primary')
  //re-check menu
  this.waitForElementVisible('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(9) > div > svg')
  this.expect.element('ul.bx--overflow-menu-options.bx--overflow-menu--flip.bx--overflow-menu-options--open > li:nth-child(3) > button').text.to.equal('Disable')
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

module.exports = {
  elements: {
    spinner: '.patternfly-spinner',
    table: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra',
    createPolicyButton: '#create-policy',
    submitCreatePolicyButton: '#create-button-portal-id',
    resetEditor: 'div.creation-view-yaml-header div.editor-bar-button[title="Reset"]',
    yamlMonacoEditor: '.monaco-editor',
    searchInput: '#search',
    searchInputClear: '#search ~ .bx--search-close',
    searchResult: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td',
    resourceFilterBar: 'div.resource-filter-bar > span',
    filterButton: '#resource-toolbar > div > div > div.resource-filter-button',
    filterMenu: '#resource-toolbar > div.resource-filter-view',
    filterSectionTitles: '#resource-toolbar > div.resource-filter-view > div.filter-sections-container > div > div.filter-section > div.filter-section-title',
    sidePolicyPanel: 'div.bx--modal-container > div.bx--modal-content',
    sidePolicyPanelClose: 'div.bx--modal-container > div.bx--modal-header > button.bx--modal-close',
    sidePolicyPanelClusterLink: 'div.bx--modal-container > div.bx--modal-content a.bx--link',
    toggleButtonPolicies: '#policies-0',
    toggleButtonClusterViolations: '#cluster-violations-1',
    allTableClusterHeading: '.bx--data-table-v2 > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > div:nth-child(1) > span:nth-child(1)',
    allTablePolicyHeading: '.bx--data-table-v2 > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > span:nth-child(1)',
    overflowMenu: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td > div.bx--overflow-menu',
    overflowViewClusters: 'body > ul.bx--overflow-menu-options > li:nth-child(1) > button',
    deleteButton: '.bx--overflow-menu-options__option--danger',
    confirmDeleteButton: '.bx--btn--danger--primary',
    noResource: '.no-resource',
    summaryInfoContainer: 'div.module-grc-cards > div.card-container-container',
    summaryDropdown: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1)',
    summaryDropdownBox: 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2) > div',
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div',
    namespaceDropdownValue: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__field > span',
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
    standardsDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    categoriesDropdownInput: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    categoriesDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    controlsDropdownInput: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    controlsDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    enforceCheckbox: '#enforce',
    disableCheckbox: '#disabled',
  },
  commands: [{
    createTestPolicy,
    testCreateCustomSelections,
    testDetailsPage,
    testFilters,
    testPolicySidePanel,
    updateYamlEditor,
    verifyPagination,
    verifyPolicyTable,
    verifySummary,
    verifyTable,
    verifyToggle
  }]
}
function verifySummary(browser, url) {
  this.waitForElementVisible('button.collapse > span.collapse-button')
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
// Test content toggle
function verifyToggle() {
  this.click('@toggleButtonClusterViolations')
  this.waitForElementVisible('@allTableClusterHeading')
  this.expect.element('@allTableClusterHeading').text.to.equal('Cluster name')
  this.click('@toggleButtonPolicies')
  this.waitForElementVisible('@allTablePolicyHeading')
  this.expect.element('@allTablePolicyHeading').text.to.equal('Policy name')
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
/* Test side panel */
function testPolicySidePanel() {
  this.click('@overflowMenu')
  this.click('@overflowViewClusters')
  this.waitForElementVisible('@sidePolicyPanel')
  this.waitForElementNotPresent('@spinner')
  this.expect.element('@sidePolicyPanelClusterLink').text.to.equal('Launch cluster')
  this.expect.element('@sidePolicyPanelClusterLink').to.have.attribute('href').to.startWith('https://console')
  this.click('@sidePolicyPanelClose')
  this.waitForElementNotPresent('@sidePolicyPanel')
}
/* Test policy filters on the policy summary page */
function testFilters(spec = {}) {
  const headings = [ 'Standards', 'Categories', 'Controls', 'Type' ]
  // Open filter menu
  this.click('@filterButton')
  this.expect.element('@filterMenu').to.be.present
  // Wait for filter menu opening animation to finish
  this.waitForElementVisible('@filterSectionTitles')
  // Check for proper headings and click checkboxes that match policy
  for (let i = 0; i < headings.length; i++) {
    this.api.element('xpath', `//div[contains(@class,"filter-section-title") and text()="${headings[i]}"]`, (result) => {
      this.assert.ok(result.status >= 0, `Filter heading ${headings[i]} is present`)
    })
    if (headings[i] !== 'Type') {
      const heading = headings[i].toLowerCase()
      const label = cleanAndCapitalize(spec[heading][0])
      let labelTrunc
      if (label.length > 20) {
        labelTrunc = `${label.substring(0,9)}...${label.substring(label.length-8)}`
      } else {
        labelTrunc = label
      }
      this.click('xpath', `//div[contains(@class,"filter-section")]//label/span[text()="${label}"]`)
      this.expect.element(`div.filter-section > div > input[id="${heading}${label}"]`).to.be.selected
      this.expect.element(`@resourceFilterBar:nth-child(${i + 2})`).text.to.equal(labelTrunc)
    }
  }
  // Expect our policy to still be visible after checking its respective filters
  this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a').text.to.contain(spec.policyName)
  // Leave and return to the summary page to make sure the filters are still there
  this.click('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(2) > a')
  this.waitForElementNotPresent('@spinner')
  this.click('.bx--breadcrumb > div:nth-child(1)')
  this.waitForElementNotPresent('@spinner')
  // Check for the filter buttons
  for (let i = 0; i < headings.length; i++) {
    if (headings[i] !== 'Type') {
      const heading = headings[i].toLowerCase()
      const label = cleanAndCapitalize(spec[heading][0])
      let labelTrunc
      if (label.length > 20) {
        labelTrunc = `${label.substring(0,9)}...${label.substring(label.length-8)}`
      } else {
        labelTrunc = label
      }
      this.expect.element(`@resourceFilterBar:nth-child(${i + 2})`).text.to.equal(labelTrunc)
    }
  }
  // Clear filters
  this.click('@resourceFilterBar:last-child')
  this.expect.element('@resourceFilterBar').to.not.be.present
}
/* Helper function to select dropdown options */
function dropdownSelector(browser, label = '', options = ['']) {
  if (options && options[0] != '') {
    browser.click(`@${label}Dropdown`)
    browser.waitForElementVisible(`@${label}DropdownBox`)
    options.forEach(item => {
      browser.setValue(`@${label}DropdownInput`, item)
      browser.expect.element(`@${label}DropdownBox:nth-child(1)`).text.to.equal(item)
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
  if (name && name != '') {
    return file.replace(/\[TEST_POLICY_NAME\]/g, name)
  } else {
    return file
  }
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
    standards: [''],
    categories: [''],
    controls: [''],
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
  if (!spec.specification) {
    spec.specification = ['']
  }
  spec.specification.forEach(item => {
    this.click('@templateDropdown')
    this.waitForElementVisible('@templateDropdownBox')
    this.setValue('@templateDropdownInput', item + ' - ')
    this.expect.element('@templateDropdownBox:nth-child(1)').text.to.startWith(item)
    this.click('@templateDropdownBox:nth-child(1)')
    this.waitForElementNotPresent('@templateDropdownBox')
  })
  /* Select Cluster, Standards, Categories, Controls dropdowns */
  dropdownSelector(this, 'cluster', spec.cluster)
  dropdownSelector(this, 'standards', spec.standards)
  dropdownSelector(this, 'categories', spec.categories)
  dropdownSelector(this, 'controls', spec.controls)
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
/* Test whether customizing selections works as expected */
function testCreateCustomSelections(templates) {
  // Set up a policy with multiple specifications
  this.createTestPolicy(false, {specification: templates})
  // Clear Standards and make sure it's working as expected
  this.click('@standardsDropdownClearAll')
  this.expect.element('@standardsDropdownInput').to.have.attribute('placeholder').that.equals('Begin typing to search for label to select')
  this.pause()
}
/* Helper function to edit YAML in editor and verify fields changed */
function editYaml(browser, content, line, element, clear = false, expected = content) {
  browser.click('@yamlMonacoEditor')
  /* Delete current content if indicated and enter content */
  browser.api.execute(
    `const monaco = window.monaco.editor.getModels()[0]\n \
    const current = monaco.getLineContent(${line})\n \
    monaco.pushEditOperations([], \
      [{ \
        range: { \
            startColumn: ${clear} ? current.indexOf(':') + 3 : current.length + 1, \
            endColumn: current.length + 1, \
            startLineNumber: ${line}, \
            endLineNumber: ${line} \
          }, \
        text:'${content.replace(/\r?\n/g, '\\n').replace(/'/g, '\\\'')}' \
      }] \
    )`, [])
  /* Wait half a second for DOM update */
  browser.pause(500)
  if (element.indexOf('Dropdown') > 0) {
    browser.api.getAttribute('css selector', browser.elements[element], 'placeholder', (result) => {
      if (result.value) {
        browser.assert.equal(result.value, expected, `Placeholder value of @${element} matches expected value "${expected}"`)
      } else {
        browser.expect.element(`@${element}`).text.to.equal(expected)
      }
    })
  } else if (element.indexOf('Checkbox') > 0) {
    browser.expect.element(`@${element}`).to.be.selected
  } else {
    throw new Error('editYaml was given an unknown element type (if this is unexpected, a new test may need to be specified): ' + element)
  }
}
/* Test whether updating the YAML updates the fields accordingly */
function updateYamlEditor() {
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
  /* Enter data */
  editYaml(this, 'test-namespace', 5, 'namespaceDropdownValue')
  editYaml(this, 'test-standard', 7, 'standardsDropdownInput')
  editYaml(this, 'test-category', 8, 'categoriesDropdownInput')
  editYaml(this, 'test-control', 9, 'controlsDropdownInput')
  editYaml(this, 'enforce', 11, 'enforceCheckbox', true)
  editYaml(this, 'true', 12, 'disableCheckbox', true)
  editYaml(this, applyTemplate('', 'custom_spec.yaml'), 12, 'templateDropdownInput', true, 'Custom specifications')
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
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.equal(cleanAndCapitalize(data[0].metadata.annotations['policy.open-cluster-management.io/categories']))
  } else {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(7)').text.to.equal('-')
  }
  if (data[0].metadata.annotations['policy.open-cluster-management.io/categories']) {
    this.expect.element('table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody > tr:nth-child(1) > td:nth-child(8)').text.to.equal(cleanAndCapitalize(data[0].metadata.annotations['policy.open-cluster-management.io/controls']))
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
  this.waitForElementNotPresent('@spinner')
  // DETAILS TAB TESTS
  // Check policy details
  this.expect.element('.bx--detail-page-header-title').text.to.equal(name)
  this.expect.element('.section-title:nth-of-type(1)').text.to.equal('Policy details')
  this.expect.element('.pf-c-description-list:nth-child(1) > .pf-c-description-list__group:nth-child(1) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(name)
  this.expect.element('.pf-c-description-list:nth-child(1) > .pf-c-description-list__group:nth-child(3) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(data[0].spec.remediationAction)
  this.expect.element('.pf-c-description-list:nth-child(1) > .pf-c-description-list__group:nth-child(4) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(data[0].spec.disabled.toString())
  this.expect.element('.pf-c-description-list:nth-child(3) > .pf-c-description-list__group:nth-child(1) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/categories'])
  this.expect.element('.pf-c-description-list:nth-child(3) > .pf-c-description-list__group:nth-child(2) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/controls'])
  this.expect.element('.pf-c-description-list:nth-child(3) > .pf-c-description-list__group:nth-child(3) > .pf-c-description-list__description > .pf-c-description-list__text').text.to.equal(data[0].metadata.annotations['policy.open-cluster-management.io/standards'])
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
  this.waitForElementVisible('#status-tab')
  this.click('#status-tab')
  this.waitForElementNotPresent('@spinner')
  // YAML TAB TESTS
  this.waitForElementVisible('#yaml-tab')
  this.click('#yaml-tab')
  this.waitForElementVisible('.monaco-editor')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(1)')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(2)')
  // Return to All Policies page
  this.click('.bx--breadcrumb > div:nth-child(1)')
}

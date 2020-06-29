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
    policyNameInput: '#name',
    namespaceDropdown: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box',
    namespaceDropdownBox: '.creation-view-controls-container > div > div:nth-child(2) > div.bx--list-box > div.bx--list-box__menu > div',
    templateDropdown: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box',
    templateDropdownBox: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    templateDropdownInput: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    templateDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(3) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    clusterSelectorDropdown: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box',
    clusterSelectorDropdownBox: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    clusterSelectorDropdownInput: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    clusterSelectorDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    clusterSelectorDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(4) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    standardsDropdown: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box',
    standardsDropdownBox: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    standardsDropdownInput: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    standardsDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    standardsDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(5) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    categoriesDropdown: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box',
    categoriesDropdownBox: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    categoriesDropdownInput: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    categoriesDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    categoriesDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(6) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    controlsDropdown: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box',
    controlsDropdownBox: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__menu > div',
    controlsDropdownInput: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > input',
    controlsDropdownClearAll: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear all selected items"]',
    controlsDropdownClearValue: '.creation-view-controls-container > div > div:nth-child(7) > div.bx--multi-select.bx--list-box > div.bx--list-box__field > div.bx--list-box__selection[title="Clear selected item"]',
    enforceCheckbox: '#enforce ~ .checkbox',
    disableCheckbox: '#disabled ~ .checkbox',
  },
  commands: [{
    verifySummary,
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
  const dropdownBox = 'div.module-grc-cards > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2)'
  //Categories summary
  this.click(dropdownBox + ' > div:nth-child(1)')
  browser.pause(1000)
  checkPolicySummaryCards.call(this, browser)
  browser.pause(1000)//wait 1s for checkPolicySummaryCards func
  //Standards summary
  this.click('@summaryDropdown')
  browser.pause(1000)
  this.click(dropdownBox + ' > div:nth-child(2)')
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
/*
 * Create a policy given spec object with arrays of policy options
 *
 * Defaults to the 'default' namespace with the first available policy template.
 * If 'clear' is set to true, will clear out default Standard/Category/Controls
 * and replace with given spec
 * Validates against the given templateFile (will skip if none is given)
*/
function createTestPolicy(create = true, clear = false,
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
  /* Press Create Policy Button (if we're not already at the Create page)
     If we're already at the page, reset the form */
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
  this.click('@yamlMonacoEditor')
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
  /* Select Specification template -- append ' - ' to
  make sure we're filtering for the precise template name */
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
  /* Select Cluster Placement Binding(s) */
  if (spec.cluster && spec.cluster[0] != '') {
    this.expect.element('@clusterSelectorClearAll').to.not.be.present
    this.click('@clusterSelectorDropdown')
    this.waitForElementVisible('@clusterSelectorDropdownBox')
    spec.cluster.forEach(item => {
      this.setValue('@clusterSelectorDropdownInput', item)
      this.click('@clusterSelectorDropdownBox:nth-child(1)')
      this.click('@clusterSelectorDropdownClearValue')
    })
    this.click('@clusterSelectorDropdownInput')
    this.waitForElementNotPresent('@clusterSelectorDropdownBox')
  }
  /* Clear out all template input if requested */
  if (clear) {
    /* Clear standards */
    this.click('@standardsDropdownClearAll')
    this.expect.element('@standardsDropdownClearAll').to.not.be.present
    /* Clear categories */
    this.click('@categoriesDropdownClearAll')
    this.expect.element('@categoriesDropdownClearAll').to.not.be.present
    /* Clear controls */
    this.click('@controlsDropdownClearAll')
    this.expect.element('@controlsDropdownClearAll').to.not.be.present
  }
  /* Select Security Standard(s) */
  if (spec.standard && spec.standard[0] != '') {
    this.click('@standardsDropdown')
    this.waitForElementVisible('@standardsDropdownBox')
    spec.standard.forEach(item => {
      this.setValue('@standardsDropdownInput', item)
      this.click('@standardsDropdownBox:nth-child(1)')
      this.click('@standardsDropdownClearValue')
    })
    this.click('@standardsDropdownInput')
    this.waitForElementNotPresent('@standardsDropdownBox')
  }
  /* Select Security Control Category(s) */
  if (spec.category && spec.category[0] != '') {
    this.click('@categoriesDropdown')
    this.waitForElementVisible('@categoriesDropdownBox')
    spec.category.forEach(item => {
      this.setValue('@categoriesDropdownInput', item)
      this.click('@categoriesDropdownBox:nth-child(1)')
      this.click('@categoriesDropdownClearValue')
    })
    this.click('@categoriesDropdownInput')
    this.waitForElementNotPresent('@categoriesDropdownBox')
  }
  /* Select Security Control(s) */
  if (spec.control && spec.control[0] != '') {
    this.click('@controlsDropdown')
    this.waitForElementVisible('@controlsDropdownBox')
    spec.control.forEach(item => {
      this.setValue('@controlsDropdownInput', item)
      this.click('@controlsDropdownBox:nth-child(1)')
      this.click('@controlsDropdownClearValue')
    })
    this.click('@controlsDropdownInput')
    this.waitForElementNotPresent('@controlsDropdownBox')
  }
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
    this.api.execute('return window.monaco.editor.getModels()[0].getValue()', [], (result) => {
      const expected = fs.readFileSync(path.join(__dirname, `../e2e/yaml/create_policy/${templateFile}`), 'utf8')
      const actual = result.value
      /* Iterate over YAML for more helpful error messaging and to replace policy name */
      const expectedLines = expected.split(/\r?\n/)
      const actualLines = actual.split(/\r?\n/)
      let i = 0, diff = '', same = true
      while (same && (i < expectedLines.length || i < actualLines.length)) {
        if (i < expectedLines.length) {
          if (i < actualLines.length) {
            if (expectedLines[i].replace('[TEST_POLICY_NAME]', spec.policyName) != actualLines[i]) {
              diff = 'EXPECTED: ' + expectedLines[i] + '\nACTUAL: ' + actualLines[i] + '\n---\n'
              same = false
            }
          } else {
            diff = 'EXPECTED: ' + expectedLines[i] + '\nACTUAL: <EOF>' + '\n---\n'
            same = false
          }
        } else {
          diff = 'EXPECTED: <EOF>\nACTUAL: ' + actualLines[i] + '\n---\n'
          same = false
        }
        i++
      }
      /* Assert results of line-by-line YAML comparison */
      if (!same) {
        this.assert.fail(`YAML in editor differs from expected YAML (${templateFile}) on Line ${i}:\n` + diff)
      } else {
        this.assert.ok(true, `YAML in editor matches expected YAML (${templateFile}).`)
      }
    })
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
function testDetailsPage(browser, name) {
  this.click('tbody>tr>td>a')
  //overview tab test
  this.expect.element('.bx--detail-page-header-title').text.to.equal(name)
  this.expect.element('.section-title:nth-of-type(1)').text.to.equal('Policy details')
  this.expect.element('.new-structured-list > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').text.to.equal(name)
  this.expect.element('.overview-content > div:nth-child(2) > .section-title').text.to.equal('Placement')
  this.waitForElementVisible('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement rule')
  this.expect.element('.overview-content-second > div:nth-child(1) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('placement-' + name)
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > div:nth-child(1) > .bx--module__title').text.to.equal('Placement binding')
  this.expect.element('.overview-content-second > div:nth-child(2) > div > div > .bx--module__content > section > div > div:nth-child(1) > div:nth-child(2)').text.to.equal('binding-' + name)
  this.expect.element('.overview-content > div:nth-child(3) > .section-title').text.to.equal('Policy templates')
  //violation tab test
  this.waitForElementVisible('#violation-tab')
  this.click('#violation-tab')
  this.waitForElementNotPresent('#spinner')
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
  //policy yaml page test
  this.waitForElementVisible('#yaml-tab')
  this.click('#yaml-tab')
  this.waitForElementVisible('.monaco-editor')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(1)')
  this.waitForElementVisible('.yaml-editor-button > button:nth-child(2)')
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

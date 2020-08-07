/* Copyright (c) 2020 Red Hat, Inc. */

module.exports = {
  elements: {
    spinner: '.content-spinner',
    searchInput: '#search',
    allTable: 'table.bx--data-table-v2.resource-table.bx--data-table-v2--zebra > tbody'
  },
  commands: [{
    verifyAllTable
  }]
}
/* Verify user can only see policies they should on the summary page */
function verifyAllTable (ns, nsNum) {
  this.waitForElementVisible('@searchInput')
  this.setValue('@searchInput', ns)
  this.waitForElementVisible('@allTable')
  this.expect.element('@allTable').to.have.property('childElementCount').equals(nsNum)
}

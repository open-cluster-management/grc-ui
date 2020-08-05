/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.*/

module.exports = {
  enterTextInYamlEditor: (el, browser, yaml, time) => {
    el.click('.monaco-editor')
    el.api.execute(
      `const monaco = window.monaco.editor.getModels()[0]\n \
      monaco.pushEditOperations([], \
        [{ \
          range:monaco.getFullModelRange(), \
          text:'${yaml.replace(/\[TIME\]/g, time).replace(/\r?\n/g, '\\n').replace(/'/g, '\\\'')}' \
        }] \
      )`)
  }
}


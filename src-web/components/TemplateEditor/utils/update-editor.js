/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import {diff} from 'deep-diff'
import Handlebars from 'handlebars'
import { parseYAML } from './update-controls'
import _ from 'lodash'

export const generateYAML = (template, controlData) => {

  // convert controlData active into templateData
  // do replacements second in case it depends on previous templateData
  const templateData = {}
  const replacements = []
  const controlMap = {}
  controlData.forEach(control=>{
    const {active, userMap, id, hasLabels, hasReplacements} = control
    let {availableMap} = control
    availableMap = {...userMap, ...availableMap}
    controlMap[id] = control
    if (active) {
      if (hasLabels) {
        const map = {}
        active.forEach(pair=>{
          const {key, value} = availableMap[pair]
          let arr = map[key]
          if (!arr) {
            arr = map[key] = []
          }
          arr.push(value)
        })
        templateData[id] = map
      } else if (hasReplacements) {
        replacements.push(control)
      } else {
        templateData[id] = active
      }
    }
  })

  // add replacements
  const snippetMap = {}
  replacements.forEach(replacement=>{
    const {id, active, availableMap, hasCapturedUserSource, userData} = replacement
    if (active.length>0) {
      if (hasCapturedUserSource) {
        // restore snippet that user edited
        //const snippetKey = `____${id}____`
        //snippetMap[snippetKey] = userData
        //templateData[`${id}Capture`] = snippetKey
        templateData[`${id}Capture`] = userData
      } else {
        // add predefined snippets
        active.forEach((key, idx)=>{
          const {replacements} = availableMap[key]
          Object.entries(replacements).forEach(([id, partial]) => {
            const snippet = Handlebars.compile(partial)(templateData).trim()
            let arr = templateData[id]
            if (!arr) {
              arr = templateData[id] = []
            }

            // need to make sure yaml indents line up
            // see below for more
            if (snippet.indexOf('\n')!==-1) {
              const snippetKey = `____${id}-${idx}____`
              snippetMap[snippetKey] = snippet
              arr.push(snippetKey)
            } else if (!arr.includes(snippet)) {
              let wasSet = controlMap[id].wasSet
              if (!wasSet) {
                wasSet = controlMap[id].wasSet = new Set()
              }
              // if this control has already been set by this selection
              // don't do it again in case user unselected it
              if (!wasSet.has(key)) {
                arr.push(snippet)
                controlMap[id].active = arr
                wasSet.add(key)
              }
            }
          })
        })
      }
    } else {
      // user reset selection, remove its keys from wasSet
      Object.values(controlMap).forEach(({wasSet})=>{
        if (wasSet) {
          Object.keys(availableMap).forEach(key=>{
            wasSet.delete(key)
          })
        }
      })
      delete replacement.hasCapturedUserSource
      delete replacement.userData
    }
  })

  let yaml = template(templateData) || ''
  yaml = yaml.replace(/[\r\n]+/g, '\n')

  // find indent of key and indent the whole snippet
  Object.entries(snippetMap).forEach(([key, replace]) => {
    const regex = new RegExp(`^\\s+${key}`, 'gm')
    yaml = yaml.replace(regex, (str) => {
      const inx = str.indexOf(key)
      const indent = (inx !== -1) ? str.substring(0, inx) : '    '
      return indent + replace.replace(/[\r\n]+/g, '\n' + indent)
    })
  })
  if (!yaml.endsWith('\n')) {
    yaml+='\n'
  }
  return yaml
}

export const highlightChanges = (editor, oldYAML, newYAML) => {
  // mark any modified/added lines in editor
  const decorationList = []

  const getInside = (ikey, {parsed}) =>{
    const ret = {}
    Object.keys(parsed).forEach(key=>{
      ret[key] = _.get(parsed, `${key}[0].${ikey}`)
    })
    return ret
  }

  // determine what rows were modified or added
  const oldParse = parseYAML(oldYAML.replace(/\./g, '_')) // any periods will mess up the _.get later
  const newParse = parseYAML(newYAML.replace(/\./g, '_'))
  const oldRaw = getInside('$raw', oldParse)
  const newRaw = getInside('$raw', newParse)
  const newSynced = getInside('$synced', newParse)
  let firstModRow = null
  let firstNewRow = null
  const ignorePaths = []
  const diffs = diff(oldRaw, newRaw)
  if (diffs) {
    diffs.forEach(({kind, path, index, item})=>{
      const pathBase = path.shift()
      let newPath = path.length>0 ? pathBase + `.${path.join('.$v.')}` : pathBase
      let obj = _.get(newSynced, newPath)
      if (obj) {
        if (obj.$v || obj.$v===false) {
          // convert A's and E's into 'N's
          switch (kind) {
          case 'E': {
            if (obj.$l>1) {
              // convert edit to new is multilines added
              kind = 'N'
              obj = {$r: obj.$r+1, $l: obj.$l-1}
            }
            break
          }
          case 'A': {
            switch (item.kind) {
            case 'N':
              // convert new array item to new range
              kind = 'N'
              if (obj.$l<=1) {
                obj = obj.$v[index]
              }
              break
            case 'D':
              // if array delete, ignore any other edits within array
              // edits are just the comparison of other array items
              ignorePaths.push(path.join('/'))
              break
            }
            break
          }
          }
        } else if (obj.$l>1 && path.length>0 && kind!=='D') {
          kind = 'N'
          path.pop()
          newPath = pathBase + `.${path.join('.$v.')}`
          obj = _.get(newSynced, newPath)
        } else {
          kind = 'D'
        }

        // if array delete, ignore any other edits within array
        // edits are just the comparison of other array items
        if (ignorePaths.length>0) {
          const tp = path.join('/')
          if (ignorePaths.some(p=>{
            return tp.startsWith(p)
          })) {
          // ignore any edits within an array that had an imtem deleted
            kind='D'
          }
        }

        switch (kind) {
        case 'E': {// edited
          if (obj.$v || obj.$v===false) { // if no value ignore--all values removed from a key
            if (editor) {
              decorationList.push({
                range: new editor.monaco.Range(obj.$r+1, 0, obj.$r+1, 0),
                options: {isWholeLine: true, linesDecorationsClassName: 'insertedLineDecoration',
                  minimap: {color: '#c0c0ff' , position:2}}
              })
            }
            if (!firstModRow) {
              firstModRow = obj.$r
            }
          }
          break
        }
        case 'N': // new
          if (editor) {
            decorationList.push({
              range: new editor.monaco.Range(obj.$r+1, 0, obj.$r+obj.$l, 0),
              options: {isWholeLine: true, linesDecorationsClassName: 'insertedLineDecoration',
                minimap: {color: '#c0c0ff' , position:2}}
            })
          }
          if (!firstNewRow) {
            firstNewRow = obj.$r
          }
          break
        }
      }
    })
    // wait until editor has content before highlighting
    setTimeout(() => {
      editor.decorations = editor.deltaDecorations(editor.decorations, decorationList)
    }, 0)
    if (editor && (firstNewRow || firstModRow)) {
      const lineNumber = firstNewRow || firstModRow || 0
      editor.revealLinesInCenter(lineNumber, lineNumber+10, 0)

    }
  }
}

export const getUniqueName = (name, nameSet) => {
  if (nameSet.has(name)) {
    let count=1
    const baseName = name.replace(/-*\d+$/, '')
    do {
      name = `${baseName}-${count++}`
    } while (nameSet.has(name))
  }
  return name
}


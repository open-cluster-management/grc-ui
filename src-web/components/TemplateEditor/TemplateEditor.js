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

import React from 'react'
import ReactDOM from 'react-dom'
import SplitPane from 'react-split-pane'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  Button,
  Loading,
  Notification,
  TextInput,
  Checkbox,
  DropdownV2,
  TooltipIcon,
  MultiSelect,
  ToggleSmall} from 'carbon-components-react'
import { initializeControlData, cacheUserData, updateControls, parseYAML } from './utils/update-controls'
import { generateYAML, highlightChanges, getUniqueName } from './utils/update-editor'
import { validateYAML } from './utils/validate-yaml'
import EditorBar from './components/EditorBar'
import YamlEditor from './components/YamlEditor'
import './scss/template-editor.scss'
import msgs from '../../../nls/platform.properties'
import '../../../graphics/diagramIcons.svg'
import _ from 'lodash'

const tempCookie= 'template-editor-open-cookie'

export default class TemplateEditor extends React.Component {

  static propTypes = {
    controlData: PropTypes.array.isRequired,
    createControl: PropTypes.shape({
      createResource: PropTypes.func,
      cancelCreate: PropTypes.func,
      creationStatus: PropTypes.string,
      creationMsg: PropTypes.string
    }).isRequired,
    fetchControl: PropTypes.shape({
      isLoaded: PropTypes.bool,
      isFailed: PropTypes.bool,
      error: PropTypes.object
    }),
    locale: PropTypes.string,
    portals: PropTypes.object.isRequired,
    template: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  static getDerivedStateFromProps(props, state) {
    const {fetchControl, createControl={}} = props
    const {isLoaded} = fetchControl || {isLoaded:true}
    const {creationStatus, creationMsg} = createControl
    if (creationStatus === 'ERROR') {
      return {updateMsgKind: 'error', updateMessage: creationMsg}
    } else if (isLoaded) {
      const { template, controlData: initialControlData } = props
      const { isCustomName } = state
      let { controlData, templateYAML, templateObject } = state

      // initialize controlData, templateYAML, templateObject
      if (!controlData) {
        controlData = initializeControlData(template, initialControlData)
        templateYAML = generateYAML(template, controlData)
        templateObject = parseYAML(templateYAML).parsed
        return { controlData, templateYAML, templateObject }
      }

      // make sure an auto generated name is unique
      if (!isCustomName) {
        const name = controlData.find(({id})=>id==='name')
        if (name) {
          const {active, existing} = name
          const uniqueName = getUniqueName(active, new Set(existing))
          if (uniqueName !==active) {
            name.active = uniqueName
            templateYAML = generateYAML(template, controlData)
            templateObject = parseYAML(templateYAML).parsed
            return { controlData, templateYAML, templateObject }
          }
        }
      }
    }
    return null
  }

  constructor (props) {
    super(props)
    let showEditor = localStorage.getItem(tempCookie)
    showEditor = showEditor===null || showEditor==='true' ? true : false
    this.state = {
      isCustomName: false,
      showEditor,
      exceptions: [],
      updateMessage: '',
      hasUndo: false,
      hasRedo: false,
    }
    this.multiSelectCmpMap = {}
    this.layoutEditorsDebounced = _.debounce(() => {
      this.layoutEditors()
    }, 150)
    this.parseDebounced = _.debounce(()=>{
      this.handleParse()
    }, 500)
    this.handleEditorCommand = this.handleEditorCommand.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.gotoEditorLine = this.gotoEditorLine.bind(this)
    const { type='unknown' } = this.props
    this.splitterSizeCookie = `TEMPLATE-EDITOR-SPLITTER-SIZE-${type.toUpperCase()}`
  }

  componentWillMount() {
    this.resetEditor()
  }

  setSplitPaneRef = splitPane => (this.splitPane = splitPane);

  handleSplitterDefault = () => {
    const cookie = localStorage.getItem(this.splitterSizeCookie)
    let size = cookie ? parseInt(cookie) : 1000
    const page = document.getElementById('page')
    if (page) {
      const width = page.getBoundingClientRect().width
      if (!cookie) {
        size = width*.4
      } else if (size > (width*7/10)) {
        size = width * 7 / 10
      }
    }
    return size
  }

  handleSplitterChange = size => {
    localStorage.setItem(this.splitterSizeCookie, size)
    this.layoutEditorsDebounced()
  };

  setContainerRef = container => {
    this.containerRef = container
    this.layoutEditors()
  };

  render() {
    const {fetchControl, locale} = this.props
    const {isLoaded, isFailed, error} = fetchControl || {isLoaded:true}
    const { showEditor, resetInx } = this.state

    if (!isLoaded) {
      return <Loading withOverlay={false} className='content-spinner' />
    }

    if (isFailed) {
      if (error.name === 'PermissionError') {
        return <Notification title='' className='overview-notification' kind='error'
          subtitle={msgs.get('error.permission.denied.create', locale)} />
      }
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />
    }

    const viewClasses = classNames({
      'creation-view': true,
      showEditor
    })
    return (
      <div key={`key${resetInx}`} className={viewClasses} ref={this.setContainerRef}>
        {this.renderEditButton()}
        {this.renderCreateButton()}
        {this.renderCancelButton()}
        {this.renderSplitEditor()}
      </div>
    )
  }

  renderSplitEditor() {
    const { showEditor } = this.state
    const editorClasses = classNames({
      'creation-view-split-container': true,
      showEditor
    })
    let maxSize
    const page = document.getElementById('page')
    if (page) {
      maxSize = page.getBoundingClientRect().width*8/10
    }
    return (
      <div className={editorClasses}>
        {showEditor ? (
          <SplitPane
            split="vertical"
            minSize={50}
            maxSize={maxSize}
            ref={this.setSplitPaneRef}
            defaultSize={this.handleSplitterDefault()}
            onChange={this.handleSplitterChange}
          >
            {this.renderControls()}
            {this.renderEditor()}
          </SplitPane>
        ) : (
          <div className='creation-view-split-controls-help-container'>
            {this.renderControls()}
          </div>
        )}
      </div>
    )
  }

  renderControls() {
    const { locale } = this.props
    const {controlData} = this.state
    return (
      <div className='creation-view-controls-container' >
        {this.renderNotifications()}
        <div className='creation-view-controls-note'>{msgs.get('creation.view.required.mark', locale)}</div>
        <div className='creation-view-controls' >
          {controlData.map(control => {
            const {id, type} = control
            switch (type) {
            case 'text':
              return (<React.Fragment key={id}>
                {this.renderTextInput(control)}
              </React.Fragment>)
            case 'singleselect':
              return (<React.Fragment key={id}>
                {this.renderSingleSelect(control)}
              </React.Fragment>)
            case 'multiselect':
              return (<React.Fragment key={id}>
                {this.renderMultiSelect(control)}
              </React.Fragment>)
            case 'checkbox':
              return (<React.Fragment key={id}>
                {this.renderCheckbox(control)}
              </React.Fragment>)
            }
            return null
          })}
        </div>
      </div>
    )
  }

  renderNotifications() {
    const { locale } = this.props
    const { updateMessage, updateMsgKind } = this.state
    if (updateMessage) {

      const handleClick = () => {
      }
      const handleKeyPress = (e) => {
        if ( e.key === 'Enter') {
          handleClick()
        }
      }





      return <div role='button' onClick={handleClick}
        tabIndex="0" aria-label={updateMessage} onKeyDown={handleKeyPress}>
        <div  >
          <Notification
            key={updateMessage}
            kind={updateMsgKind}
            title={updateMsgKind==='error' ?
              msgs.get('error.create.policy', locale) :
              msgs.get('success.create.policy', locale) }
            iconDescription=''
            subtitle={updateMessage}
            className='persistent notification'
            onCloseButtonClick={this.handleUpdateMessageClosed}
          />
        </div>
      </div>
    }
    return null
  }

  renderTextInput(control) {
    const {id, name, active:value, existing, mustExist} = control

    // special case--validate that name is unique
    let invalid = false
    if (id==='name') {
      const { isCustomName } = this.state
      if (isCustomName && existing) {
        invalid = new Set(existing).has(value)
      }
    }

    return (
      <React.Fragment>
        <div className='creation-view-controls-textbox'>
          <div className="creation-view-controls-textbox-title">
            {name}
            {mustExist ? <div className='creation-view-controls-must-exist'>*</div> : null}
          </div>
          <TextInput
            id={id}
            invalid={invalid}
            hideLabel
            labelText=''
            value={value}
            onChange={this.onChange.bind(this, id)} />
        </div>
      </React.Fragment>
    )
  }

  renderCheckbox(control) {
    const {id, name, description, active} = control
    return (
      <React.Fragment>
        <div className='creation-view-controls-checkbox'>
          <Checkbox
            id={id}
            className='checkbox'
            hideLabel
            labelText=''
            checked={active}
            onChange={this.onChange.bind(this, id)} />
          <div>{name}</div>
          <TooltipIcon direction='top' tooltipText={description}>
            <svg className='info-icon'>
              <use href={'#diagramIcons_info'} ></use>
            </svg>
          </TooltipIcon>
        </div>
      </React.Fragment>
    )
  }

  renderSingleSelect(control) {
    const {locale} = this.props
    const {id, name, available, description, isOneSelection, mustExist} = control
    let { active } = control
    // for DropdownV2, empty initialSelectedItem means no pre-selected
    active = (active && typeof active === 'string') ? active : ''
    const key = `${id}-${active}`
    return (
      <React.Fragment>
        <div className='creation-view-controls-singleselect'
          ref={isOneSelection ? ()=>{} : this.setMultiSelectCmp.bind(this, id)} >
          <div className="creation-view-controls-multiselect-title">
            {name}
            {mustExist ? <div className='creation-view-controls-must-exist'>*</div> : null}
            <TooltipIcon direction='top' tooltipText={description}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
          <DropdownV2
            key={key}
            label={msgs.get('policy.create.namespace.tooltip', locale)}
            items={available}
            onChange={this.handleChange.bind(this, id)}
            initialSelectedItem={active} />
        </div>
      </React.Fragment>
    )
  }

  renderMultiSelect(control) {
    const {locale} = this.props
    const {id, name, placeholder:ph, description, isOneSelection, mustExist} = control

    // see if we need to add user additions to available (from editing the yaml file)
    const {userData, userMap, hasCapturedUserSource} = control
    let {active=[], available, availableMap} = control
    if (userData) {
      if (!hasCapturedUserSource) {
        available = [...userData, ...available]
        availableMap = {...userMap, ...availableMap}
      } else {
        // if user edited the source, we can't automatically update it
        active = available = [msgs.get('creation.view.policy.custom', locale)]
        availableMap = undefined
      }
    }

    // place holder
    let placeholder = ph
    if (active.length>0) {
      const activeKeys = []
      active.forEach(key=>{
        if (typeof availableMap ==='object' && availableMap[key]) {
          const {name} = availableMap[key]
          activeKeys.push(name||key)
        } else {
          activeKeys.push(key)
        }
      })
      placeholder = activeKeys.join(', ')
    }

    // change key if active changes so that carbon component is re-created with new initial values
    const key = `${id}-${active.join('-')}`
    return (
      <React.Fragment>
        <div className='creation-view-controls-multiselect'
          ref={isOneSelection ? ()=>{} : this.setMultiSelectCmp.bind(this, id)} >
          <div className="creation-view-controls-multiselect-title">
            {name}
            {mustExist ? <div className='creation-view-controls-must-exist'>*</div> : null}
            <TooltipIcon direction='top' tooltipText={description}>
              <svg className='info-icon'>
                <use href={'#diagramIcons_info'} ></use>
              </svg>
            </TooltipIcon>
          </div>
          <MultiSelect.Filterable
            key={key}
            items={available}
            initialSelectedItems={active}
            placeholder={placeholder}
            itemToString={item=>item}
            onChange={this.handleChange.bind(this, id)} />
        </div>
      </React.Fragment>
    )
  }

  renderEditor() {
    const { locale } = this.context
    const { templateYAML, hasUndo, hasRedo, exceptions } = this.state
    const editorToolbarTitle = msgs.get('editor.toolbar', this.context.locale)

    return (
      <div className='creation-view-yaml' >
        <div className='creation-view-yaml-header' >
          <div className='creation-view-yaml-header-title'>
            {msgs.get('creation.view.yaml', locale)}
          </div>
          <div className='creation-view-yaml-header-toolbar' role='region' aria-label={editorToolbarTitle} id={editorToolbarTitle}>
            <EditorBar
              hasUndo={hasUndo}
              hasRedo={hasRedo}
              exceptions={exceptions}
              gotoEditorLine={this.gotoEditorLine}
              handleEditorCommand={this.handleEditorCommand}
              handleSearchChange={this.handleSearchChange}
            />
          </div>
        </div>
        <YamlEditor
          width={'100%'}
          height={'100%'}
          wrapEnabled={true}
          setEditor={this.setEditor}
          onYamlChange={this.handleEditorChange}
          yaml={templateYAML} />
      </div>
    )
  }


  handleChange(field, evt) {
    const multiSelect = this.multiSelectCmpMap[field]

    // if this multiselect has an isOneSelection option, close on any selection
    if (multiSelect) {
      // if menu is still open don't update until its gone
      // unfortunately MultiSelect.Filterable doesn't have an onClose
      const menu = multiSelect.getElementsByClassName('bx--list-box__menu')
      if (menu && menu.length>0) {
        multiSelect.selectedItems = evt.selectedItems
        if (!multiSelect.observer) {
          multiSelect.observer = new MutationObserver(() => {
            this.onChange(field, {selectedItems: multiSelect.selectedItems})
            multiSelect.observer.disconnect()
            delete multiSelect.observer
          })
          multiSelect.observer.observe(menu[0].parentNode, {
            childList: true
          })
        }
        return
      }
    }
    this.onChange(field, evt)
  }

  onChange(field, evt) {
    let updateName = false
    let { isCustomName } = this.state
    const { controlData, templateYAML } = this.state
    const control = controlData.find(({id})=>id===field)
    switch (control.type) {
    case 'text':
      control.active = evt.target.value
      isCustomName = field==='name'
      break
    case 'singleselect':
      control.active = evt.selectedItem
      break
    case 'multiselect':
      control.active = evt.selectedItems
      // if user was able to select something that automatically
      // generates the name, blow away the user name
      updateName = !isCustomName && control.updateNamePrefix
      break
    case 'checkbox':
      control.active = evt
      break
    }

    // update name if spec changed
    if (updateName) {
      let cname
      const nname = controlData.find(({id})=>id==='name')
      if (nname) {
        if (control.active.length>0) {
          cname = control.updateNamePrefix +
            control.availableMap[control.active[0]].name.replace(/\W/g, '-')
        } else {
          cname = this.props.controlData.find(({id})=>id==='name').active
        }
        nname.active = cname.toLowerCase()
      }
    }

    const {template} = this.props
    const newYAML = generateYAML(template, controlData)
    const templateObject = parseYAML(newYAML).parsed
    this.setState({controlData, isCustomName, templateYAML: newYAML, templateObject, exceptions:[]})
    highlightChanges(this.editor, templateYAML, newYAML)
    return field
  }

  setMultiSelectCmp(field, ref) {
    this.multiSelectCmpMap[field] = ref
  }


  setEditor = (editor) => {
    this.editor = editor
    this.layoutEditors()
    this.selectTextLine = this.selectTextLine.bind(this)
    this.selectAfterRender = true
    this.editor.renderer.on('afterRender', this.selectTextLine)
    this.editor.on('input', () => {
      const undoManager = this.editor.session.getUndoManager()
      if (this.resetUndoManager) {
        delete this.resetUndoManager
        undoManager.reset()
      }
      const hasUndo = undoManager.hasUndo()
      const hasRedo = undoManager.hasRedo()
      this.setState({hasUndo, hasRedo})
    })
  }

  layoutEditors() {
    if (this.editor) {
      this.editor.resize()
      this.editor.setAnimatedScroll(false)
      const cursor = this.editor.selection.getCursor()
      this.editor.scrollToLine(cursor.row, true)
    }
  }


  // select text editor line associated with selected node/link
  selectTextLine() {
    if (this.editor) {
      if (this.selectAfterRender) {
        this.editor.scrollToLine(0)
        this.editor.selection.moveCursorToPosition({row: 0, column: 0})
        this.editor.renderer.off('afterRender', this.selectTextLine)
        delete this.selectAfterRender
      }
    }
  }

  gotoEditorLine(line) {
    this.editor.renderer.STEPS = 25
    this.editor.setAnimatedScroll(true)
    this.editor.scrollToLine(line, true)
    this.editor.selection.moveCursorToPosition({row: line, column: 0})
    this.editor.selection.selectLine()
  }

  // text editor commands
  handleEditorCommand(command) {
    switch (command) {
    case 'next':
    case 'previous':
      if (this.selectionIndex!==-1) {
        if (this.selectionRanges && this.selectionRanges.length>1) {
          switch (command) {
          case 'next':
            this.selectionIndex++
            if (this.selectionIndex>=this.selectionRanges.length) {
              this.selectionIndex = 0
            }
            break
          case 'previous':
            this.selectionIndex--
            if (this.selectionIndex<0) {
              this.selectionIndex = this.selectionRanges.length-1
            }
            break
          }
          const range = this.selectionRanges[this.selectionIndex]
          this.editor.selection.setRange(range, true)
          this.editor.scrollToLine(range.start.row, true)
        }
      }
      break
    case 'undo':
      if (this.editor) {
        this.editor.undo()
      }
      break
    case 'redo':
      if (this.editor) {
        this.editor.redo()
      }
      break
    case 'restore':
      this.resetEditor()
      break
    case 'update':
      //where is defined?
      this.updateResources()
      break
    case 'close':
      this.closeEdit()
      break
    }
    return command
  }

  closeEdit()  {
    localStorage.setItem(tempCookie, false)
    this.setState({showEditor: false})
  }


  handleSearchChange(searchName) {
    if (searchName.length>1 || this.nameSearchMode) {
      this.editor.exitMultiSelectMode()
      if (searchName) {
        const found = this.editor.findAll(searchName)
        if (found>0) {
          const {start: {row}} = this.editor.getSelectionRange()
          this.editor.setAnimatedScroll(true)
          this.editor.scrollToLine(row, true)
          this.selectionRanges = this.editor.selection.getAllRanges()
          this.selectionIndex = 0
        }
      } else {
        this.selectionIndex = -1
      }
      this.nameSearch = searchName
      this.nameSearchMode = searchName.length>0
    }
  }

  handleEditorChange = (templateYAML) => {
    this.setState({templateYAML})
    delete this.resetUndoManager
    this.parseDebounced()
  }

  handleParse = () => {
    const {locale}= this.props
    let { isCustomName } = this.state
    const { templateYAML, templateObject } = this.state
    let { controlData } = this.state
    const { parsed: newParsed, exceptions} = parseYAML(templateYAML, locale)
    validateYAML(newParsed, controlData, exceptions, locale)

    // update editor annotations
    if (this.editor) {
      this.editor.session.setAnnotations(exceptions)
    }

    // if no exceptions, update controlData based on custom editing
    if (Object.keys(newParsed).length>0) {
      controlData = _.cloneDeep(controlData)
      if (updateControls(controlData, templateObject, newParsed)) {
        isCustomName = true
      }
    }
    this.setState({controlData, isCustomName, templateObject: newParsed, exceptions})
    return templateYAML // for jest test
  }

  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' })

  getResourceJSON() {
    const { locale } = this.context
    const { controlData, templateYAML } = this.state
    let errorMsg = null
    const { parsed, exceptions } = parseYAML(templateYAML, locale)
    if (exceptions.length===0) {
      validateYAML(parsed, controlData, exceptions, locale)
    }
    if (exceptions.length>0) {
      errorMsg = exceptions[0].text
    }
    this.setState({updateMsgKind: errorMsg?'error':'success', updateMessage: errorMsg||msgs.get('success.create.policy.check', locale)})
    if (!errorMsg) {
      // cache user data
      cacheUserData(controlData)

      // create payload
      const payload = []
      Object.entries(parsed).forEach(([, values])=>{
        values.forEach(({$raw})=>{
          if ($raw) {
            payload.push($raw)
          }
        })
      })
      return payload
    }
    return null
  }

  renderEditButton() {
    const { portals={}, locale } = this.props
    const { editBtn } = portals
    if (editBtn) {
      const portal = document.getElementById(editBtn)
      if (portal) {
        const { showEditor } = this.state
        const handleToggle = () => {
          if (showEditor) {
            localStorage.setItem(tempCookie, 'false')
          } else {
            localStorage.setItem(tempCookie, 'true')
          }
          this.setState({showEditor: !showEditor})
        }
        this.renderedPortals = true
        return ReactDOM.createPortal(
          <div className='edit-template-switch'>
            <ToggleSmall
              id='edit-yaml'
              ariaLabel={showEditor ? msgs.get('edit.yaml.on', locale) : msgs.get('edit.yaml.off', locale)}
              defaultToggled={showEditor}
              onChange={()=>{}}
              onToggle={handleToggle}
            />
            <div className='switch-label'>
              {showEditor ? msgs.get('edit.yaml.on', locale) : msgs.get('edit.yaml.off', locale)}
            </div>
          </div>, portal
        )
      }
    }
    return null
  }

  renderCreateButton() {
    const { portals={}, createControl, locale } = this.props
    const { createBtn } = portals
    if (createControl && createBtn) {
      const portal = document.getElementById(createBtn)
      if (portal) {
        return ReactDOM.createPortal(
          <Button id={createBtn}
            onClick={this.handleCreateResource.bind(this)}
            kind={'primary'} >
            {msgs.get('button.create', locale)}
          </Button>,
          portal
        )
      }
    }
    return null
  }

  handleCreateResource() {
    const { createControl } = this.props
    const {createResource} = createControl
    const resourceJSON = this.getResourceJSON()
    if (resourceJSON) {
      createResource(resourceJSON)
    }
  }

  renderCancelButton() {
    const { portals={}, createControl, locale } = this.props
    const { cancelBtn } = portals
    if (createControl && cancelBtn) {
      const portal = document.getElementById(cancelBtn)
      if (portal) {
        const {cancelCreate} = createControl
        return ReactDOM.createPortal(
          <Button id={cancelBtn}
            onClick={cancelCreate}
            kind={'secondary'} >
            {msgs.get('button.cancel', locale)}
          </Button>,
          portal
        )
      }
    }
    return null
  }

  resetEditor() {
    const { template, controlData: initialControlData } = this.props
    const controlData = initializeControlData(template, initialControlData)
    const templateYAML = generateYAML(template, controlData)
    const templateObject = parseYAML(templateYAML).parsed
    this.setState({ controlData, templateYAML, templateObject, exceptions:[], hasUndo: false, hasRedo: false})
    this.resetUndoManager = true
  }
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'

import 'brace/mode/yaml'
import 'brace/theme/vibrant_ink'

class IsomorphicEditor extends React.Component {

  static propTypes = {
    setEditor: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.setEditorRef = elem => {
      if (elem && props.setEditor) {
        props.setEditor(elem.editor)
      }
    }
    this.handleEscKeyPress = this.handleEscKeyPress.bind(this)
  }

  handleEscKeyPress(event) {
    if(event.key === 'Escape' && event.target.className === 'ace_text-input') {
      event.target.blur()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown',this.handleEscKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscKeyPress)
  }

  render = () => {
    return <AceEditor {...this.props} ref={this.setEditorRef} />
  }
}

const YamlEditor = ({ onYamlChange, setEditor, yaml, width='49.5vw', height='40vh', readOnly=false }) => (
  <div className="yamlEditorContainer">
    <IsomorphicEditor
      theme='vibrant_ink'
      mode={'yaml'}
      width={width}
      height={height}
      onChange={onYamlChange}
      fontSize={12}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={yaml}
      setOptions={{
        readOnly,
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{
        $blockScrolling: Infinity
      }}
      setEditor={setEditor}
    />
  </div>)

YamlEditor.propTypes = {
  height: PropTypes.string,
  onYamlChange: PropTypes.func,
  readOnly: PropTypes.bool,
  setEditor: PropTypes.func,
  width: PropTypes.string,
  yaml: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

export default YamlEditor

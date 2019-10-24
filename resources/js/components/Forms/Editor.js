import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor as Wysiwyg } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import classnames from 'classnames';

const propTypes = {
  value: PropTypes.string,
  onChangeCallback: PropTypes.func,
  onBlurCallback: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
};

const defaultProps = {
  value: '',
  onChangeCallback: () => {},
  onBlurCallback: () => {},
  className: '',
  name: '',
};

class Editor extends Component {
  constructor(props) {
    super(props);

    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentWillMount() {
    const { value: html } = this.props;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  onEditorStateChange(editorState) {
    const { onChangeCallback, name } = this.props;
    this.setState({
      editorState,
    });

    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChangeCallback(value, name);
  }

  onBlur() {
    const { onBlurCallback, name } = this.props;
    onBlurCallback(name);
  }

  render() {
    const { className } = this.props;
    const { editorState } = this.state;
    return (
      <Wysiwyg
        toolbar={{ options: ['inline', 'blockType', 'list', 'link'], list: { options: ['unordered', 'ordered'] } }}
        editorState={editorState}
        wrapperClassName={classnames('form-control overflow-hidden p-0', className)}
        editorClassName="editor-box pl-3 pr-3"
        onEditorStateChange={this.onEditorStateChange}
        onBlur={this.onBlur}
      />
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;

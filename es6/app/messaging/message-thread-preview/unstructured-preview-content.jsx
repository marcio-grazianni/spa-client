import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
})
class UnstructuredPreviewContent extends Component {
  _renderUnstructuredPreviewContent() {
    const {body} = this.props.message;
    let truncated_message = body;
    if (truncated_message.length > 32) {
      truncated_message = truncated_message.substring(0,32) + '...';
    }
    return (
      <div className='comments'>
        <div className='message-type'>
          {truncated_message}
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderUnstructuredPreviewContent()
    );
  }
}

export { UnstructuredPreviewContent };
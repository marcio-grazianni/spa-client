import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {ContactPreviewContent} from './message-thread-preview/contact-preview-content'
import {StructuredInboundPreviewContent} from './message-thread-preview/structured-inbound-preview-content'
import {StructuredOutboundPreviewContent} from './message-thread-preview/structured-outbound-preview-content'
import {UnstructuredPreviewContent} from './message-thread-preview/unstructured-preview-content'

@branch({
})
class MessageThreadPreview extends Component {
  _renderMessageThreadPreview() {
    const {last_message} = this.props.message_thread;
    let PreviewContent = <ContactPreviewContent {...this.props} />;
    if(last_message) {
      let structured = null !== last_message.meta_data;
      if(structured) {
        const message_type = last_message.meta_data.type;
        if('note' === message_type || 'concierge' === message_type) {
          structured = false;
        }
      }
      if(structured) {
        if('inbound' === last_message.direction) {
          PreviewContent = <StructuredInboundPreviewContent
                             message={last_message}
                             {...this.props}
                           />;
        } else {
          PreviewContent = <StructuredOutboundPreviewContent
                             message={last_message}
                             {...this.props}
                           />;
        }
      } else {
        PreviewContent = <UnstructuredPreviewContent
                           message={last_message}
                           {...this.props}
                         />;
      }
    }
    return (
      <div>
        {PreviewContent}
      </div>
    );
  }
  render() {
    return (
      ::this._renderMessageThreadPreview()
    );
  }
}

export { MessageThreadPreview };
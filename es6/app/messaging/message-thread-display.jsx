import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {InboundMessageContent} from './inbound-message-content'
import {OutboundMessageContent} from './outbound-message-content'
import {MessageThreadReply} from './message-thread-reply'
import {scrollToReply} from './actions'

@branch({
  message_thread: ['messages', 'current_message_thread'],
  displayed_messages: ['messages', 'displayed_messages'],
})
class MessageThreadDisplay extends Component {
  componentDidMount() {
    this.props.dispatch(
      scrollToReply
    );
  }
  componentDidUpdate() {
    this.props.dispatch(
      scrollToReply
    );
  }
  _renderMessageThreadDisplay() {
    const {message_thread, displayed_messages} = this.props;
    let Messages = [];
    if (message_thread) {
      for (var message of displayed_messages) {
        let item = null;
        let direction = message.direction;
        if ('inbound' === direction) {
          item = <InboundMessageContent
          key={message.uuid}
          message={message}
        />
        } else {
          item = <OutboundMessageContent
          key={message.uuid}
          message={message}
        />
        }
        Messages.push(item);
      }
    }
    return (
      <div className='right respond'>
        {
          message_thread &&
          <div className='message-thread-wrapper'>
            {Messages}
            <MessageThreadReply />
            <div className='message-thread-bottom' />
          </div>
        }
        {//no selected message thread
          !(message_thread) &&
          <div className='no-message-threads'>
            <i className='fa fa-comments'></i>
            <h4>No messages to show</h4>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderMessageThreadDisplay()
    );
  }
}

export { MessageThreadDisplay };
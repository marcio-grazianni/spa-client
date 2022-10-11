import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {confirmationToggle, toggleDropdown} from '../actions'
import {messagingLock, cancelReply, checkReply, reply} from './actions'


@branch({
  message_thread: ['messages', 'current_message_thread'],
  paid_account: ['account', 'paid_account'],
  pending: ['messages', 'sending_reply'],
})
class ReplyFooter extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _cancelReply() {
    this.props.dispatch(
      cancelReply
    )
  }
  _reply() {
    const {message_thread, paid_account} = this.props;
    if(!paid_account) {
      this.props.dispatch(
        messagingLock
      );
      return;
    }
    if(!message_thread.active && message_thread.reply_limit <= 0) {
      this.props.dispatch(
        confirmationToggle,
        'quota'
      );
      return;
    }
    let error = false;
    error = this.props.dispatch(
      checkReply
    );
    if(error) {
      return;
    }
    this.props.dispatch(
      reply
    );
  }
  _renderReplyFooter() {
    const {pending} = this.props;
    const buttonClass = classnames('btn', 'btn-reply', 'reply-submit', {'disabled': pending});
    return (
      <div className='reply-options-wrapper'>
        <ul className='reply-options'>
          <li>
            <button
              type='button'
              className='reply-cancel'
              onClick={::this._cancelReply}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              type='button'
              className={buttonClass}
              onClick={::this._reply}
            >
              Send
            </button>
          </li>
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReplyFooter()
    );
  }
}

export { ReplyFooter };
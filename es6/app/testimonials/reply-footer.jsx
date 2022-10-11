import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import classnames from 'classnames'
import {confirmationToggle} from '../actions'
import {cancelReply, checkReply} from './actions'


@branch({
  testimonial_confirm_enabled: ['user', 'testimonial_confirm_enabled']
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
    let error = false;
    error = this.props.dispatch(
      checkReply
    )
    if (!(error) && this.props.testimonial_confirm_enabled) {
      this.props.dispatch(
        confirmationToggle,
        'reply'
      )
    }
  }
  _renderReplyFooter() {
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
              className='btn btn-reply reply-submit'
              onClick={::this._reply}
            >
              Reply
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
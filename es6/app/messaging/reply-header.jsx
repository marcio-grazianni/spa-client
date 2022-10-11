import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {messagingLock, toggleArchived} from './actions'

@branch({
  first_name: ['user', 'first_name'],
  account_name: ['account', 'account_name'],
  paid_account: ['account', 'paid_account'],
  message_thread: ['messages', 'current_message_thread']
})
class ReplyHeader extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _toggleArchived() {
    const {paid_account} = this.props;
    if(!paid_account) {
      this.props.dispatch(
        messagingLock
      );
      return;
    }
    this.props.dispatch(
      toggleArchived,
      this.props.message_thread.archived
    )
  }
  _renderReplyHeader() {
    const {first_name, account_name} = this.props;
    const {archived} = this.props.message_thread;
    let archiveClass = classnames('open-indicator', {archived: archived});
    let tooltipText = archived ? 'Mark as open' : 'Mark as closed';
    return (
      <div className='reply-header-wrapper'>
        <div className='reply-header'>
          <div className='from-wrapper'>
            <label className='from-label'>
              From
            </label>
            <div className='from-info'>
              <div className='from'>{first_name} at {account_name}</div>
              <div className='date'>{moment().format("dddd, MMM D YYYY, h:mm a")}</div>
            </div>
          </div>
          <div className='reply-icon'>
            <span>
              <ReactTooltip id="archive-reply" multiline effect='solid' place='top'>
                <span>{tooltipText}</span>
              </ReactTooltip>
              <span className={archiveClass} data-tip data-for="archive-reply" onClick={::this._toggleArchived} >
                <i className='fa fa-check-circle' />
              </span>
              <i className='fa fa-reply'></i>
            </span>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReplyHeader()
    );
  }
}

export { ReplyHeader };
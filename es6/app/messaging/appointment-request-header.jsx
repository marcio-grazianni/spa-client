import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {messagingLock, toggleArchived} from './actions'


@branch({
  message_thread: ['messages', 'current_message_thread'],
  paid_account: ['account', 'paid_account']
})
class AppointmentRequestHeader extends Component {
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
  _renderInboundContentHeader() {
    const {created_at, archived} = this.props.message_thread;
    const {from, appointment_type, message_type} = this.props.message;

    const is_question = 'question' === message_type;
    const title = is_question ? 'Ask a Doctor' : 'Appointment Request';
    const now = moment(); //current moment
    let timestamp_moment = moment(created_at, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    let archiveClass = classnames('open-indicator', {archived: archived});
    let tooltipText = archived ? 'Mark as open' : 'Mark as closed';
    return (
      <div className='content-header'>
        <div className='sender'>
          <h4>{from}</h4>
          {title}
        </div>
        <div className='meta'>
          <div className='source-info'>
            <span>
              <ReactTooltip id="archive" multiline effect='solid' place='top'>
                <span>{tooltipText}</span>
              </ReactTooltip>
              <span className={archiveClass} data-tip data-for="archive"
                    onClick={::this._toggleArchived} >
                <i className='fa fa-check-circle' />
              </span>
              <img src={Django.static(`images/appointpal/circle-purple-thin-p.png`)} />
            </span>
          </div>
          <div className='timestamp'>
            {timestamp_moment.fromNow()}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderInboundContentHeader()
    );
  }
}

export { AppointmentRequestHeader };
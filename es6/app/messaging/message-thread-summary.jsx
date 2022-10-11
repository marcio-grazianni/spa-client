import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'
import {selectMessageThread} from './actions'
import {MessageThreadPreview} from './message-thread-preview'

@branch({
  vertical: ['account', 'vertical'],
  selected_type: ['messages', 'selected_type']
})
class MessageThreadSummary extends Component {
  _select () {
    this.props.dispatch(
      selectMessageThread,
      this.props.message_thread.uuid,
      this.props.message_thread.opened
    )
  }
  _renderMessageThreadSummary() {
    const {selected_type, active_message_thread} = this.props;
    const {active, uuid, subscriber_display, subscriber_obfuscated, opened, replied, last_message_received_at, archived} = this.props.message_thread;
    const subfilter_applied = 'all' != selected_type && 'appointments' != selected_type;
    let subscriber = active ? subscriber_display : subscriber_obfuscated;
    if (!subscriber) {
      subscriber = '(Anonymous)';
    }
    const now = moment(); //current moment
    let timestamp_moment = moment(last_message_received_at, "YYYY-MM-DDTHH:mm:ss.SSSZ"); //moment obj for timestamp
    if (timestamp_moment.isAfter(now)) {
      timestamp_moment = now;
    }
    const message_thread_class = classnames('message-thread', {'active': (uuid == active_message_thread)})
    let status_icon = '';
    if(archived) {
        status_icon = <i className='fa fa-check'></i>
    } else if(replied) {
        status_icon = <i className='fa fa-reply'></i>
    } else if (!opened) {
        status_icon = <i className='fa fa-circle'></i>
    }

    return (
      <li className={message_thread_class} onClick={::this._select}>
      {
        (status_icon) &&
        <div className='status'>
          {status_icon}
        </div>
      }
        <div className='info'>
          <div className='top-data'>
            <div className='from'>
              {subscriber}
            </div>
            <div className='timestamp'>
              {timestamp_moment.fromNow()}
            </div>
          </div>
          <div className='bottom-data'>
            <MessageThreadPreview {...this.props} />
            <div className='source-icon'>
            {
              !subfilter_applied &&
              <img src={Django.static(`images/appointpal/circle-purple-thin-p.png`)} />
            }
            {
              subfilter_applied &&
              <i className='fa fa-file-text' />
            }
            </div>
          </div>
        </div>
      </li> 
    );
  }
  render() {
    return (
      ::this._renderMessageThreadSummary()
    );
  }
}

export { MessageThreadSummary };
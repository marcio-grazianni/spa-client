import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {FilterBar} from './filter-bar'
import {MessageThreadSummary} from './message-thread-summary'
import {scrollToActiveThread} from './actions'

@branch({
  message_thread_list: ['messages', 'displayed_message_threads'],
  active_message_thread: ['messages', 'active_message_thread'],
})
class SelectMessageThread extends Component {
  componentDidMount() {
    this.props.dispatch(
      scrollToActiveThread
    );
  }
  componentDidUpdate() {
    this.props.dispatch(
      scrollToActiveThread
    );
  }
  _renderSelectMessageThread() {
    const {message_thread_list, active_message_thread} = this.props;
    let MessageThreadSummaries = [];
    for (var message_thread of message_thread_list) {
      let item = <MessageThreadSummary
          key={message_thread.uuid}
          message_thread={message_thread}
          active_message_thread={active_message_thread}
        />
      MessageThreadSummaries.push(item);
    }
    return (
      <div className='left select-response'>
        <div className='message-thread-summaries-wrapper'>
          <div className='message-thread-filter-wrapper'>
            <FilterBar />
          </div>
          <ul className='message-thread-list'>
            {MessageThreadSummaries}
          </ul>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderSelectMessageThread()
    );
  }
}

export { SelectMessageThread };
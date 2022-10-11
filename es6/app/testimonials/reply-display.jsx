import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
  account_name: ['account', 'account_name']
})
class ReplyDisplay extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderReplyDisplay() {
    const {reply, account_name} = this.props;
    return (
      <div className='reply-wrapper'>
        <div className='reply replied'>
          <div className='reply-header-wrapper'>
            <div className='reply-header'>
              <div className='from-wrapper'>
                <label className='from-label'>
                  From
                </label>
                <div className='from-info'>
                  <div className='from'>{reply.from} at {account_name}</div>
                  <div className='date'>{moment(reply.timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMM D YYYY, h:mm a")}</div>
                </div>
              </div>
              <div className='reply-icon replied'>
                <i className='fa fa-reply'></i>
              </div>
            </div>
          </div>
          <div className='reply-entry'>
            <p>{reply.body}</p>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderReplyDisplay()
    );
  }
}

export { ReplyDisplay };
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
  first_name: ['user', 'first_name'],
  account_name: ['account', 'account_name']
})
class ReplyHeader extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderReplyHeader() {
    const {first_name, account_name} = this.props;
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
            <i className='fa fa-reply'></i>
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
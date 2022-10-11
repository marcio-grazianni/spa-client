import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'

@branch({
})
class ContactPreviewContent extends Component {
  _renderContactPreviewContent() {
    const {active, subscriber_email, formatted_phone} = this.props.message_thread;
    let truncated_email = subscriber_email;
    if (truncated_email && truncated_email.length > 30) {
      truncated_email = truncated_email.substring(0,30) + '...';
    }
    return (
      <div className='comments'>
        {
          formatted_phone &&
          <div>
            <span>
              <i className="fa fa-phone"></i>
              {formatted_phone}
            </span>
          </div>
        }
        {
          subscriber_email &&
          <div>
            <span>
              <i className="fa fa-envelope"></i>
              {truncated_email}
            </span>
          </div>
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderContactPreviewContent()
    );
  }
}

export { ContactPreviewContent };
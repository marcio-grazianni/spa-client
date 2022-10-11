import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import moment from 'moment'
import classnames from 'classnames'

@branch({
  vertical: ['account', 'vertical']
})
class AppointmentRequestFooter extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _renderAppointmentRequestFooter() {
    const {message, vertical} = this.props;
    const {zip_code, requested_time_frame, appointment_type, is_question, question} = this.props.message;

    let when = '';
    switch (requested_time_frame) {
      case 'now':
        when = 'Immediately';
        break;
      case 'soon':
        when = 'Within a few months';
        break;
      case 'later':
        when = 'Just researching';
        break;
    }

    return (
      <div className='content-reply appointment-request-header'>
        <ul>
        {
          (is_question) &&
          <li><label>Question</label>: {question}</li>
        }
        {
          (!is_question) && ('cosmetic-surgery' == vertical) &&
          <li><label>Type</label>: {appointment_type}</li>
        }
        {
          (!is_question) && ('cosmetic-surgery' != vertical) &&
          <li><label>Preferred Time</label>: {appointment_type}</li>
        }
        </ul>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentRequestFooter()
    );
  }
}

export { AppointmentRequestFooter };
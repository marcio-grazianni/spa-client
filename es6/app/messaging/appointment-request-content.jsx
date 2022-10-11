import React, {Component} from 'react'
import {AppointmentRequestHeader} from './appointment-request-header'
import {AppointmentRequestFooter} from './appointment-request-footer'

class AppointmentRequestContent extends Component {
  _renderAppointmentRequestContent() {
    const {message} = this.props;
    return (
      <div className='content-wrapper'>
        <div className='content'>
          <AppointmentRequestHeader message={message} />
          <AppointmentRequestFooter message={message} />
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentRequestContent()
    );
  }
}

export { AppointmentRequestContent };
import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {dismissAppointmentConfirmation} from '../actions'

@branch({
  contact_phone_number: ['contact_phone_number'],
  vertical: ['vertical'],
})
class ConfirmAppointmentRequest extends Component {
  _dismissAppointmentConfirmation() {
    this.props.dispatch(dismissAppointmentConfirmation);
  }
  render() {
    const {contact_phone_number, vertical} = this.props;
    let appointment_text_upper = ('saas' == vertical) ? 'Demo' : 'Appointment';
    let appointment_text_lower = ('saas' == vertical) ? 'demo' : 'appointment';
    return (
      <div className="appointpal-booking-step confirm-appointment-request">
        <div className="appointpal-booking-step-body confirm-appointment-request-body">
          <h2>{appointment_text_upper} Requested</h2>
          <div className="confirm-appointment-request-info">
            <p>Thanks!  We'll be in touch shortly to confirm your appointment.</p>
          </div>
        </div>
        <div className='button-wrapper appointpal'>
          <button
            type='button'
            className='btn'
            onClick={::this._dismissAppointmentConfirmation}
          >
          Back
          </button>
        </div>
      </div>
    );
  }
}

export { ConfirmAppointmentRequest };
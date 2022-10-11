import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'

@branch({
})
class ConfirmAppointmentCompleted extends Component {
  _renderConfirmAppointmentCompleted() {
    return (
      <div className="appointpal-booking-step confirm-appointment-request">
        <div className="appointpal-booking-step-body confirm-appointment-request-body">
          <h2>Appointment Confirmed</h2>
          <div className="confirm-appointment-request-info">
            <p>Thanks!  We'll look forward to seeing you then.</p>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderConfirmAppointmentCompleted()
    );
  }
}

export { ConfirmAppointmentCompleted };
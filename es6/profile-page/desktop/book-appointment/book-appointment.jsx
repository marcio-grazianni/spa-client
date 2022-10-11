import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {SelectNewPatient} from './select-new-patient'
import {AppointmentInfo} from './appointment-info'
import {ConfirmAppointmentRequest} from './confirm-appointment-request'

@branch({
  booking_step: ['booking', 'booking_step'],
})
class BookAppointment extends Component {
  render() {
    const {booking_step} = this.props;
    return (
      <div className="book-appointment-wrapper">
        {
          (booking_step === 1) &&
          <SelectNewPatient />
        }
        {
          (booking_step === 2) &&
          <AppointmentInfo />
        }
        {
          (booking_step === 3) &&
          <ConfirmAppointmentRequest />
        }
      </div>
    );
  }
}

export { BookAppointment };
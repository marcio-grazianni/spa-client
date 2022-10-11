import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {confirmAppointment} from '../actions'

@branch({
  appointment: ['appointment']
})
class AppointmentInfo extends Component {
  _confirmAppointment() {
    this.props.dispatch(
      confirmAppointment
    );
  }
  _renderAppointmentInfo() {
    const {action_pending} = this.props.appointment;
    return (
      <div className="appointpal-booking-step appointment-info">
        <div className="appointpal-booking-step-body appointment-info-body">
          <h2>Confirm Your Appointment</h2>
          <div className="appointment-info-form">
            Appointment Info Goes Here.
          </div>
          <div className="button-wrapper appointpal">
            <button
              type='button'
              className='btn btn-confirm'
              onClick={::this._confirmAppointment}
              disabled={action_pending}
            >
            Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointmentInfo()
    );
  }
}

export { AppointmentInfo };
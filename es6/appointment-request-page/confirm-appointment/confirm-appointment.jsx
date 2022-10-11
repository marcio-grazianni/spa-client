import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Header} from '../common/header'
import {AppointmentInfo} from './appointment-info'
import {ConfirmAppointmentCompleted} from './confirm-appointment-completed'

@branch({
  appointment: ['appointment'],
})
class ConfirmAppointment extends Component {
  _renderConfirmAppointment() {
    const {action_completed} = this.props.appointment;
    return (
      <div className="book-appointment-mobile">
        <Header />
        {
          (!action_completed) &&
          <AppointmentInfo />
        }
        {
          (action_completed) &&
          <ConfirmAppointmentCompleted />
        }
      </div>
    );
  }
  render() {
    return (
      ::this._renderConfirmAppointment()
    );
  }
}

export { ConfirmAppointment };
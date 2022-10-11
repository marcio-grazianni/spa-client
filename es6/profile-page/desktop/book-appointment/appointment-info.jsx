import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Alert} from '../../UI/alert'
import {InputBox} from '../../UI/input-box'
import {BookAppointmentHeader} from './book-appointment-header'
import {changeLastName, changeFirstName, changePatientEmail, changePhoneNumber, changeTimeOfDay, appointmentInfoSubmit} from '../../actions'

@branch({
  account_info: ['booking', 'appointment_info'],
  sending: ['booking', 'sending'],
  alert: ['alpha_alert'],
})
class AppointmentInfo extends Component {
  _changeLastName(e) {
    this.props.dispatch(
      changeLastName,
      e.currentTarget.value
    )
  }
  _changeFirstName(e) {
    this.props.dispatch(
      changeFirstName,
      e.currentTarget.value
    )
  }
  _changeEmail(e) {
    this.props.dispatch(
      changePatientEmail,
      e.currentTarget.value
    )
  }
  _changePhoneNumber(e) {
    this.props.dispatch(
      changePhoneNumber,
      e.currentTarget.value
    )
  }
  _changeTimeOfDay(e) {
    this.props.dispatch(
      changeTimeOfDay,
      e.currentTarget.value
    )
  }
  _nextStep() {
    this.props.dispatch(
      appointmentInfoSubmit
    );
  }
  render() {
    const {alert, sending} = this.props;
    const {first_name, last_name, phone_number, email, time_of_day} = this.props.account_info;
    return (
      <div className="appointment-info">
        <BookAppointmentHeader />
        <div className="appointment-info-body">
          <h2>Tell us about yourself.</h2>
          <div className="appointment-info-form">
              <form autoComplete="off">
                {
                  (alert) &&
                  <div className='alert-wrapper'>
                    <Alert alert={alert} alpha={true} />
                  </div>
                }
                <InputBox
                  id="first_name"
                  placeholder="First Name"
                  input_type="text"
                  value={first_name.value}
                  error={first_name.error}
                  onChange={::this._changeFirstName}
                />
                <InputBox
                  id="last_name"
                  placeholder="Last Name"
                  input_type="text"
                  value={last_name.value}
                  error={last_name.error}
                  onChange={::this._changeLastName}
                />
                <InputBox
                  id="phone_number"
                  placeholder="Phone Number"
                  input_type="text"
                  value={phone_number.value}
                  error={phone_number.error}
                  onChange={::this._changePhoneNumber}
                />
                <InputBox
                  id="email"
                  placeholder="Email"
                  input_type="email"
                  value={email.value}
                  error={email.error}
                  onChange={::this._changeEmail}
                />
                <div className='appointment-time-group'>
                  <p>Preferred Time</p>
                  <label className='radio-inline' htmlFor="appointment_time_morning"><input id="appointment_time_morning" type="radio" name="appointment_time" value="0" onChange={::this._changeTimeOfDay} />Morning</label>
                  <label className='radio-inline' htmlFor="appointment_time_afternoon"><input id="appointment_time_afternoon" type="radio" name="appointment_time" value="1" onChange={::this._changeTimeOfDay} />Afternoon</label>
                  <label className='radio-inline' htmlFor="appointment_time_any"><input id="appointment_time_any" type="radio" name="appointment_time" value="2" defaultChecked="checked" onChange={::this._changeTimeOfDay} />First Available</label>
                </div>
              </form>
            </div>
        </div>
          <div className='button-wrapper'>
            <button
              type='button'
              className='btn btn-confirm'
              onClick={::this._nextStep}
              disabled={sending}
            >
            Submit
            </button>
          </div>
      </div>
    );
  }
}

export { AppointmentInfo };